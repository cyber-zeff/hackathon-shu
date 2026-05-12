# Tota-ly Guiding | AI Career + University Advisor

A full-stack AI-powered career guidance application rebranding as Tota-ly Guiding. It assesses users through 10 questions, generates 3 personalized career recommendations via padhleTota (Llama-3), and matches each career with top-ranked universities.

---

## Architecture Overview

```
┌─────────────────┐       ┌─────────────────────┐       ┌──────────────┐
│   Next.js App   │──────▶│  Next.js API Route  │──────▶│ Python/FastAPI│
│  (React UI)     │       │  /api/recommend     │       │  :8000       │
│  :3000          │       │  (BFF layer)        │       │              │
└─────────────────┘       └──────────┬──────────┘       └──────┬───────┘
                                     │                          │
                               universities.json           OpenAI API
                               (local static data)         (GPT-4o-mini)
```

**Flow:**
1. User completes 10-question assessment in React UI
2. Answers POSTed to Next.js `/api/recommend`
3. Next.js calls Python FastAPI `/recommend`
4. Python sends answers to OpenAI → gets 3 structured career objects
5. Next.js loads `data/universities.json`, matches by `career.field`, sorts by ranking, returns top 5
6. Results displayed in the React results page

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS |
| Package Manager | pnpm |
| API Routes | Next.js Route Handlers (Node.js) |
| AI Service | Python FastAPI + Uvicorn |
| AI Model | OpenAI GPT-4o-mini |
| Data | Static JSON (no database) |

---

## Project Structure

```
ai-advisor/
├── app/
│   ├── layout.tsx              # Root layout + Google Fonts
│   ├── globals.css             # Tailwind + CSS variables + animations
│   ├── page.tsx                # Landing page
│   ├── assessment/
│   │   └── page.tsx            # 10-question assessment flow
│   ├── results/
│   │   └── page.tsx            # Career + university results
│   └── api/
│       └── recommend/
│           └── route.ts        # Next.js BFF API route
├── lib/
│   ├── questions.ts            # Assessment questions data
│   └── types.ts                # Shared TypeScript types
├── data/
│   └── universities.json       # Static university data
├── python-service/
│   ├── main.py                 # FastAPI app + OpenAI logic
│   └── requirements.txt        # Python dependencies
├── .env.example                # Environment variable template
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Setup & Running

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Python 3.10+
- An OpenAI API key

---

### 1. Clone & Install (Next.js)

```bash
cd ai-advisor
pnpm install
```

### 2. Configure Environment

```bash
# Next.js environment
cp .env.example .env.local
# .env.local only needs PYTHON_SERVICE_URL (default is already set)

# Python environment
cp .env.example python-service/.env
# Edit python-service/.env and set your OPENAI_API_KEY
```

### 3. Set Up Python Service

```bash
cd python-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

### 4. Run Both Services

**Terminal 1 — Python FastAPI:**
```bash
cd python-service
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Next.js:**
```bash
cd ..  # back to ai-advisor root
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Reference

### `POST /api/recommend` (Next.js)

**Request:**
```json
{
  "answers": [
    { "question_id": 1, "question": "...", "selected": "analytical" },
    ...
  ]
}
```

**Response:**
```json
{
  "careers": [
    {
      "title": "Machine Learning Engineer",
      "field": "Technology",
      "reason": "Your analytical mindset and love for data...",
      "degree": "B.S./M.S. in Computer Science or Data Science",
      "universities": [
        { "name": "MIT", "field": "Technology", "ranking": 1, "location": "Cambridge, MA", "country": "USA", "website": "https://mit.edu" },
        ...
      ]
    }
  ]
}
```

### `POST /recommend` (Python FastAPI — internal)

Same request shape as above, returns:
```json
{ "careers": [{ "title": "", "field": "", "reason": "", "degree": "" }] }
```

---

## University Matching Logic

Universities are matched using **exact field matching**:

```typescript
universities.filter(u => u.field.toLowerCase() === career.field.toLowerCase())
           .sort((a, b) => a.ranking - b.ranking)
           .slice(0, 5)
```

Supported fields (must match OpenAI output exactly):
- Technology, Business, Healthcare, Engineering
- Data Science, Arts & Design, Law, Finance
- Social Sciences, Media & Communications

---

## Future MCP Integration

This application is intentionally MCP-free for MVP simplicity.
When scaling, MCP servers could replace the static JSON with live data:

```python
# python-service/main.py — Future MCP integration
from mcp.client import MCPClient

# Real-time university rankings from QS World Rankings
university_client = MCPClient("https://mcp.qsrankings.com")
live_universities = await university_client.call("get_rankings", {"field": career.field})

# BLS Occupational Outlook for job market data  
bls_client = MCPClient("https://mcp.bls.gov/api")
job_outlook = await bls_client.call("get_outlook", {"occupation": career.title})

# Scholarship database enrichment
scholarship_client = MCPClient("https://mcp.scholarships.com")
funding = await scholarship_client.call("find_scholarships", {"field": career.field})
```

Benefits of MCP approach (future):
- Real-time rankings updated annually
- Live admission statistics
- Current tuition and financial aid data
- Job market demand signals

---

## Design System

| Token | Value |
|-------|-------|
| `--ink` | `#0d0d0d` — primary text |
| `--paper` | `#faf8f4` — background |
| `--accent` | `#c8a97e` — gold accent |
| `--accent-deep` | `#a07850` — deep gold |
| `--muted` | `#6b6b6b` — secondary text |
| `--border` | `#e8e3da` — borders/dividers |

Fonts: **DM Serif Display** (headings) + **DM Sans** (body)

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Python service down | Returns 503 with helpful message |
| OpenAI API error | Returns 502 with error detail |
| Invalid AI response | Returns 500, won't crash silently |
| No session data on results page | Shows friendly error + CTA |
| Network timeout (30s) | Clear timeout error message |

---

## Performance Notes

- No database — everything in memory/session
- Universities loaded from JSON per request (fast, ~50 records)
- `sessionStorage` used to pass results between pages (no refetch on navigation)
- GPT-4o-mini chosen for speed + cost efficiency
- Python service is stateless and horizontally scalable

import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from openai import OpenAI
import json


app = FastAPI(title="AI Career Advisor Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)


class Answer(BaseModel):
    question_id: int
    question: str
    selected: str


class AssessmentRequest(BaseModel):
    answers: List[Answer]


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: str = ""


def build_prompt(answers: List[Answer]) -> str:
    qa_text = "\n".join(
        [f"Q{a.question_id}: {a.question}\nAnswer: {a.selected}" for a in answers]
    )
    return f"""You are an expert career counselor specializing in the PAKISTANI education system and job market. 
Based on the following assessment answers, recommend EXACTLY 3 distinct careers available in PAKISTAN.

Assessment Answers:
{qa_text}

IMPORTANT: 
- Focus ONLY on careers and degrees relevant to the PAKISTANI context.
- Recommend Pakistani universities or degree types common in Pakistan.
- Ensure the 'reason' references the Pakistani job market outlook.

Return ONLY a valid JSON object — no markdown, no code fences, raw JSON only:
{{
  "careers": [
    {{
      "title": "Career Title",
      "field": "One of: Technology, Business, Healthcare, Engineering, Data Science, Arts & Design, Law, Finance, Social Sciences, Media & Communications",
      "reason": "2-3 sentence personalized explanation referencing their specific answers and the Pakistani market",
      "degree": "Recommended degree(s) to pursue this career in Pakistan"
    }}
  ]
}}

Return EXACTLY 3 careers with different fields. Raw JSON only."""


@app.get("/health")
async def health():
    return {"status": "ok", "service": "AI Career Advisor (Groq/Llama)"}


@app.post("/recommend")
async def recommend_careers(request: AssessmentRequest):
    if not request.answers:
        raise HTTPException(status_code=400, detail="No answers provided")

    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GROK_API_KEY not set. Add it to python-service/.env"
        )

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a career counselor. Always respond with raw JSON only. No markdown, no explanation, no code fences."
                },
                {
                    "role": "user",
                    "content": build_prompt(request.answers)
                }
            ],
            temperature=0.7,
            max_tokens=1200,
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown fences just in case
        if raw.startswith("```"):
            lines = raw.split("\n")
            lines = [l for l in lines if not l.strip().startswith("```")]
            raw = "\n".join(lines).strip()

        data = json.loads(raw)

        if "careers" not in data or len(data["careers"]) != 3:
            raise HTTPException(status_code=500, detail="AI returned wrong structure")

        return {"careers": data["careers"]}

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
async def chat(request: ChatRequest):
    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY not set."
        )

    system_prompt = f"""You are "padhleTota", a sophisticated and encouraging career advisor for students in PAKISTAN. 
Your goal is to help users explore career opportunities, universities, and educational paths EXCLUSIVELY within Pakistan.

CONTEXT:
{request.context}

PERSONALITY:
- Professional yet warm, approachable, and very "Desi" in helpfulness (but maintain professional English).
- Expert on Pakistani Universities (NUST, FAST, LUMS, IBA, etc.) and the local job market.
- Insightful: provide deep details about Pakistani industries, entry tests (NET, ECAT, MDCAT), and salary ranges in PKR.
- Strictly keep the conversation about Pakistani careers, education, and professional development. 
- If the user has not provided much info, ask them engaging questions to understand their interests better.

STRICT RULE:
- Only discuss opportunities within Pakistan. If asked about going abroad, politely refocus the user on the great potential within Pakistan.
- If the context indicates this is a fresh start (no assessment yet), begin by introducing yourself and asking about their favorite subjects or interests in Pakistan."""

    try:
        messages = [{"role": "system", "content": system_prompt}]
        for msg in request.messages:
            messages.append({"role": msg.role, "content": msg.content})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=800,
        )

        return {"content": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

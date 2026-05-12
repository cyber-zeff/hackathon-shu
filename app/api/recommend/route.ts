/**
 * Next.js API Route: /api/recommend
 * 
 * This route acts as a BFF (Backend for Frontend):
 * 1. Receives assessment answers from the frontend
 * 2. Calls the Python FastAPI service for AI-generated careers
 * 3. Loads local university data and matches by career field
 * 4. Returns merged results to the frontend
 *
 * Future MCP Enhancement:
 * Instead of static JSON, an MCP server could provide:
 *   - Live university rankings from QS/THE APIs
 *   - Real-time tuition and admission data
 *   - Current job market stats per career field
 * Example: const universities = await mcpClient.call("get_universities", { field })
 */

import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:8000";

interface University {
  name: string;
  field: string;
  ranking: number;
  location: string;
  country: string;
  website: string;
}

interface Career {
  title: string;
  field: string;
  reason: string;
  degree: string;
}

function loadUniversities(): University[] {
  const filePath = join(process.cwd(), "data", "universities.json");
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function matchUniversities(field: string, universities: University[]): University[] {
  return universities
    .filter((u) => u.field.toLowerCase() === field.toLowerCase())
    .sort((a, b) => a.ranking - b.ranking)
    .slice(0, 5);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: "Invalid request: answers array required" },
        { status: 400 }
      );
    }

    // Call Python FastAPI service
    let careersData: { careers: Career[] };
    try {
      const pyRes = await fetch(`${PYTHON_SERVICE_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: body.answers }),
        signal: AbortSignal.timeout(30000),
      });

      if (!pyRes.ok) {
        const err = await pyRes.json().catch(() => ({ detail: "Unknown error" }));
        return NextResponse.json(
          { error: err.detail || "Career recommendation service failed" },
          { status: pyRes.status }
        );
      }

      careersData = await pyRes.json();
    } catch (fetchErr: unknown) {
      const msg = fetchErr instanceof Error ? fetchErr.message : "Unknown error";
      if (msg.includes("timeout") || msg.includes("ECONNREFUSED")) {
        return NextResponse.json(
          { error: "Career service is unavailable. Make sure the Python server is running." },
          { status: 503 }
        );
      }
      throw fetchErr;
    }

    // Load universities and match to careers
    const allUniversities = loadUniversities();

    const results = careersData.careers.map((career) => ({
      ...career,
      universities: matchUniversities(career.field, allUniversities),
    }));

    return NextResponse.json({ careers: results });
  } catch (error: unknown) {
    console.error("[/api/recommend] Error:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextRequest } from "next/server"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  const { words } = await req.json()
  const blob = new Blob([JSON.stringify({ words })], { type: 'application/json' })

  return await fetch(
    "https://us-central1-eng-cogency-412015.cloudfunctions.net/cross-distance",
    {
      method: "POST",
      body: blob,
    }
  )
}
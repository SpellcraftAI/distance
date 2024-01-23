import { APIResult } from "@/components/DistancesGrid";

export async function getDistances(words: string[]): Promise<APIResult> {
  "use server";

  const blob = new Blob([JSON.stringify({ words })], { type: 'application/json' })
  const response = await fetch(
    "https://us-central1-eng-cogency-412015.cloudfunctions.net/cross-distance",
    {
      method: "POST",
      body: blob,
    }
  )

  return await response.json();
}
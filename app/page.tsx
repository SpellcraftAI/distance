import { redirect } from 'next/navigation'
import { NextPageRequest } from "@/types";
import { DistancesGrid } from "@/components/DistancesGrid";
import { getDistances } from "@/lib/getDistances";

interface DistancePageProps extends NextPageRequest {
  searchParams: { words?: string }
}

export default async function DistancePage({ searchParams }: DistancePageProps) {
  let { words: wordString } = searchParams
  const words = wordString ? wordString.split(",") : []
  const enoughWords = words.length >= 2;

  const { distances } = await getDistances(words);
  const wordsFound = distances.flatMap((x) => [x.word1, x.word2])

  /**
   * If there's not enough words for a valid request, don't try to filter out
   * invalid words.
   */
  const uniqueWordsFound = [...new Set(!enoughWords ? words : wordsFound)]

  const updateWords = async (data: FormData, action: 'add' | 'delete') => {
    "use server"
    const word = data.get("word")?.toString()
    if (!word) {
      throw new Error("No word provided.")
    }

    const set = new Set(uniqueWordsFound)
    if (action === 'delete') {
      set.delete(word)
    } else {
      set.add(word)
    }

    const urlSearchParams = new URLSearchParams({ 
      words: [...set].join(",") 
    })

    return redirect(`?${urlSearchParams}`)
  }

  const addWord = async (data: FormData) => {
    "use server"
    return await updateWords(data, "add")
  }

  const removeWord = async (data: FormData) => {
    "use server"
    return await updateWords(data, "delete")
  }

  return (
    <div className="flex flex-col items-center gap-2 text-sm">
      <h1 className="text-lg">Cosine Distance Calculator</h1>
      <p>English nouns, lowercase (no acronyms or proper nouns), 6 chars or less.</p>
      <p>Pick nouns that are as unrelated to each other as possible.</p>

      {!enoughWords && 
        <>
          <span className="pt-4 text-red-400">Add at least 2 words.</span>
          <ul>
            {words.map((x, i) => (<li key={i}>{x}</li>))}
          </ul>
        </>
      }

      <div className="flex flex-row gap-2">
        <form action={addWord} className="flex flex-col gap-2">
          <input name="word" type="text" autoFocus={true} />
          <button>Add</button>
        </form>

        <form action={removeWord} className="flex flex-col gap-2">
          <input name="word" type="text" />
          <button>Remove</button>
        </form>
      </div>

      {enoughWords && <DistancesGrid distances={distances} />}

      <details>
        <summary>Debug</summary>
        <pre>
          {JSON.stringify(distances, null, 2)}
        </pre>
      </details>
    </div>
  );
}

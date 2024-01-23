"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Distance, DistancesGrid } from "./DistancesGrid";

export function DistanceForm() {
  const [words, setWords] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState<string>('');
  const [distances, setDistances] = useState<Distance[]>([]);
  const [meanDistance, setMeanDistance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDistances = useCallback(
    async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ words }),
        });
  
        if (!response.ok) {
          throw new Error('Server error occurred');
        }
  
        const data = await response.json();

        setDistances(data.distances);
        setMeanDistance(data.mean);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [words]
  );

  useEffect(
    () => {
      if (words.length > 1) {
        fetchDistances();
      }
    }, 
    [fetchDistances, words]
  );

  const handleAddWord = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputWord && !words.includes(inputWord)) {
      setWords(prevWords => [...prevWords, inputWord]);
      setInputWord('');
    }
  };

  const sum = distances.map(({ distance }) => 100 * distance).reduce((a, b) => a + b)

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAddWord}>
        <input
          type="text"
          name="word"
          placeholder="Enter a word"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
        />
        <button type="submit">Add Word</button>
      </form>

      <div>
        <h2>Words</h2>
        <ul>
          {words.map((word, index) => <li key={index}>{word}</li>)}
        </ul>
      </div>

      {loading ? (
        <p>Calculating distances...</p>
      ) : (
        <div>
          <h2>Distances</h2>
          <DistancesGrid distances={distances} />
          <p>Score: {sum}</p>
          <p>Mean Distance: {meanDistance}</p>
        </div>
      )}
    </div>
  );
}

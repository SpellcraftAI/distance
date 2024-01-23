"use server";

import React from 'react';

export interface Distance {
  word1: string
  word2: string
  distance: number
}

export interface APIResult {
  distances: Distance[];
}

export async function DistancesGrid({ distances }: APIResult) {
  const words = Array.from(new Set(distances.flatMap(d => [d.word1, d.word2])));
  const distanceMap = new Map(distances.map(d => [`${d.word1}-${d.word2}`, d.distance]));

  const getDistance = (word1: string, word2: string) => {
    return distanceMap.get(`${word1}-${word2}`) || distanceMap.get(`${word2}-${word1}`);
  };

  const minDistance = Math.min(...distances.map(d => d.distance)); // The minimum distance
  const maxDistance = Math.max(...distances.map(d => d.distance)); // The maximum distance

  const getCellColor = (distance: number) => {
    const normalizedDistance = (distance - minDistance) / (maxDistance - minDistance);
    return `rgba(0, 128, 0, ${normalizedDistance})`; // Green with scaled opacity
  };

  const maxLengthWord = words.reduce((longest, word) => longest.length > word.length ? longest : word, '');
  const columnWidth = `${maxLengthWord.length + 2}ch`; // ch units are width of the zero character

  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: `max-content repeat(${words.length}, ${columnWidth})`,
      gridAutoRows: columnWidth,
      gap: '0',
      padding: '12px',
      fontSize: '0.69rem',
      userSelect: "none",
    }}>

      {/* Rows. */}
      {words.map((word1, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {/* Row header. */}
          <div className="text-center flex flex-col justify-center items-center" style={{ fontWeight: 'bold', padding: '0 4px' }}>
            {word1}
          </div>
          
          {words.map((word2, colIndex) => {
            const distance = getDistance(word1, word2);
            const isSelf = distance === undefined;
            const score = isSelf ? `0%` : (100 * distance).toFixed(1);

            return (
              <div 
                key={`cell-${rowIndex}-${colIndex}`} 
                style={{ 
                  backgroundColor: isSelf ? 'rgba(128,128,128,0.48)' : getCellColor(distance ?? 0),
                  padding: '0', // apply padding to cells
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid black', // Optional border for clear cell separation
                }}
              >
                {isSelf ? '' : score}
              </div>
            );
          })}
        </React.Fragment>
      ))}

      {/* Empty bottom-left cell */}
      <div />
      
      {/* Column headers. */}
      {words.map((word, index) => (
        <div key={`header-column-${index}`} style={{ fontWeight: 'bold', padding: '4px 0', textAlign: 'center' }}>{word}</div>
      ))}
    </div>
  );
}

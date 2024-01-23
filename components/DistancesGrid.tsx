"use client";
import React from 'react';

export interface Distance {
  word1: string
  word2: string
  distance: number
}

export interface DistancesResult {
  distances: Distance[];
}

export function DistancesGrid({ distances }: DistancesResult) {
  // Extract unique words from the distances array
  const words = Array.from(new Set(distances.flatMap(d => [d.word1, d.word2])));

  // Create a map for easy access to distance values
  const distanceMap = new Map(distances.map(d => [`${d.word1}-${d.word2}`, d.distance]));

  // Function to get the distance for a pair of words
  const getDistance = (word1: string, word2: string) => {
    return distanceMap.get(`${word1}-${word2}`) || distanceMap.get(`${word2}-${word1}`);
  };

  const minDistance = Math.min(...distances.map(d => d.distance)); // The minimum distance
  const maxDistance = Math.max(...distances.map(d => d.distance)); // The maximum distance

  const getCellColor = (distance: number) => {
    const minOpacity = 0; // 12%
    const maxOpacity = 1;    // 100%
    
    // Normalize the distance to a value between 0 and 1
    const normalizedDistance = (distance - minDistance) / (maxDistance - minDistance);
    
    // Then scale that value to the opacity range
    const opacity = (normalizedDistance * (maxOpacity - minOpacity)) + minOpacity;
    const opacityPercentage = (opacity * 100).toFixed(0); // Convert to percentage and round
    
    return `rgba(0, 128, 0, ${opacity})`; // Green with scaled opacity
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
      fontSize: '0.69rem'
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
            const percent = isSelf ? `0%` : (100 * distance).toFixed(1);

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
                {isSelf ? '' : percent}
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

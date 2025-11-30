// src/data/songs.js

export const childrenSongs = [
    {
      title: 'Twinkle Twinkle Little Star',
      notes: [
        { note: 60, duration: 500, start: 0 },
        { note: 60, duration: 500, start: 500 },
        { note: 67, duration: 500, start: 1000 },
        { note: 67, duration: 500, start: 1500 },
        { note: 69, duration: 500, start: 2000 },
        { note: 69, duration: 500, start: 2500 },
        { note: 67, duration: 1000, start: 3000 },
        { note: 65, duration: 500, start: 4000 },
        { note: 65, duration: 500, start: 4500 },
        { note: 64, duration: 500, start: 5000 },
        { note: 64, duration: 500, start: 5500 },
        { note: 62, duration: 500, start: 6000 },
        { note: 62, duration: 500, start: 6500 },
        { note: 60, duration: 1000, start: 7000 }
      ]
    },
    {
      title: 'Mary Had a Little Lamb',
      notes: [
        { note: 64, duration: 500, start: 0 },
        { note: 62, duration: 500, start: 500 },
        { note: 60, duration: 500, start: 1000 },
        { note: 62, duration: 500, start: 1500 },
        { note: 64, duration: 500, start: 2000 },
        { note: 64, duration: 500, start: 2500 },
        { note: 64, duration: 1000, start: 3000 },
        { note: 62, duration: 500, start: 4000 },
        { note: 62, duration: 500, start: 4500 },
        { note: 62, duration: 1000, start: 5000 },
        { note: 64, duration: 500, start: 6000 },
        { note: 67, duration: 500, start: 6500 },
        { note: 67, duration: 1000, start: 7000 }
      ]
    },
    // Añadir 8 canciones más aquí
  ];
  
  export const classicalSongs = [
    {
      title: 'Beethoven - Für Elise',
      notes: [
        { note: 76, duration: 500, start: 0 },
        { note: 75, duration: 500, start: 500 },
        { note: 76, duration: 500, start: 1000 },
        { note: 75, duration: 500, start: 1500 },
        { note: 76, duration: 500, start: 2000 },
        { note: 71, duration: 500, start: 2500 },
        { note: 74, duration: 500, start: 3000 },
        { note: 72, duration: 500, start: 3500 },
        { note: 69, duration: 1000, start: 4000 },
        { note: 60, duration: 500, start: 5000 },
        { note: 62, duration: 500, start: 5500 },
        { note: 64, duration: 500, start: 6000 },
        { note: 65, duration: 500, start: 6500 },
        { note: 67, duration: 1000, start: 7000 }
      ]
    },
    {
      title: 'Mozart - Symphony No. 40',
      notes: [
        { note: 67, duration: 500, start: 0 },
        { note: 71, duration: 500, start: 500 },
        { note: 74, duration: 500, start: 1000 },
        { note: 74, duration: 500, start: 1500 },
        { note: 72, duration: 500, start: 2000 },
        { note: 69, duration: 500, start: 2500 },
        { note: 67, duration: 500, start: 3000 },
        { note: 67, duration: 1000, start: 3500 },
        { note: 65, duration: 500, start: 4500 },
        { note: 62, duration: 500, start: 5000 },
        { note: 60, duration: 1000, start: 5500 },
        { note: 60, duration: 1000, start: 6500 }
      ]
    },
    // Añadir 8 canciones más aquí
    {
        title: 'Debussy - Clair de Lune',
        notes: [
          { note: 60, duration: 500, start: 0 },   // C4
          { note: 62, duration: 500, start: 500 }, // D4
          { note: 64, duration: 500, start: 1000 }, // E4
          { note: 67, duration: 500, start: 1500 }, // G4
          { note: 69, duration: 500, start: 2000 }, // A4
          { note: 72, duration: 1000, start: 2500 }, // C5
          { note: 69, duration: 500, start: 3500 }, // A4
          { note: 67, duration: 500, start: 4000 }, // G4
          { note: 64, duration: 500, start: 4500 }, // E4
          { note: 62, duration: 500, start: 5000 }, // D4
          { note: 60, duration: 1000, start: 5500 }, // C4
          { note: 62, duration: 500, start: 7000 }, // D4
          { note: 64, duration: 500, start: 7500 }, // E4
          { note: 67, duration: 500, start: 8000 }, // G4
          { note: 69, duration: 500, start: 8500 }, // A4
          { note: 72, duration: 1000, start: 9000 }, // C5
          { note: 74, duration: 500, start: 10500 }, // D5
          { note: 76, duration: 500, start: 11000 }, // E5
          { note: 79, duration: 500, start: 11500 }, // G5
          { note: 81, duration: 500, start: 12000 }, // A5
          { note: 84, duration: 1000, start: 12500 }, // C6
          { note: 81, duration: 500, start: 13500 }, // A5
          { note: 79, duration: 500, start: 14000 }, // G5
          { note: 76, duration: 500, start: 14500 }, // E5
          { note: 74, duration: 500, start: 15000 }, // D5
          { note: 72, duration: 1000, start: 15500 }, // C5
          { note: 69, duration: 500, start: 17000 }, // A4
          { note: 67, duration: 500, start: 17500 }, // G4
          { note: 64, duration: 500, start: 18000 }, // E4
          { note: 62, duration: 500, start: 18500 } // D4
        ],
        
      },
      {
        title: 'Ping Pong Sobre Los Árboles',
        notes: [
          { note: 64, duration: 500, start: 0 },   // E4
          { note: 66, duration: 500, start: 500 }, // F#4
          { note: 68, duration: 500, start: 1000 },// G#4
          { note: 69, duration: 500, start: 1500 },// A4
          { note: 71, duration: 500, start: 2000 },// B4
          { note: 73, duration: 500, start: 2500 },// C#5
          { note: 71, duration: 500, start: 3000 },// B4
          { note: 69, duration: 500, start: 3500 },// A4
          { note: 68, duration: 500, start: 4000 },// G#4
          { note: 66, duration: 500, start: 4500 },// F#4
          { note: 64, duration: 500, start: 5000 },// E4
          { note: 62, duration: 500, start: 5500 },// D4
          { note: 64, duration: 500, start: 6000 },// E4
          { note: 66, duration: 500, start: 6500 },// F#4
          { note: 68, duration: 500, start: 7000 },// G#4
          { note: 69, duration: 500, start: 7500 },// A4
          { note: 71, duration: 500, start: 8000 },// B4
          { note: 73, duration: 500, start: 8500 },// C#5
          { note: 74, duration: 500, start: 9000 },// D5
          { note: 73, duration: 500, start: 9500 },// C#5
          { note: 71, duration: 500, start: 10000 },// B4
          { note: 69, duration: 500, start: 10500 },// A4
          { note: 68, duration: 500, start: 11000 },// G#4
          { note: 66, duration: 500, start: 11500 },// F#4
          { note: 64, duration: 500, start: 12000 },// E4
          { note: 62, duration: 500, start: 12500 },// D4
          { note: 60, duration: 500, start: 13000 },// C4
          { note: 62, duration: 500, start: 13500 },// D4
          { note: 64, duration: 500, start: 14000 },// E4
          { note: 66, duration: 500, start: 14500 } // F#4
        ]
      }
      
  ];
  
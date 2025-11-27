import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const characters = [
  { id: 'robot', emoji: '🤖', name: 'Robot' },
  { id: 'astronaut', emoji: '👨‍🚀', name: 'Astronaut' },
  { id: 'wizard', emoji: '🧙', name: 'Wizard' },
  { id: 'superhero', emoji: '🦸', name: 'Superhero' },
  { id: 'scientist', emoji: '👨‍🔬', name: 'Scientist' },
  { id: 'artist', emoji: '👨‍🎨', name: 'Artist' }
];

const colors = [
  { id: 'blue', class: 'bg-blue-500', name: 'Blue' },
  { id: 'pink', class: 'bg-pink-500', name: 'Pink' },
  { id: 'green', class: 'bg-green-500', name: 'Green' },
  { id: 'purple', class: 'bg-purple-500', name: 'Purple' },
  { id: 'orange', class: 'bg-orange-500', name: 'Orange' },
  { id: 'yellow', class: 'bg-yellow-500', name: 'Yellow' }
];

export default function AvatarSelector({ currentCharacter, currentColor, onSave }) {
  const [selectedCharacter, setSelectedCharacter] = useState(currentCharacter || 'robot');
  const [selectedColor, setSelectedColor] = useState(currentColor || 'blue');

  // Update state when props change (e.g., when data loads from storage)
  React.useEffect(() => {
    if (currentCharacter) setSelectedCharacter(currentCharacter);
    if (currentColor) setSelectedColor(currentColor);
  }, [currentCharacter, currentColor]);

  return (
    <Card className="p-6 max-w-2xl mx-auto bg-white">
      <h2 className="text-2xl font-bold text-center mb-6">Customize Your Avatar 🎨</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Choose Character:</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {characters.map((char) => (
            <motion.button
              key={char.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCharacter(char.id)}
              className={`p-4 rounded-xl border-4 transition-all ${
                selectedCharacter === char.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
              }`}
            >
              <div className="text-4xl mb-1">{char.emoji}</div>
              <div className="text-xs font-semibold">{char.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Choose Color:</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {colors.map((color) => (
            <motion.button
              key={color.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedColor(color.id)}
              className={`h-16 rounded-xl border-4 transition-all ${color.class} ${
                selectedColor === color.id ? 'border-purple-500 ring-4 ring-purple-200' : 'border-white'
              }`}
            >
              <span className="text-white font-bold text-xs">{color.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <Button
        onClick={() => onSave(selectedCharacter, selectedColor)}
        className="text-white w-full h-14 text-xl font-bold rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        Save Avatar ✨
      </Button>
    </Card>
  );
}
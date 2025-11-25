import React from 'react';
import { motion } from 'framer-motion';

const avatarEmojis = {
  robot: '🤖',
  astronaut: '👨‍🚀',
  wizard: '🧙',
  superhero: '🦸',
  scientist: '👨‍🔬',
  artist: '👨‍🎨'
};

const colorClasses = {
  blue: 'bg-blue-500',
  pink: 'bg-pink-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500'
};

export default function AvatarDisplay({ character = 'robot', color = 'blue', size = 'md', stars = 0 }) {
  const sizes = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl'
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`${sizes[size]} ${colorClasses[color]} rounded-full flex items-center justify-center shadow-lg border-4 border-white`}
      >
        <span>{avatarEmojis[character]}</span>
      </motion.div>
      {stars > 0 && (
        <div className="bg-yellow-100 px-3 py-1 rounded-full border-2 border-yellow-300">
          <span className="text-sm font-bold text-yellow-700">⭐ {stars}</span>
        </div>
      )}
    </div>
  );
}
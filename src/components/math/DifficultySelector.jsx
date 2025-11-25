import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';

const difficulties = [
  { level: 'easy', label: 'Easy', stars: 1, color: 'bg-green-500 hover:bg-green-600' },
  { level: 'medium', label: 'Medium', stars: 2, color: 'bg-yellow-500 hover:bg-yellow-600' },
  { level: 'hard', label: 'Hard', stars: 3, color: 'bg-red-500 hover:bg-red-600' }
];

export default function DifficultySelector({ onSelect }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Choose Difficulty 🎯
      </h2>
      <div className="grid gap-4">
        {difficulties.map((diff, index) => (
          <motion.div
            key={diff.level}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={() => onSelect(diff.level)}
              className={`w-full h-20 ${diff.color} text-white text-xl font-bold rounded-2xl shadow-xl`}
            >
              <div className="flex items-center gap-3">
                <span>{diff.label}</span>
                <div className="flex gap-1">
                  {Array.from({ length: diff.stars }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Trophy, Star, Home, RotateCcw } from 'lucide-react';

export default function ResultsScreen({ score, correct, total, onPlayAgain, onHome }) {
  const percentage = Math.round((correct / total) * 100);
  const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;

  const getMessage = () => {
    if (percentage >= 90) return { text: "Amazing! You're a Math Superstar!", emoji: "🌟" };
    if (percentage >= 70) return { text: "Great Job! Keep it up!", emoji: "🎉" };
    if (percentage >= 50) return { text: "Good Try! Practice makes perfect!", emoji: "💪" };
    return { text: "Keep Practicing! You'll get better!", emoji: "🚀" };
  };

  const message = getMessage();

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-8 bg-white rounded-3xl shadow-2xl border-4 border-purple-200 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-6"
        >
          <Trophy className="w-24 h-24 mx-auto text-yellow-500 fill-current" />
        </motion.div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {message.text} {message.emoji}
        </h1>

        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: i < stars ? 1 : 0.5, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
            >
              <Star 
                className={`w-12 h-12 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Questions</p>
              <p className="text-3xl font-bold text-purple-600">{total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Correct</p>
              <p className="text-3xl font-bold text-green-600">{correct}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Score</p>
              <p className="text-3xl font-bold text-orange-600">{score}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-5xl font-bold text-purple-600">{percentage}%</div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={onPlayAgain}
            className="flex-1 h-14 text-xl font-bold rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
          <Button
            onClick={onHome}
            variant="outline"
            className="flex-1 h-14 text-xl font-bold rounded-2xl border-4 border-purple-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
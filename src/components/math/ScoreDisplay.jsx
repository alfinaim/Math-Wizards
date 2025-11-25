import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target } from 'lucide-react';

export default function ScoreDisplay({ score, correct, total, streak }) {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl px-6 py-3 shadow-lg border-4 border-yellow-300"
      >
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <div>
            <p className="text-xs text-gray-500 font-semibold">Score</p>
            <p className="text-2xl font-bold text-gray-800">{score}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl px-6 py-3 shadow-lg border-4 border-green-300"
      >
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-green-500" />
          <div>
            <p className="text-xs text-gray-500 font-semibold">Correct</p>
            <p className="text-2xl font-bold text-gray-800">{correct}/{total}</p>
          </div>
        </div>
      </motion.div>

      {streak > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl px-6 py-3 shadow-lg border-4 border-orange-300"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-orange-500 fill-current" />
            <div>
              <p className="text-xs text-gray-500 font-semibold">Streak</p>
              <p className="text-2xl font-bold text-gray-800">{streak} 🔥</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
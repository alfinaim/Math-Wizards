import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, X, Divide } from 'lucide-react';
import { Card } from '../ui/card';

const operationConfig = {
  addition: {
    icon: Plus,
    gradient: 'from-blue-400 to-cyan-500',
    emoji: '➕',
    color: 'text-blue-600'
  },
  subtraction: {
    icon: Minus,
    gradient: 'from-pink-400 to-rose-500',
    emoji: '➖',
    color: 'text-pink-600'
  },
  multiplication: {
    icon: X,
    gradient: 'from-purple-400 to-indigo-500',
    emoji: '✖️',
    color: 'text-purple-600'
  },
  division: {
    icon: Divide,
    gradient: 'from-orange-400 to-amber-500',
    emoji: '➗',
    color: 'text-orange-600'
  },
  fractions: {
    icon: Divide,
    gradient: 'from-teal-400 to-emerald-500',
    emoji: '🍕',
    color: 'text-teal-600'
  },
  decimals: {
    icon: Plus,
    gradient: 'from-violet-400 to-fuchsia-500',
    emoji: '🔢',
    color: 'text-violet-600'
  }
};

export default function OperationCard({ operation, title, onClick }) {
  const config = operationConfig[operation];
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card 
        className="cursor-pointer overflow-hidden relative h-48 border-4 border-white shadow-2xl"
        onClick={onClick}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-90`} />
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-white">
          <div className="text-6xl mb-3">
            {config.emoji}
          </div>
          <h3 className="text-2xl font-bold text-center drop-shadow-lg">
            {title}
          </h3>
          <div className="absolute top-4 right-4">
            <Icon className="w-8 h-8 opacity-30" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
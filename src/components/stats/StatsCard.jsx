import React from 'react';
import { Card } from '../ui/card';
import { motion } from 'framer-motion';

export default function StatsCard({ icon: Icon, title, value, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className={`p-6 border-4 ${color} bg-white`}>
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-xl ${color.replace('border', 'bg')} bg-opacity-20`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
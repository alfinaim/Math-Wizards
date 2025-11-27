import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import OperationCard from '../components/math/OperationCard';
import AvatarDisplay from '../components/avatar/AvatarDisplay';
import { BookOpen, Sparkles, BarChart3, User, Clock } from 'lucide-react';
import { storage } from '../components/utils/storage';

export default function Home() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    setAvatar(storage.getAvatar());
    setProgressData(storage.getProgress());
  }, []);

  const totalStars = progressData.reduce((sum, p) => sum + (p.stars_earned || 0), 0);

  const operations = [
    { id: 'addition', title: 'Addition' },
    { id: 'subtraction', title: 'Subtraction' },
    { id: 'multiplication', title: 'Multiplication' },
    { id: 'division', title: 'Division' },
    { id: 'fractions', title: 'Fractions' },
    { id: 'decimals', title: 'Decimals' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-end gap-3 mb-6">
          <Button
            onClick={() => navigate('/AvatarCustomize')}
            variant="outline"
            className="rounded-xl border-2 border-purple-300 bg-white hover:bg-gray-100"
          >
            <User className="w-4 h-4 mr-2" />
            Customize Avatar
          </Button>
          <Button
            onClick={() => navigate('/Stats')}
            variant="outline"
            className="rounded-xl border-2 border-purple-300 bg-white hover:bg-gray-100"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Stats
          </Button>
        </div>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          {avatar && (
            <div className="mb-6">
              <AvatarDisplay 
                character={avatar.selected_character} 
                color={avatar.selected_color}
                size="lg"
                stars={totalStars}
              />
            </div>
          )}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-purple-500" />
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Math Adventure
            </h1>
            <BookOpen className="w-12 h-12 text-pink-500" />
          </div>
          <p className="text-2xl text-gray-700 font-semibold">
            Choose your math challenge and start learning! 🚀
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {operations.map((op, index) => (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OperationCard
                operation={op.id}
                title={op.title}
                onClick={() => navigate(`/Game?operation=${op.id}`)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Button
              onClick={() => navigate('/Adventure')}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-xl px-8 py-6 rounded-2xl shadow-xl"
            >
              🗺️ Adventure Mode
            </Button>
            <Button
              onClick={() => navigate('/EndlessMode')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xl px-8 py-6 rounded-2xl shadow-xl"
            >
              ♾️ Endless Mode
            </Button>
            <Button
              onClick={() => navigate('/Game?mode=timed')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-xl px-8 py-6 rounded-2xl shadow-xl"
            >
              <Clock className="w-6 h-6 mr-2" />
              Timed Challenge
            </Button>
          </div>
          <div className="inline-block bg-white rounded-full px-8 py-4 shadow-lg">
            <p className="text-lg text-gray-600 font-semibold">
              🎮 Choose a game mode or pick an operation above!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
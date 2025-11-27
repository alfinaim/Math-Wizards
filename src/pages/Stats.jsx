import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Trophy, Target, Zap, Star, Award } from 'lucide-react';
import StatsCard from '../components/stats/StatsCard';
import AvatarDisplay from '../components/avatar/AvatarDisplay';
import { storage } from '../components/utils/storage';

export default function Stats() {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    setProgressData(storage.getProgress());
    setAvatar(storage.getAvatar());
    setRewards(storage.getRewards());
  }, []);

  const totalScore = progressData.reduce((sum, p) => sum + (p.score || 0), 0);
  const totalQuestions = progressData.reduce((sum, p) => sum + (p.total_questions || 0), 0);
  const totalCorrect = progressData.reduce((sum, p) => sum + (p.correct_answers || 0), 0);
  const totalStars = progressData.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
  const bestStreak = Math.max(...progressData.map(p => p.best_streak || 0), 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const operationStats = {
    addition: progressData.filter(p => p.operation === 'addition'),
    subtraction: progressData.filter(p => p.operation === 'subtraction'),
    multiplication: progressData.filter(p => p.operation === 'multiplication'),
    division: progressData.filter(p => p.operation === 'division'),
    fractions: progressData.filter(p => p.operation === 'fractions'),
    decimals: progressData.filter(p => p.operation === 'decimals')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <Button
          onClick={() => navigate('/Home')}
          variant="outline"
          className="mb-6 rounded-xl border-2 border-purple-300 bg-white hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Progress 🏆</h1>
          <div className="flex justify-center mb-6">
            <AvatarDisplay 
              character={avatar?.selected_character} 
              color={avatar?.selected_color}
              size="lg"
              stars={totalStars}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatsCard icon={Trophy} title="Total Score" value={totalScore} color="border-yellow-300" delay={0} />
          <StatsCard icon={Target} title="Accuracy" value={`${accuracy}%`} color="border-green-300" delay={0.1} />
          <StatsCard icon={Zap} title="Best Streak" value={bestStreak} color="border-orange-300" delay={0.2} />
          <StatsCard icon={Star} title="Total Stars" value={totalStars} color="border-purple-300" delay={0.3} />
          <StatsCard icon={Award} title="Questions Answered" value={totalQuestions} color="border-blue-300" delay={0.4} />
          <StatsCard icon={Trophy} title="Correct Answers" value={totalCorrect} color="border-pink-300" delay={0.5} />
        </div>

        <Card className="p-6 mb-8 bg-white">
          <h2 className="text-2xl font-bold mb-4">Performance by Operation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(operationStats).map(([op, data]) => {
              const opTotal = data.reduce((sum, p) => sum + (p.total_questions || 0), 0);
              const opCorrect = data.reduce((sum, p) => sum + (p.correct_answers || 0), 0);
              const opAccuracy = opTotal > 0 ? Math.round((opCorrect / opTotal) * 100) : 0;
              
              return (
                <div key={op} className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-3xl mb-2">
                    {op === 'addition' && '➕'}
                    {op === 'subtraction' && '➖'}
                    {op === 'multiplication' && '✖️'}
                    {op === 'division' && '➗'}
                    {op === 'fractions' && '🍕'}
                    {op === 'decimals' && '🔢'}
                  </div>
                  <p className="text-sm font-semibold text-gray-600 capitalize">{op}</p>
                  <p className="text-2xl font-bold text-purple-600">{opAccuracy}%</p>
                  <p className="text-xs text-gray-500">{opTotal} questions</p>
                </div>
              );
            })}
          </div>
        </Card>

        {rewards.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Rewards & Achievements 🏆</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {rewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 text-center"
                >
                  <div className="text-4xl mb-2">{reward.icon}</div>
                  <p className="font-bold text-sm">{reward.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{reward.description}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
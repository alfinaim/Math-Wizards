import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, Heart, Timer, Trophy, Zap } from 'lucide-react';
import { storage } from '../components/utils/storage';

const QUESTION_TIME = 10; // seconds per question
const MAX_LIVES = 3;

export default function EndlessMode() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [highScore, setHighScore] = useState(storage.getEndlessHighScore());

  const operations = ['+', '−', '×', '÷'];

  const generateQuestion = useCallback(() => {
    const maxNum = Math.min(10 + difficulty * 5, 50);
    const op = operations[Math.floor(Math.random() * operations.length)];
    let num1 = Math.floor(Math.random() * maxNum) + 1;
    let num2 = Math.floor(Math.random() * maxNum) + 1;
    let ans;

    switch (op) {
      case '+':
        ans = num1 + num2;
        break;
      case '−':
        if (num2 > num1) [num1, num2] = [num2, num1];
        ans = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        ans = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 10) + 1;
        ans = Math.floor(Math.random() * 10) + 1;
        num1 = ans * num2;
        break;
      default:
        ans = num1 + num2;
    }

    return { num1, num2, operator: op, answer: ans };
  }, [difficulty]);

  useEffect(() => {
    setQuestion(generateQuestion());
  }, []);

  useEffect(() => {
    if (gameOver || feedback !== null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return QUESTION_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, feedback, question]);

  const handleTimeout = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        endGame();
      }
      return newLives;
    });
    setStreak(0);
    nextQuestion();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer === '' || feedback !== null) return;

    const userAns = parseFloat(answer);
    const correct = !isNaN(userAns) && userAns === question.answer;
    setFeedback(correct);

    if (correct) {
      const points = 10 + streak * 5 + difficulty * 2;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      
      if ((score + points) % 100 < score % 100) {
        setDifficulty(prev => Math.min(prev + 1, 10));
      }
    } else {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setTimeout(() => endGame(), 500);
        }
        return newLives;
      });
      setStreak(0);
    }

    setTimeout(() => {
      if (lives > 1 || correct) {
        nextQuestion();
      }
    }, 800);
  };

  const nextQuestion = () => {
    setQuestion(generateQuestion());
    setAnswer('');
    setFeedback(null);
    setTimeLeft(QUESTION_TIME);
  };

  const endGame = () => {
    setGameOver(true);
    const newHigh = storage.saveEndlessHighScore(score);
    setHighScore(newHigh);
    
    storage.addProgress({
      operation: 'mixed',
      difficulty: `endless-${difficulty}`,
      score: score,
      correct_answers: Math.floor(score / 10),
      total_questions: Math.floor(score / 10) + (MAX_LIVES - lives),
      stars_earned: score >= 200 ? 3 : score >= 100 ? 2 : score >= 50 ? 1 : 0,
      best_streak: streak,
      mode: 'endless'
    });
  };

  if (gameOver) {
    const isNewHighScore = score >= highScore;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <Card className="p-8 text-center max-w-md bg-white">
            {isNewHighScore && (
              <motion.div
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
            )}
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isNewHighScore ? 'New High Score!' : 'Game Over!'}
            </h2>
            <div className="text-6xl font-bold text-purple-600 mb-4">{score}</div>
            <div className="flex justify-center gap-6 mb-6 text-gray-600">
              <div className="text-center">
                <Trophy className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                <p className="text-sm">Best: {highScore}</p>
              </div>
              <div className="text-center">
                <Zap className="w-6 h-6 mx-auto mb-1 text-orange-500" />
                <p className="text-sm">Level: {difficulty}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => window.location.reload()} className="flex-1 text-white bg-black hover:bg-gray-800">
                Play Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/Home')} className="flex-1 hover:bg-gray-100">
                Home
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button
          onClick={() => navigate('/Home')}
          variant="outline"
          className="mb-6 bg-white/10 text-white border-white/30 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quit
        </Button>

        {/* Stats Bar */}
        <div className="flex justify-between items-center mb-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <Heart key={i} className={`w-8 h-8 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
            ))}
          </div>
          <div className="text-center">
            <p className="text-white/70 text-sm">Score</p>
            <p className="text-3xl font-bold text-white">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-sm">Streak</p>
            <p className="text-2xl font-bold text-orange-400">{streak}🔥</p>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Timer className={`w-6 h-6 ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-white'}`} />
            <span className={`text-2xl font-bold ${timeLeft <= 3 ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
          <Progress 
            value={(timeLeft / QUESTION_TIME) * 100} 
            className={`h-3 ${timeLeft <= 3 ? 'bg-red-900' : 'bg-white/20'}`}
          />
        </div>

        {/* Question Card */}
        <motion.div
          key={question.num1 + question.operator + question.num2}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="p-8 bg-white/95 rounded-3xl">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-purple-100 px-3 py-1 rounded-full text-purple-600 font-bold text-sm">
                Level {difficulty}
              </span>
              <span className="bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 font-bold text-sm">
                🏆 Best: {highScore}
              </span>
            </div>

            <div className="text-center mb-8">
              <div className="text-5xl md:text-6xl font-bold text-gray-800 flex items-center justify-center gap-3">
                <span>{question.num1}</span>
                <span className="text-purple-500">{question.operator}</span>
                <span>{question.num2}</span>
                <span className="text-purple-500">=</span>
                <span className="text-purple-600">?</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                inputMode="decimal"
                value={answer}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^-?\d*\.?\d*$/.test(val)) setAnswer(val);
                }}
                placeholder="Quick! Answer..."
                className="text-3xl text-center h-16 rounded-2xl border-4 border-purple-200"
                autoFocus
                disabled={feedback !== null}
                ref={(input) => input && feedback === null && input.focus()}
              />
              <Button
                type="submit"
                disabled={answer === '' || feedback !== null}
                className="w-full h-14 text-xl font-bold rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
              >
                Submit! ⚡
              </Button>
            </form>

            <AnimatePresence>
              {feedback !== null && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`mt-4 p-3 rounded-xl text-center font-bold text-lg ${
                    feedback ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {feedback ? '✅ Correct!' : `❌ It was ${question.answer}`}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
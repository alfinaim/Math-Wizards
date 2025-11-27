import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Check, X, Sparkles } from 'lucide-react';

export default function QuestionCard({ question, onAnswer, questionNumber, totalQuestions }) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer === '') return;

    let userAnswer = answer;
    // Handle fraction input like "3/4"
    if (answer.includes('/')) {
      const [num, denom] = answer.split('/').map(Number);
      userAnswer = denom ? num / denom : NaN;
    } else {
      userAnswer = parseFloat(answer);
    }
    const correctAnswer = parseFloat(question.answer);
    const isCorrect = !isNaN(userAnswer) && Math.abs(userAnswer - correctAnswer) < 0.01;
    
    setFeedback(isCorrect);
    
    if (!isCorrect) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    setTimeout(() => {
      onAnswer(isCorrect);
      setAnswer('');
      setFeedback(null);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-8 bg-white rounded-3xl shadow-2xl border-4 border-purple-200">
        <div className="text-center mb-6">
          <div className="inline-block bg-purple-100 px-4 py-2 rounded-full">
            <span className="text-purple-600 font-bold">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
        </div>

        <motion.div 
          className="text-center mb-8"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-4">
            <span className="text-7xl">{question.num1}</span>
            <span className="text-5xl text-purple-500">{question.operator}</span>
            <span className="text-7xl">{question.num2}</span>
            <span className="text-5xl text-purple-500">=</span>
            <span className="text-7xl text-purple-600">?</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            inputMode="decimal"
            value={answer}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || val === '-' || /^-?\d*[./]?\d*$/.test(val)) {
                setAnswer(val);
              }
            }}
            placeholder="Type your answer..."
            className="text-4xl text-center h-20 rounded-2xl border-4 border-purple-200 focus:border-purple-400"
            autoFocus
            disabled={feedback !== null}
            ref={(input) => input && feedback === null && input.focus()}
          />

          <Button
            type="submit"
            disabled={answer === '' || feedback !== null}
            className="w-full h-16 text-2xl font-bold rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            Submit Answer! 🚀
          </Button>
        </form>

        <AnimatePresence>
          {feedback !== null && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`mt-6 p-6 rounded-2xl text-center ${
                feedback ? 'bg-green-100 border-4 border-green-400' : 'bg-red-100 border-4 border-red-400'
              }`}
            >
              <div className="flex items-center justify-center gap-3 text-3xl font-bold">
                {feedback ? (
                  <>
                    <Check className="w-10 h-10 text-green-600" />
                    <span className="text-green-600">Awesome! 🎉</span>
                    <Sparkles className="w-10 h-10 text-yellow-500" />
                  </>
                ) : (
                  <>
                    <X className="w-10 h-10 text-red-600" />
                    <span className="text-red-600">Try Again! 💪</span>
                  </>
                )}
              </div>
              {!feedback && (
                <p className="text-xl text-gray-700 mt-3">
                  The correct answer is: <span className="font-bold text-2xl">{question.answer}</span>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
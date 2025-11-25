import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DifficultySelector from '../components/math/DifficultySelector';
import QuestionCard from '../components/math/QuestionCard';
import ScoreDisplay from '../components/math/ScoreDisplay';
import ResultsScreen from '../components/math/ResultsScreen';
import { storage } from '../components/utils/Storage';
import { useLocation } from 'react-router-dom';

const TOTAL_QUESTIONS = 10;

export default function Game() {

    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const operation = urlParams.get('operation');
    const mode = urlParams.get('mode');
    const navigate = useNavigate();

    const [difficulty, setDifficulty] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [timerActive, setTimerActive] = useState(false);

    const generateQuestion = (op, diff) => {
        const ranges = {
            easy: { min: 1, max: 10 },
            medium: { min: 5, max: 50 },
            hard: { min: 10, max: 100 }
        };

        const range = ranges[diff];
        let num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        let num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        let answer, operator;

        switch (op) {
            case 'addition':
                operator = '+';
                answer = num1 + num2;
                break;
            case 'subtraction':
                operator = '−';
                if (num2 > num1) [num1, num2] = [num2, num1];
                answer = num1 - num2;
                break;
            case 'multiplication':
                operator = '×';
                if (diff === 'easy') {
                    num1 = Math.floor(Math.random() * 10) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                }
                answer = num1 * num2;
                break;
            case 'division':
                operator = '÷';
                num2 = Math.floor(Math.random() * (diff === 'easy' ? 10 : diff === 'medium' ? 12 : 15)) + 1;
                answer = Math.floor(Math.random() * (diff === 'easy' ? 10 : diff === 'medium' ? 20 : 30)) + 1;
                num1 = answer * num2;
                break;
            case 'fractions':
                operator = '+';
                const denom = diff === 'easy' ? 4 : diff === 'medium' ? 8 : 12;
                num1 = `${Math.floor(Math.random() * denom)}/4`;
                num2 = `${Math.floor(Math.random() * denom)}/4`;
                const [n1, d1] = num1.split('/').map(Number);
                const [n2, d2] = num2.split('/').map(Number);
                answer = ((n1 + n2) / d1).toFixed(2);
                break;
            case 'decimals':
                operator = '+';
                num1 = (Math.random() * (diff === 'easy' ? 10 : diff === 'medium' ? 50 : 100)).toFixed(1);
                num2 = (Math.random() * (diff === 'easy' ? 10 : diff === 'medium' ? 50 : 100)).toFixed(1);
                answer = (parseFloat(num1) + parseFloat(num2)).toFixed(1);
                break;
            default:
                operator = '+';
                answer = num1 + num2;
        }

        return { num1, num2, operator, answer };
    };

    useEffect(() => {
        if (mode === 'timed' && timerActive && timeLeft > 0 && !showResults) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (mode === 'timed' && timeLeft === 0 && !showResults) {
            setShowResults(true);
            saveProgress(false);
        }
    }, [timeLeft, timerActive, showResults, mode]);

    const startGame = (selectedDifficulty) => {
        setDifficulty(selectedDifficulty);
        const newQuestions = Array.from({ length: TOTAL_QUESTIONS }, () =>
            generateQuestion(operation || 'addition', selectedDifficulty)
        );
        setQuestions(newQuestions);
        setCurrentQuestion(0);
        setScore(0);
        setCorrect(0);
        setStreak(0);
        setShowResults(false);
        if (mode === 'timed') {
            setTimeLeft(60);
            setTimerActive(true);
        }
    };

    const handleAnswer = (isCorrect) => {
        if (isCorrect) {
            const newStreak = streak + 1;
            const points = 10 + (newStreak * 5);
            setScore(score + points);
            setCorrect(correct + 1);
            setStreak(newStreak);
            if (newStreak > bestStreak) setBestStreak(newStreak);
        } else {
            setStreak(0);
        }

        if (currentQuestion + 1 >= TOTAL_QUESTIONS) {
            setShowResults(true);
            saveProgress(isCorrect);
        } else {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const saveProgress = (lastCorrect) => {
        const finalCorrect = correct + (lastCorrect ? 1 : 0);
        const finalScore = lastCorrect ? score + 10 + (streak + 1) * 5 : score;

        storage.addProgress({
            operation: operation || 'mixed',
            difficulty,
            score: finalScore,
            correct_answers: finalCorrect,
            total_questions: TOTAL_QUESTIONS,
            stars_earned: finalCorrect >= 9 ? 3 : finalCorrect >= 7 ? 2 : finalCorrect >= 5 ? 1 : 0,
            best_streak: Math.max(bestStreak, lastCorrect ? streak + 1 : streak)
        });

        const avatar = storage.getAvatar();
        if (avatar) {
            const currentStars = avatar.total_stars || 0;
            const starsEarned = finalCorrect >= 9 ? 3 : finalCorrect >= 7 ? 2 : finalCorrect >= 5 ? 1 : 0;
            storage.saveAvatar({
                ...avatar,
                total_stars: currentStars + starsEarned
            });
        }
    };

    if (!operation && mode !== 'timed') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops! No operation selected</h2>
                    <Button onClick={() => navigate('/Home')}>
                        Go Back Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                <Button
                    onClick={() => navigate('/Home')}
                    variant="outline"
                    className="mb-6 rounded-xl border-2 border-purple-300 hover:bg-white"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back Home
                </Button>

                <AnimatePresence mode="wait">
                    {!difficulty ? (
                        <motion.div
                            key="difficulty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-auto"
                        >
                            <DifficultySelector onSelect={startGame} />
                        </motion.div>
                    ) : showResults ? (
                        <ResultsScreen
                            key="results"
                            score={score}
                            correct={correct}
                            total={TOTAL_QUESTIONS}
                            onPlayAgain={() => startGame(difficulty)}
                            onHome={() => navigate('/Home')}
                        />
                    ) : (
                        <motion.div
                            key="game"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {mode === 'timed' && (
                                <div className="text-center mb-6">
                                    <motion.div
                                        className={`inline-block px-8 py-4 rounded-2xl text-3xl font-bold ${timeLeft <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-purple-600'
                                            } shadow-xl border-4 border-purple-300`}
                                    >
                                        ⏱️ {timeLeft}s
                                    </motion.div>
                                </div>
                            )}
                            <ScoreDisplay
                                score={score}
                                correct={correct}
                                total={currentQuestion}
                                streak={streak}
                            />
                            <AnimatePresence mode="wait">
                                <QuestionCard
                                    key={currentQuestion}
                                    question={questions[currentQuestion]}
                                    onAnswer={handleAnswer}
                                    questionNumber={currentQuestion + 1}
                                    totalQuestions={TOTAL_QUESTIONS}
                                />
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
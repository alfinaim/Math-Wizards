import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, Heart, Swords, Crown, Sparkles, Check, X } from 'lucide-react';
import { storage } from '../components/utils/storage';

const bosses = {
    1: { name: 'Goblin King', emoji: '👺', hp: 3 },
    2: { name: 'Sand Serpent', emoji: '🐍', hp: 4 },
    3: { name: 'Crystal Golem', emoji: '🗿', hp: 4 },
    4: { name: 'Ice Dragon', emoji: '🐲', hp: 5 },
    5: { name: 'Forest Witch', emoji: '🧙‍♀️', hp: 5 },
    6: { name: 'Math Dragon', emoji: '🐉', hp: 6 }
};

export default function AdventureGame() {
    const navigate = useNavigate();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const worldId = parseInt(urlParams.get('world'));
    const level = urlParams.get('level');
    const operation = urlParams.get('operation');
    const isBoss = urlParams.get('boss') === 'true';

    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answer, setAnswer] = useState('');
    const [playerHP, setPlayerHP] = useState(3);
    const [bossHP, setBossHP] = useState(isBoss ? bosses[worldId]?.hp || 3 : 0);
    const [feedback, setFeedback] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [victory, setVictory] = useState(false);
    const [xpEarned, setXpEarned] = useState(0);
    const [bossTimeLeft, setBossTimeLeft] = useState(isBoss ? 15 : 0);

    const levelNum = level === 'boss' ? 8 : parseInt(level);
    const QUESTIONS_COUNT = isBoss ? bosses[worldId]?.hp || 5 : 5 + levelNum;
    const difficulty = level === 'boss' ? 'hard' : levelNum <= 3 ? 'easy' : levelNum <= 6 ? 'medium' : 'hard';

    useEffect(() => {
        generateQuestions();
    }, []);

    // Boss timer
    useEffect(() => {
        if (!isBoss || gameOver || victory || feedback !== null) return;

        const timer = setInterval(() => {
            setBossTimeLeft(prev => {
                if (prev <= 1) {
                    // Time's up - lose a life
                    setPlayerHP(p => {
                        if (p <= 1) {
                            setGameOver(true);
                        }
                        return p - 1;
                    });
                    return 15; // Reset timer
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isBoss, gameOver, victory, feedback, currentQ]);

    const generateQuestion = () => {
        const ranges = {
            easy: { min: 1, max: 10 },
            medium: { min: 5, max: 25 },
            hard: { min: 10, max: 50 }
        };
        const range = ranges[difficulty];
        let num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        let num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        let ans, op;

        switch (operation) {
            case 'addition':
                op = '+'; ans = num1 + num2; break;
            case 'subtraction':
                op = '−'; if (num2 > num1) [num1, num2] = [num2, num1]; ans = num1 - num2; break;
            case 'multiplication':
                op = '×'; num1 = Math.floor(Math.random() * 12) + 1; num2 = Math.floor(Math.random() * 12) + 1; ans = num1 * num2; break;
            case 'division':
                op = '÷'; num2 = Math.floor(Math.random() * 10) + 1; ans = Math.floor(Math.random() * 10) + 1; num1 = ans * num2; break;
            case 'fractions':
                const denoms = [2, 3, 4, 5];
                const d = denoms[Math.floor(Math.random() * denoms.length)];
                const f1 = Math.floor(Math.random() * (d - 1)) + 1;
                const f2 = Math.floor(Math.random() * (d - 1)) + 1;
                op = '+'; num1 = `${f1}/${d}`; num2 = `${f2}/${d}`; ans = ((f1 + f2) / d).toFixed(2); break;
            case 'decimals':
                op = '+'; num1 = (Math.random() * 10).toFixed(1); num2 = (Math.random() * 10).toFixed(1);
                ans = (parseFloat(num1) + parseFloat(num2)).toFixed(1); break;
            default:
                op = '+'; ans = num1 + num2;
        }
        return { num1, num2, operator: op, answer: ans };
    };

    const generateQuestions = () => {
        setQuestions(Array.from({ length: QUESTIONS_COUNT }, generateQuestion));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer === '' || feedback !== null) return;

        let userAns = answer;
        if (answer.includes('/')) {
            const [n, d] = answer.split('/').map(Number);
            userAns = d ? n / d : NaN;
        } else {
            userAns = parseFloat(answer);
        }

        const correct = !isNaN(userAns) && Math.abs(userAns - parseFloat(questions[currentQ].answer)) < 0.01;
        setFeedback(correct);

        if (correct) {
            if (isBoss) setBossHP(prev => prev - 1);
            setXpEarned(prev => prev + (isBoss ? 20 : 10));
        } else {
            setPlayerHP(prev => prev - 1);
        }

        setTimeout(() => {
            if (!correct && playerHP <= 1) {
                setGameOver(true);
                return;
            }

            if (correct && isBoss && bossHP <= 1) {
                handleVictory();
                return;
            }

            if (currentQ + 1 >= questions.length) {
                if (!isBoss || bossHP <= 1) handleVictory();
                else setGameOver(true);
            } else {
                setCurrentQ(prev => prev + 1);
                setAnswer('');
                setFeedback(null);
                if (isBoss) setBossTimeLeft(15); // Reset boss timer
            }
        }, 1000);
    };

    const handleVictory = () => {
        setVictory(true);
        const adventure = storage.getAdventure();

        if (isBoss && !adventure.defeatedBosses.includes(worldId)) {
            adventure.defeatedBosses.push(worldId);
            if (worldId < 6 && !adventure.unlockedWorlds.includes(worldId + 1)) {
                adventure.unlockedWorlds.push(worldId + 1);
            }
        }

        if (!isBoss) {
            if (adventure.currentWorld === worldId && levelNum >= adventure.currentLevel) {
                adventure.currentLevel = levelNum + 1;
                if (adventure.currentLevel > 8) {
                    adventure.currentLevel = 1;
                }
            }
        }

        adventure.totalXP += xpEarned + (isBoss ? 50 : 20);
        storage.saveAdventure(adventure);

        storage.addProgress({
            operation,
            difficulty,
            score: xpEarned,
            correct_answers: isBoss ? bosses[worldId].hp - bossHP + 1 : currentQ + 1,
            total_questions: QUESTIONS_COUNT,
            stars_earned: playerHP === 3 ? 3 : playerHP === 2 ? 2 : 1,
            best_streak: 0,
            mode: 'adventure'
        });
    };

    if (gameOver) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-red-900 flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Card className="p-8 text-center max-w-md bg-white">
                        <div className="text-6xl mb-4">💀</div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
                        <p className="text-gray-600 mb-6">Don't give up! Try again!</p>
                        <div className="flex gap-4 justify-center">
                            <Button className="flex-1 text-white bg-black hover:bg-gray-800" onClick={() => window.location.reload()}>Try Again</Button>
                            <Button className="hover:bg-gray-100" variant="outline" onClick={() => navigate(`/Adventure?world=${worldId}`)}>Back to Map</Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        );
    }

    if (victory) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Card className="p-8 text-center max-w-md bg-white">
                        <motion.div
                            className="text-8xl mb-4"
                            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            {isBoss ? '👑' : '⭐'}
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {isBoss ? 'Boss Defeated!' : 'Level Complete!'}
                        </h2>
                        <p className="text-2xl text-purple-600 font-bold mb-4">+{xpEarned + (isBoss ? 50 : 20)} XP</p>
                        <div className="flex gap-2 justify-center mb-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Star key={i} className={`w-10 h-10 ${i < playerHP ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <Button onClick={() => navigate(`/Adventure?world=${worldId}`)} className="w-full text-white bg-black hover:bg-gray-800">
                            Continue Adventure
                        </Button>
                    </Card>
                </motion.div>
            </div>
        );
    }

    const currentQuestion = questions[currentQ];
    if (!currentQuestion) return null;

    return (
        <div className={`min-h-screen ${isBoss ? 'bg-gradient-to-br from-red-900 to-orange-900' : 'bg-gradient-to-br from-indigo-900 to-purple-900'} py-8 px-4`}>
            <div className="container mx-auto max-w-2xl">
                <Button
                    onClick={() => navigate('/Adventure')}
                    variant="outline"
                    className="mb-6 bg-white/10 text-white hover:bg-white/20"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retreat
                </Button>

                {/* HP Bars */}
                <div className="flex justify-between items-center mb-6 gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-bold">You</span>
                            <div className="flex">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Heart key={i} className={`w-5 h-5 ${i < playerHP ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                                ))}
                            </div>
                        </div>
                        <Progress value={(playerHP / 3) * 100} className="h-3 bg-gray-700" />
                    </div>

                    {isBoss && (
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 justify-end">
                                <span className="text-white font-bold">{bosses[worldId].name}</span>
                                <span className="text-3xl">{bosses[worldId].emoji}</span>
                            </div>
                            <Progress value={(bossHP / bosses[worldId].hp) * 100} className="h-3 bg-gray-700" />
                        </div>
                    )}
                </div>

                {isBoss && (
                    <div className="text-center mb-6">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <span className="text-8xl">{bosses[worldId].emoji}</span>
                        </motion.div>
                        <motion.div
                            className={`mt-4 inline-block px-6 py-3 rounded-2xl text-2xl font-bold ${bossTimeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 text-white'
                                }`}
                        >
                            ⏱️ {bossTimeLeft}s
                        </motion.div>
                    </div>
                )}

                <Card className="p-8 bg-white/95 rounded-3xl">
                    <div className="text-center mb-4">
                        <span className="bg-purple-100 px-4 py-2 rounded-full text-purple-600 font-bold">
                            {isBoss ? `Attack ${currentQ + 1}` : `Question ${currentQ + 1}/${QUESTIONS_COUNT}`}
                        </span>
                    </div>

                    <div className="text-center mb-8">
                        <div className="text-5xl md:text-6xl font-bold text-gray-800 flex items-center justify-center gap-3">
                            <span>{currentQuestion.num1}</span>
                            <span className="text-purple-500">{currentQuestion.operator}</span>
                            <span>{currentQuestion.num2}</span>
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
                                if (val === '' || /^-?\d*[./]?\d*$/.test(val)) setAnswer(val);
                            }}
                            placeholder="Your answer..."
                            className="text-3xl text-center h-16 rounded-2xl border-4 border-purple-200"
                            autoFocus
                            disabled={feedback !== null}
                            ref={(input) => input && feedback === null && input.focus()}
                        />
                        <Button
                            type="submit"
                            disabled={answer === '' || feedback !== null}
                            className={`w-full h-14 text-xl font-bold rounded-2xl ${isBoss
                                    ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white'
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                                }`}
                        >
                            {isBoss ? '⚔️ Attack!' : 'Submit Answer!'}
                        </Button>
                    </form>

                    <AnimatePresence>
                        {feedback !== null && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`mt-4 p-4 rounded-xl text-center ${feedback ? 'bg-green-100' : 'bg-red-100'}`}
                            >
                                <div className="flex items-center justify-center gap-2 text-xl font-bold">
                                    {feedback ? (
                                        <>
                                            <Check className="w-6 h-6 text-green-600" />
                                            <span className="text-green-600">{isBoss ? 'Critical Hit! 💥' : 'Correct! ✨'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <X className="w-6 h-6 text-red-600" />
                                            <span className="text-red-600">Ouch! Answer: {currentQuestion.answer}</span>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </div>
        </div>
    );
}

function Star({ className }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );
}
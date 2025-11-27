import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Lock, Star, Swords, Crown, Sparkles } from 'lucide-react';
import { storage } from '../components/utils/storage';
import AvatarDisplay from '../components/avatar/AvatarDisplay';

const worlds = [
    { id: 1, name: 'Green Meadows', emoji: '🌳', color: 'from-green-400 to-emerald-500', operation: 'addition', levels: 8 },
    { id: 2, name: 'Sandy Desert', emoji: '🏜️', color: 'from-yellow-400 to-orange-500', operation: 'subtraction', levels: 8 },
    { id: 3, name: 'Crystal Cave', emoji: '💎', color: 'from-purple-400 to-indigo-500', operation: 'multiplication', levels: 8 },
    { id: 4, name: 'Frozen Peaks', emoji: '🏔️', color: 'from-blue-400 to-cyan-500', operation: 'division', levels: 8 },
    { id: 5, name: 'Magic Forest', emoji: '🌲', color: 'from-teal-400 to-green-500', operation: 'fractions', levels: 8 },
    { id: 6, name: 'Dragon Castle', emoji: '🏰', color: 'from-red-400 to-pink-500', operation: 'decimals', levels: 8 }
];

const storyDialogues = {
    1: {
        intro: "Welcome, young hero! The Goblin King has stolen all the plus signs from our village. Help us get them back!",
        levels: {
            1: "Start with the easy ones. You can do it!",
            4: "You're getting stronger! The goblins are getting worried.",
            8: "The Goblin King awaits. Are you ready?"
        },
        boss: "So, you think you can defeat ME? Let's see how fast you can add!"
    },
    2: {
        intro: "The Sand Serpent has cursed our oasis! Only subtraction magic can break the spell.",
        levels: {
            1: "The desert is hot, but you're hotter!",
            4: "Halfway there! The serpent grows restless.",
            8: "The serpent's lair is near. Be brave!"
        },
        boss: "Ssssso, you dare challenge me? Subtract THIS!"
    },
    3: {
        intro: "Deep in the Crystal Cave, treasures multiply! But so do the dangers...",
        levels: {
            1: "These crystals glow with multiplication power!",
            4: "The cave gets darker, but your skills shine brighter!",
            8: "The Crystal Golem guards the deepest chamber."
        },
        boss: "I am UNBREAKABLE! Multiply or be crushed!"
    },
    4: {
        intro: "The Frozen Peaks hold the secret of division. Climb carefully, hero!",
        levels: {
            1: "The ice is slippery, but your mind is sharp!",
            4: "The wind howls, but you press on!",
            8: "The Ice Dragon's breath freezes everything. Everything except... math!"
        },
        boss: "My icy breath will freeze your brain! Divide if you can!"
    },
    5: {
        intro: "The Magic Forest speaks in fractions. Listen carefully to its wisdom.",
        levels: {
            1: "The trees whisper fraction secrets to those who listen.",
            4: "The forest spirits are impressed by your progress!",
            8: "The Witch's tower looms ahead. She fears no one... except mathematicians!"
        },
        boss: "My potions are 3/4 complete! Can you solve my riddles in time?"
    },
    6: {
        intro: "The Dragon Castle! Home of the Math Dragon, the final boss of all!",
        levels: {
            1: "Decimals are the dragon's favorite. Learn them well!",
            4: "The castle trembles. The dragon knows you're coming!",
            8: "This is it. The final challenge awaits!"
        },
        boss: "I am the MATH DRAGON! Conquer decimals or perish!"
    }
};

const bosses = {
    1: { name: 'Goblin King', emoji: '👺', difficulty: 'easy' },
    2: { name: 'Sand Serpent', emoji: '🐍', difficulty: 'medium' },
    3: { name: 'Crystal Golem', emoji: '🗿', difficulty: 'medium' },
    4: { name: 'Ice Dragon', emoji: '🐲', difficulty: 'hard' },
    5: { name: 'Forest Witch', emoji: '🧙‍♀️', difficulty: 'hard' },
    6: { name: 'Math Dragon', emoji: '🐉', difficulty: 'hard' }
};

export default function Adventure() {
    const navigate = useNavigate();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const returnWorld = urlParams.get('world');

    const [adventure, setAdventure] = useState(storage.getAdventure());
    const [avatar, setAvatar] = useState(null);
    const [selectedWorld, setSelectedWorld] = useState(null);
    const [showDialogue, setShowDialogue] = useState(null);

    useEffect(() => {
        setAvatar(storage.getAvatar());
        // Return to the same world after completing a level
        if (returnWorld) {
            const world = worlds.find(w => w.id === parseInt(returnWorld));
            if (world) setSelectedWorld(world);
        }
    }, [returnWorld]);

    const isWorldUnlocked = (worldId) => adventure.unlockedWorlds.includes(worldId);
    const isBossDefeated = (worldId) => adventure.defeatedBosses.includes(worldId);

    const startLevel = (world, level, isBoss = false) => {
        const dialogue = isBoss
            ? storyDialogues[world.id].boss
            : storyDialogues[world.id].levels[level] || null;

        if (dialogue) {
            setShowDialogue({ text: dialogue, world, level, isBoss });
        } else {
            navigate(`/AdventureGame?world=${world.id}&level=${level}&operation=${world.operation}&boss=${isBoss}`);
        }
    };

    const proceedAfterDialogue = () => {
        const { world, level, isBoss } = showDialogue;
        setShowDialogue(null);
        navigate(`/AdventureGame?world=${world.id}&level=${level}&operation=${world.operation}&boss=${isBoss}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex justify-between items-center mb-6">
                    <Button
                        onClick={() => navigate('/Home')}
                        variant="outline"
                        className="rounded-xl border-2 border-purple-300 bg-white/10 text-white hover:bg-white/20"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-500/20 px-4 py-2 rounded-full border-2 border-yellow-400">
                            <span className="text-yellow-300 font-bold">⚡ {adventure.totalXP} XP</span>
                        </div>
                        {avatar && (
                            <AvatarDisplay
                                character={avatar.selected_character}
                                color={avatar.selected_color}
                                size="sm"
                            />
                        )}
                    </div>
                </div>

                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 mb-2">
                        🗺️ Math Adventure
                    </h1>
                    <p className="text-xl text-purple-200">Defeat bosses and conquer the math kingdom!</p>
                </motion.div>

                {/* Story Dialogue Modal */}
                <AnimatePresence>
                    {showDialogue && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                            onClick={proceedAfterDialogue}
                        >
                            <motion.div
                                initial={{ scale: 0.8, y: 50 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.8, y: 50 }}
                                className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-8 max-w-lg border-4 border-amber-400 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="text-6xl text-center mb-4">
                                    {showDialogue.isBoss ? bosses[showDialogue.world.id].emoji : '📜'}
                                </div>
                                <p className="text-xl text-gray-800 text-center mb-6 leading-relaxed">
                                    "{showDialogue.text}"
                                </p>
                                <Button
                                    onClick={proceedAfterDialogue}
                                    className="text-white w-full h-14 text-xl font-bold rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                >
                                    {showDialogue.isBoss ? '⚔️ Fight!' : '➡️ Continue'}
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {!selectedWorld ? (
                        <motion.div
                            key="worlds"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {worlds.map((world, index) => (
                                <motion.div
                                    key={world.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card
                                        className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${isWorldUnlocked(world.id)
                                            ? 'hover:scale-105 hover:shadow-2xl'
                                            : 'opacity-60 cursor-not-allowed'
                                            }`}
                                        onClick={() => isWorldUnlocked(world.id) && setSelectedWorld(world)}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${world.color} opacity-90`} />
                                        <div className="relative p-6 text-white">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-6xl">{world.emoji}</span>
                                                {!isWorldUnlocked(world.id) && (
                                                    <Lock className="w-8 h-8 text-white/70" />
                                                )}
                                                {isBossDefeated(world.id) && (
                                                    <Crown className="w-8 h-8 text-yellow-300" />
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">{world.name}</h3>
                                            <p className="text-white/80 capitalize">{world.operation}</p>
                                            <div className="flex gap-1 mt-3">
                                                {Array.from({ length: world.levels }).map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < adventure.currentLevel && adventure.currentWorld >= world.id ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="levels"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <Button
                                    onClick={() => setSelectedWorld(null)}
                                    variant="outline"
                                    className="text-white hover:bg-white/20 border-white/30"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Map
                                </Button>
                                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                    <span className="text-4xl">{selectedWorld.emoji}</span>
                                    {selectedWorld.name}
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {Array.from({ length: selectedWorld.levels }).map((_, index) => {
                                    const levelNum = index + 1;
                                    const isUnlocked = adventure.currentWorld > selectedWorld.id ||
                                        (adventure.currentWorld === selectedWorld.id && adventure.currentLevel >= levelNum);
                                    const isCompleted = adventure.currentWorld > selectedWorld.id ||
                                        (adventure.currentWorld === selectedWorld.id && adventure.currentLevel > levelNum);
                                    const hasStoryDialogue = storyDialogues[selectedWorld.id].levels[levelNum];

                                    return (
                                        <motion.div
                                            key={levelNum}
                                            whileHover={isUnlocked ? { scale: 1.05 } : {}}
                                            whileTap={isUnlocked ? { scale: 0.95 } : {}}
                                        >
                                            <Card
                                                className={`p-4 text-center cursor-pointer transition-all ${isCompleted
                                                    ? 'bg-green-100 border-2 border-green-400'
                                                    : isUnlocked
                                                        ? 'bg-white hover:shadow-xl'
                                                        : 'bg-gray-400/50 cursor-not-allowed'
                                                    }`}
                                                onClick={() => isUnlocked && startLevel(selectedWorld, levelNum)}
                                            >
                                                {isUnlocked ? (
                                                    <>
                                                        {isCompleted ? (
                                                            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500 fill-yellow-500" />
                                                        ) : (
                                                            <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                                                        )}
                                                        <p className="text-xl font-bold text-gray-800">Level {levelNum}</p>
                                                        <p className="text-xs text-gray-500">{5 + levelNum} Questions</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-xs text-transparent">Locked</p>
                                                        <Lock className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                                                        <p className="text-xl font-bold text-gray-600">Locked</p>
                                                    </>
                                                )}
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Boss Battle */}
                            <motion.div
                                whileHover={!isBossDefeated(selectedWorld.id) ? { scale: 1.02 } : {}}
                            >
                                <Card
                                    className={`p-6 cursor-pointer transition-all ${isBossDefeated(selectedWorld.id)
                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                        : 'bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-2xl'
                                        }`}
                                    onClick={() => !isBossDefeated(selectedWorld.id) && startLevel(selectedWorld, 'boss', true)}
                                >
                                    <div className="flex items-center justify-between text-white">
                                        <div className="flex items-center gap-4">
                                            <span className="text-6xl">{bosses[selectedWorld.id].emoji}</span>
                                            <div>
                                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                                    <Swords className="w-6 h-6" />
                                                    {isBossDefeated(selectedWorld.id) ? 'Boss Defeated!' : 'BOSS BATTLE'}
                                                </h3>
                                                <p className="text-white/80">{bosses[selectedWorld.id].name}</p>
                                            </div>
                                        </div>
                                        {isBossDefeated(selectedWorld.id) ? (
                                            <Crown className="w-12 h-12 text-yellow-300" />
                                        ) : (
                                            <div className="text-right">
                                                <p className="text-sm text-white/70">Difficulty</p>
                                                <p className="font-bold capitalize">{bosses[selectedWorld.id].difficulty}</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
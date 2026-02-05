'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/app/Component/Protected';
import { Trophy, Medal, Crown, User, Star } from 'lucide-react';

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const res = await fetch('/api/leaderboard');
                if (res.ok) {
                    const data = await res.json();
                    setLeaders(data);
                }
            } catch (error) {
                console.error('Failed to fetch leaderboard');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaders();
    }, []);

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Crown className="w-8 h-8 text-yellow-400" />;
            case 1: return <Medal className="w-8 h-8 text-slate-300" />;
            case 2: return <Medal className="w-8 h-8 text-amber-700" />;
            default: return <span className="text-xl font-bold text-slate-500">#{index + 1}</span>;
        }
    };

    const getGlowEffect = (index) => {
        if (index === 0) return "shadow-[0_0_30px_rgba(250,204,21,0.3)] border-yellow-500/50";
        if (index === 1) return "shadow-[0_0_20px_rgba(203,213,225,0.2)] border-slate-400/50";
        if (index === 2) return "shadow-[0_0_20px_rgba(180,83,9,0.2)] border-amber-700/50";
        return "border-slate-700 hover:bg-slate-800/80";
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen text-white p-6 md:p-12 relative overflow-hidden">

                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-4">
                            <Trophy className="w-12 h-12 text-yellow-500" />
                            <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                Global Leaderboard
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Top performing students this semester
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {leaders.map((user, index) => (
                                <motion.div
                                    key={user._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-slate-800/40 backdrop-blur-md rounded-2xl p-4 flex items-center gap-6 border transition-all duration-300 ${getGlowEffect(index)}`}
                                >
                                    <div className="flex-shrink-0 w-12 flex justify-center">
                                        {getRankIcon(index)}
                                    </div>

                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            {user.username}
                                            {index === 0 && <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full font-extrabold">CHAMPION</span>}
                                        </h3>
                                        <div className="text-sm text-slate-400 flex items-center gap-3">
                                            <span>Level {user.level || 1}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-yellow-500" />
                                                {user.stats?.quizzesGenerated || 0} Quizzes
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right pr-4">
                                        <div className="text-2xl font-black text-white">{user.xp?.toLocaleString()}</div>
                                        <div className="text-xs text-slate-500 font-bold tracking-wider">XP GENERATED</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

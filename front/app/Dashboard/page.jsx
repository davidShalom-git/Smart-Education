'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/app/Component/Protected';
import Link from 'next/link';
import {
    Trophy,
    TrendingUp,
    Activity,
    Clock,
    Star,
    Target,
    BarChart,
    FileText,
    Mic,
    Mail,
    Zap,
    Award
} from 'lucide-react';

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [activities, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('/api/dashboard');
                if (res.ok) {
                    const data = await res.json();
                    setUserData(data.user);
                    setActivity(data.recentActivity);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    // Calculate XP Progress (Simple: Level * 1000)
    const xpForNextLevel = 1000;
    const currentLevelXp = (userData?.xp || 0) % 1000;
    const progressPercent = (currentLevelXp / xpForNextLevel) * 100;

    return (
        <ProtectedRoute>
            <div className="min-h-screen text-slate-100 p-6 md:p-12 font-sans">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                                Student Dashboard
                            </h1>
                            <p className="text-slate-400 text-lg">Welcome back, {userData?.username || 'Student'}!</p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                            <div className="bg-yellow-500/20 p-2 rounded-lg">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-semibold">Current Level</div>
                                <div className="text-xl font-bold text-white">Level {userData?.level || 1}</div>
                            </div>
                        </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <div className="flex justify-between items-center mb-2 text-sm">
                            <span className="text-purple-300 font-medium">XP Progress</span>
                            <span className="text-slate-400">{currentLevelXp} / {xpForNextLevel} XP</span>
                        </div>
                        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-right">
                            {Math.round(100 - progressPercent)}% to Level {(userData?.level || 1) + 1}!
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={<FileText className="w-5 h-5 text-green-400" />}
                            label="Quizzes Generated"
                            value={userData?.stats?.quizzesGenerated || 0}
                            color="bg-green-500/10 border-green-500/20"
                        />
                        <StatCard
                            icon={<BarChart className="w-5 h-5 text-blue-400" />}
                            label="Charts Created"
                            value={userData?.stats?.chartsGenerated || 0}
                            color="bg-blue-500/10 border-blue-500/20"
                        />
                        <StatCard
                            icon={<Mail className="w-5 h-5 text-purple-400" />}
                            label="Emails Sent"
                            value={userData?.stats?.emailsSent || 0}
                            color="bg-purple-500/10 border-purple-500/20"
                        />
                        <StatCard
                            icon={<Star className="w-5 h-5 text-yellow-400" />}
                            label="Total XP Earned"
                            value={userData?.xp || 0}
                            color="bg-yellow-500/10 border-yellow-500/20"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Recent Activity Feed */}
                        <div className="lg:col-span-2 bg-slate-800/30 rounded-2xl border border-slate-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-400" />
                                    Recent Activity
                                </h3>
                                <span className="text-sm text-slate-500">Last 10 Actions</span>
                            </div>

                            <div className="space-y-4">
                                {activities.length > 0 ? (
                                    activities.map((item) => (
                                        <div key={item._id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors border border-slate-700/50">
                                            <ActivityIcon type={item.type} />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-white">{item.title}</h4>
                                                <p className="text-sm text-slate-400">{item.description}</p>
                                                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                                    <span className="bg-slate-700 px-2 py-1 rounded text-slate-300">+{item.xpEarned} XP</span>
                                                    <span>•</span>
                                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-slate-500">
                                        No activity yet. Go generate some content!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions / Badges */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 border border-indigo-700/50 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-semibold mb-2">Pro Tip</h3>
                                    <p className="text-indigo-200 text-sm mb-4">
                                        Generate Quizzes to earn double XP this week!
                                    </p>
                                    <Link href="/Agents/Quiz">
                                        <button className="bg-white text-indigo-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
                                            Start Quiz Agent
                                        </button>
                                    </Link>
                                </div>
                                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                                    <Zap className="w-40 h-40" />
                                </div>
                            </div>

                            <div className="bg-slate-800/30 rounded-2xl border border-slate-700 p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    Badges
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {/* Placeholder badges */}
                                    <Badge name="Novice" icon="🌱" unlocked={true} />
                                    <Badge name="Quiz Master" icon="📚" unlocked={(userData?.stats?.quizzesGenerated || 0) > 5} />
                                    <Badge name="Chart Pro" icon="📊" unlocked={(userData?.stats?.chartsGenerated || 0) > 5} />
                                    <Badge name="Voice Actor" icon="🎤" unlocked={(userData?.stats?.minutesRecorded || 0) > 5} />
                                    <Badge name="Elite" icon="🏆" unlocked={userData?.level > 5} />
                                    <Badge name="Legend" icon="👑" unlocked={userData?.level > 10} />
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </ProtectedRoute>
    );
}

function StatCard({ icon, label, value, color }) {
    return (
        <div className={`p-4 rounded-xl border ${color} bg-opacity-10 backdrop-blur-sm`}>
            <div className="flex justify-between items-start mb-2">
                {icon}
                <TrendingUp className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-slate-400">{label}</div>
        </div>
    );
}

function ActivityIcon({ type }) {
    const icons = {
        'QUIZ': <FileText className="w-5 h-5 text-green-400" />,
        'CHART': <BarChart className="w-5 h-5 text-blue-400" />,
        'EMAIL': <Mail className="w-5 h-5 text-purple-400" />,
        'SPEECH': <Mic className="w-5 h-5 text-pink-400" />
    };

    return (
        <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center border border-slate-600">
            {icons[type] || <Activity className="w-5 h-5 text-slate-400" />}
        </div>
    );
}

function Badge({ name, icon, unlocked }) {
    return (
        <div className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 ${unlocked ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-slate-800/50 border-slate-800 text-slate-600 grayscale'}`}>
            <div className="text-2xl">{icon}</div>
            <div className="text-[10px] font-medium leading-none">{name}</div>
        </div>
    )
}

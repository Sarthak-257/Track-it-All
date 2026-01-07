'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useHabitStore } from '@/store/habitStore';
import API from '@/services/api';
import StatCard from '@/components/StatCard';
import HabitProgressChart from '@/components/HabitProgressChart';
import HabitGrid from '@/components/HabitGrid';
import AddHabitModal from '@/components/AddHabitModal';
import { Plus, Target, Zap, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';

export default function Dashboard() {
    const { user } = useAuthStore();
    const { habits, fetchHabits, loading } = useHabitStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState<any[]>([]);
    const [rankings, setRankings] = useState<any>(null);

    useEffect(() => {
        if (user) {
            fetchHabits();
            fetchDashboardData();
        }
    }, [user, fetchHabits]);

    const fetchDashboardData = async () => {
        try {
            const [weeklyRes, rankingsRes] = await Promise.all([
                API.get('/stats/weekly'),
                API.get('/stats/rankings')
            ]);
            setStats(weeklyRes.data);
            setRankings(rankingsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    return (
        <AuthGuard>
            <main className="relative">
                {/* Futuristic Background Elements */}
                <div className="neo-blur top-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-500" />
                <div className="neo-blur bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-purple-500" />

                <div className="max-w-7xl mx-auto space-y-12">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
                                YOUR <span className="text-cyan-400 text-glow">DASHBOARD</span>
                            </h1>
                            <div className="flex items-center space-x-2 text-slate-400">
                                <Calendar size={16} className="text-cyan-500" />
                                <span className="font-mono text-xs uppercase tracking-widest leading-none">
                                    System Status: Online | {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-3.5 rounded-full font-black text-sm uppercase tracking-tighter flex items-center space-x-2 transition-all"
                        >
                            <Plus size={20} strokeWidth={3} />
                            <span>Add New Habit</span>
                        </motion.button>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            label="Consistency"
                            value={`${rankings?.best?.rate || 0}%`}
                            subValue="DAILY AVG"
                            icon={Target}
                            color="cyan"
                        />
                        <StatCard
                            label="Top Habit"
                            value={rankings?.best?.name || '---'}
                            subValue="BEST PERFORMING"
                            icon={Zap}
                            color="lime"
                        />
                        <StatCard
                            label="Needs Focus"
                            value={rankings?.worst?.name || '---'}
                            subValue="LOWEST RATE"
                            icon={TrendingUp}
                            color="purple"
                        />
                        <StatCard
                            label="Total Habits"
                            value={habits.length}
                            subValue="ACTIVE NOW"
                            icon={Target}
                            color="cyan"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Interactive Chart */}
                        <div className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden h-full flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Performance Trend</h2>
                                <p className="text-slate-500 text-sm mb-6">Your progress over the last 7 days</p>
                            </div>
                            <HabitProgressChart data={stats} />
                        </div>

                        {/* Best/Worst Detail */}
                        <div className="glass-card rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="w-12 h-12 bg-lime-500 opacity-5 blur-2xl rounded-full" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-white mb-6">Analysis</h2>

                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400">
                                            <TrendingUp size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Efficiency Leader</p>
                                            <p className="text-white font-bold">{rankings?.best?.name || 'None'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                            <Zap size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Improvement Area</p>
                                            <p className="text-white font-bold">{rankings?.worst?.name || 'None'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5">
                                <Link href="/analytics">
                                    <button className="w-full py-4 rounded-xl border border-white/10 text-white text-xs uppercase font-black tracking-widest hover:bg-white/5 transition-colors">
                                        View Full Stats
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Habit Grid */}
                    <HabitGrid />
                </div>

                <AddHabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </main>
        </AuthGuard>
    );
}


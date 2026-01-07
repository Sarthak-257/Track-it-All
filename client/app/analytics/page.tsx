'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
} from 'recharts';
import { Trophy, TrendingDown, Target, Zap, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthGuard from '@/components/AuthGuard';
import StatCard from '@/components/StatCard';

export default function AnalyticsPage() {
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [rankings, setRankings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const { user } = useAuthStore();

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const [weeklyResp, monthlyResp, rankingsResp] = await Promise.all([
                    API.get('/stats/weekly'),
                    API.get('/stats/monthly'),
                    API.get('/stats/rankings'),
                ]);
                setWeeklyData(weeklyResp.data);
                setMonthlyData(monthlyResp.data);
                setRankings(rankingsResp.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-[#030712]">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <AuthGuard>
            <main className="relative bg-[#030712]">
                <div className="neo-blur top-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-500/10" />
                <div className="neo-blur bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-purple-500/10" />

                <div className="max-w-7xl mx-auto space-y-12">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl font-black text-white tracking-tighter uppercase">
                                Your <span className="text-cyan-400 text-glow">Statistics</span>
                            </h1>
                            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] mt-2">Activity History | Detailed Insights</p>
                        </div>
                        <div className="flex items-center space-x-4 bg-white/5 border border-white/5 rounded-2xl p-4">
                            <ShieldCheck className="text-purple-400" size={24} />
                            <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Repair Tokens</p>
                                <p className="text-2xl font-black text-white font-mono leading-none">{(user as any)?.streakRepairTokens || 0} <span className="text-[10px] text-slate-600">TOKENS</span></p>
                            </div>
                        </div>
                    </header>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            label="Best Habit"
                            value={rankings?.best?.name || 'N/A'}
                            subValue={`${rankings?.best?.rate || 0}% Completion`}
                            icon={Trophy}
                            color="cyan"
                        />
                        <StatCard
                            label="Needs Focus"
                            value={rankings?.worst?.name || 'N/A'}
                            subValue={`${rankings?.worst?.rate || 0}% Success`}
                            icon={TrendingDown}
                            color="purple"
                        />
                        <StatCard
                            label="Active Habits"
                            value={rankings?.all?.length || 0}
                            subValue="Currently Tracked"
                            icon={Target}
                            color="cyan"
                        />
                        <StatCard
                            label="Overall Average"
                            value={`${Math.round(rankings?.all?.reduce((acc: any, r: any) => acc + r.rate, 0) / (rankings?.all?.length || 1))}%`}
                            subValue="Total Efficiency"
                            icon={Zap}
                            color="lime"
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 flex space-x-2">
                                <Activity className="text-cyan-500 opacity-20" size={20} />
                                <Cpu className="text-cyan-500 opacity-20" size={20} />
                            </div>

                            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-10">Activity Trend</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={weeklyData}>
                                        <defs>
                                            <linearGradient id="colorSync" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="rgba(255,255,255,0.2)"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                                            tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                                        />
                                        <YAxis
                                            stroke="rgba(255,255,255,0.2)"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#f8fafc' }}
                                            itemStyle={{ color: '#22d3ee', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="completed"
                                            stroke="#22d3ee"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorSync)"
                                            dot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }}
                                            activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="glass-card rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-10">Monthly Vol</h3>
                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                stroke="rgba(255,255,255,0.2)"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                                                tickFormatter={(val) => new Date(val).getDate().toString()}
                                            />
                                            <YAxis hide />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                                contentStyle={{ backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                                            />
                                            <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                                                {monthlyData.map((entry: any, index) => (
                                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#22d3ee' : '#a3e635'} opacity={0.6} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="mt-8 border-t border-white/5 pt-6 text-center">
                                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Global Sync Status: Operational</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AuthGuard>
    );
}

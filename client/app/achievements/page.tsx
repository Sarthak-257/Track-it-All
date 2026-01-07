'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';
import BadgeGallery from '@/components/BadgeGallery';
import AuthGuard from '@/components/AuthGuard';
import { Award, ShieldCheck, Zap, Activity, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AchievementsPage() {
    const [badges, setBadges] = useState([]);
    const [userBadges, setUserBadges] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allRes, userRes] = await Promise.all([
                    API.get('/badges'),
                    API.get('/badges/user')
                ]);
                setBadges(allRes.data);
                setUserBadges(userRes.data.map((b: any) => b._id));
            } catch (error) {
                console.error('Error fetching badges:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-[#030712]">
            <Loader2 className="text-cyan-500 animate-spin" size={40} />
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
                                Your <span className="text-cyan-400 text-glow">Badges</span>
                            </h1>
                            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] mt-2">Personal Achievements | Milestones reached</p>
                        </div>
                        <div className="flex items-center space-x-4 bg-white/5 border border-white/5 rounded-2xl p-4">
                            <Award className="text-cyan-400" size={24} />
                            <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Total Earned</p>
                                <p className="text-2xl font-black text-white font-mono leading-none">{userBadges.length} <span className="text-[10px] text-slate-600">BADGES</span></p>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 gap-8">
                        <BadgeGallery badges={badges} userBadges={userBadges} />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card rounded-3xl p-6 border border-white/5 flex items-center space-x-4">
                                <Activity className="text-purple-400" size={24} />
                                <div>
                                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Global Ranking</p>
                                    <p className="text-white font-bold text-lg">TOP 5%</p>
                                </div>
                            </div>
                            <div className="glass-card rounded-3xl p-6 border border-white/5 flex items-center space-x-4">
                                <Zap className="text-lime-400" size={24} />
                                <div>
                                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Efficiency index</p>
                                    <p className="text-white font-bold text-lg">EXTREME</p>
                                </div>
                            </div>
                            <div className="glass-card rounded-3xl p-6 border border-white/5 flex items-center space-x-4">
                                <ShieldCheck className="text-cyan-400" size={24} />
                                <div>
                                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest">System Health</p>
                                    <p className="text-white font-bold text-lg">98.2%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AuthGuard>
    );
}

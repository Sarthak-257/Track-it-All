'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Calendar, Target, Plus, ChevronRight, Zap, Loader2, Sparkles, Sword } from 'lucide-react';
import { useChallengeStore } from '@/store/challengeStore';
import { useAuthStore } from '@/store/authStore';
import AuthGuard from '@/components/AuthGuard';
import { format } from 'date-fns';

export default function ChallengesPage() {
    const { challenges, loading, fetchChallenges, joinChallenge } = useChallengeStore();
    const { user } = useAuthStore();
    const [joiningId, setJoiningId] = useState<string | null>(null);

    useEffect(() => {
        fetchChallenges();
    }, []);

    const handleJoin = async (id: string) => {
        setJoiningId(id);
        try {
            await joinChallenge(id);
        } catch (error) {
            console.error(error);
        } finally {
            setJoiningId(null);
        }
    };

    return (
        <AuthGuard>
            <main className="relative">
                <div className="neo-blur top-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-500/10" />
                <div className="neo-blur bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-purple-500/10" />

                <div className="max-w-7xl mx-auto space-y-12">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl font-black text-white tracking-tighter uppercase">
                                Active <span className="text-purple-400 text-glow">Challenges</span>
                            </h1>
                            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] mt-2">Join the Community | Reach your goals</p>
                        </div>
                        <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-6 py-4 flex items-center space-x-3 transition-all group">
                            <Plus className="text-purple-400 group-hover:rotate-90 transition-transform" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Create Challenge</span>
                        </button>
                    </header>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 space-y-4">
                            <Loader2 className="text-cyan-500 animate-spin" size={40} />
                            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Searching for Challenges...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {challenges.map((challenge, idx) => {
                                const isParticipant = challenge.participants.some(p => p.user === (user as any)?._id);
                                const participantData = challenge.participants.find(p => p.user === (user as any)?._id);
                                const progress = participantData ? (participantData.progress / challenge.goal) * 100 : 0;

                                return (
                                    <motion.div
                                        key={challenge._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="glass-card rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col group hover:border-purple-500/30 transition-all"
                                    >
                                        <div className="absolute top-0 right-0 p-8">
                                            <Sword className="text-purple-500 opacity-20" size={24} />
                                        </div>

                                        <div className="relative z-10 space-y-6 flex-grow">
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full">Ongoing</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-purple-400 transition-colors">
                                                    {challenge.name}
                                                </h3>
                                                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                                                    {challenge.description}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-4">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Target Goal</p>
                                                    <div className="flex items-center space-x-2 text-white">
                                                        <Target size={14} className="text-cyan-400" />
                                                        <span className="font-bold text-sm">{challenge.goal} Points</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Participants</p>
                                                    <div className="flex items-center space-x-2 text-white">
                                                        <Users size={14} className="text-cyan-400" />
                                                        <span className="font-bold text-sm">{challenge.participants.length} Active</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 space-y-4">
                                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                                    <span className="text-slate-500 flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {format(new Date(challenge.endDate), 'MMM dd')} END
                                                    </span>
                                                    <span className="text-cyan-400">{Math.round(progress)}% PROGRESS</span>
                                                </div>
                                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                                            {isParticipant ? (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse shadow-[0_0_8px_rgba(163,230,53,0.6)]" />
                                                        <span className="text-[10px] font-black text-lime-400 uppercase tracking-widest">Challenge Joined</span>
                                                    </div>
                                                    <button className="text-slate-500 hover:text-white transition-colors">
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleJoin(challenge._id)}
                                                    disabled={joiningId === challenge._id}
                                                    className="w-full bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center space-x-3 transition-all uppercase tracking-widest text-[10px]"
                                                >
                                                    {joiningId === challenge._id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Zap size={16} fill="currentColor" />
                                                            <span>Join Challenge</span>
                                                        </>
                                                    )}
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </AuthGuard>
    );
}

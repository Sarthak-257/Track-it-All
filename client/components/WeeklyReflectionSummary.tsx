'use client';

import { format, startOfWeek, addDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Brain, Star, CloudRain, Zap, Goal, Target } from 'lucide-react';

interface WeeklySummary {
    period: { start: string; end: string };
    totalCompletions: number;
    journals: any[];
}

export default function WeeklyReflectionSummary({ summary }: { summary: WeeklySummary }) {
    if (!summary) return null;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Weekly <span className="text-cyan-400">Summary</span></h2>
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] mt-1">
                        Range: {format(new Date(summary.period.start), 'MMM dd')} - {format(new Date(summary.period.end), 'MMM dd')}
                    </p>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="text-right">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Completions</p>
                        <p className="text-3xl font-black text-white font-mono">{summary.totalCompletions}</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Brain size={32} />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Journal Synthesis */}
                <div className="glass-card rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-cyan-500/5 blur-3xl rounded-full" />

                    <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                        <Zap size={20} className="text-cyan-400" />
                        <span>Recent Notes</span>
                    </h3>

                    <div className="space-y-6">
                        {summary.journals.length > 0 ? summary.journals.map((j, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 rounded-2xl bg-white/5 border border-white/5"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{j.habit}</span>
                                </div>
                                <p className="text-slate-300 text-sm italic">"{j.text}"</p>
                                {j.answers && (
                                    <div className="mt-3 grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                                        <div>
                                            <p className="text-[8px] text-lime-400 font-black uppercase tracking-widest mb-1">Win</p>
                                            <p className="text-[10px] text-slate-500">{j.answers.whatWentWell || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] text-purple-400 font-black uppercase tracking-widest mb-1">Challenge</p>
                                            <p className="text-[10px] text-slate-500">{j.answers.whatBlockedYou || 'N/A'}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )) : (
                            <p className="text-slate-600 font-mono text-xs text-center py-10">No notes recorded for this week.</p>
                        )}
                    </div>
                </div>

                {/* Manual Reflection Form Placeholder */}
                <div className="space-y-8">
                    <div className="glass-card rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden h-full">
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-500/5 blur-3xl rounded-full" />

                        <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Goal size={20} className="text-purple-400" />
                            <span>Weekly Review</span>
                        </h3>

                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block ml-1">Overall Mood</label>
                                <input className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-cyan-500/50" placeholder="e.g. Great, Tired, Motivated..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block ml-1">Success Score (1-10)</label>
                                <input type="number" className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block ml-1">Goals for Next Week</label>
                                <textarea className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 min-h-[100px]" placeholder="What do you want to achieve next week?" />
                            </div>
                            <button className="w-full bg-purple-500 hover:bg-purple-400 text-slate-950 font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all">
                                Save reflections
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

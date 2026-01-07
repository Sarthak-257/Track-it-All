'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Sparkles, AlertCircle } from 'lucide-react';
import API from '@/services/api';

interface JournalModalProps {
    isOpen: boolean;
    onClose: () => void;
    habitId: string;
    habitName: string;
    date: string;
    initialData?: any;
}

export default function JournalModal({ isOpen, onClose, habitId, habitName, date, initialData }: JournalModalProps) {
    const [formData, setFormData] = useState({
        journalText: initialData?.journalText || '',
        whatWentWell: initialData?.journalPromptAnswers?.whatWentWell || '',
        whatBlockedYou: initialData?.journalPromptAnswers?.whatBlockedYou || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post(`/habits/${habitId}/journal`, {
                date,
                ...formData,
            });
            onClose();
        } catch (error) {
            console.error('Error saving journal:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#030712]/90 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="relative w-full max-w-2xl glass-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between relative">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-1">
                                    Neural Log
                                </h2>
                                <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest">
                                    {habitName} | {date}
                                </p>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-white transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <Sparkles size={14} className="text-cyan-400" />
                                    <span>Cognitive Synthesis (Free Text)</span>
                                </label>
                                <textarea
                                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-6 text-white font-medium placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all min-h-[120px]"
                                    placeholder="Synthesize your operational experiences..."
                                    value={formData.journalText}
                                    onChange={(e) => setFormData({ ...formData, journalText: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="flex items-center space-x-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.6)]" />
                                        <span>Positive Vectors</span>
                                    </label>
                                    <textarea
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-lime-500/50 transition-all min-h-[100px]"
                                        placeholder="What achieved peak efficiency?"
                                        value={formData.whatWentWell}
                                        onChange={(e) => setFormData({ ...formData, whatWentWell: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center space-x-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(217,70,239,0.6)]" />
                                        <span>Optimization Blockers</span>
                                    </label>
                                    <textarea
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all min-h-[100px]"
                                        placeholder="What inhibited synchronization?"
                                        value={formData.whatBlockedYou}
                                        onChange={(e) => setFormData({ ...formData, whatBlockedYou: e.target.value })}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(34, 211, 238, 0.4)' }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save size={18} strokeWidth={3} />
                                        <span>Commit to Memory</span>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

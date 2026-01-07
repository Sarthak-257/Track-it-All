'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Terminal } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';

export default function AddHabitModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#22d3ee',
        frequency: 'daily',
        type: 'boolean' as 'boolean' | 'numeric' | 'percentage',
        targetValue: 1,
        unit: '',
    });

    const addHabit = useHabitStore((state) => state.addHabit);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addHabit(formData);
        setFormData({
            name: '',
            description: '',
            color: '#22d3ee',
            frequency: 'daily',
            type: 'boolean',
            targetValue: 1,
            unit: '',
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                        className="relative w-full max-w-lg glass-card rounded-[2rem] shadow-2xl overflow-hidden border border-white/10"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full" />

                        <div className="p-8 border-b border-white/5 flex items-center justify-between relative">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-widest uppercase flex items-center space-x-3">
                                    <Terminal size={24} className="text-cyan-400" />
                                    <span>Init Protocol</span>
                                </h2>
                                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">Configure New Neural Node</p>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 relative">
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] block ml-1">Habit Designation</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-6 text-white text-lg font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                                    placeholder="e.g. Cognitive Refinement"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] block ml-1">Objective Parameters</label>
                                <textarea
                                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-6 text-white font-medium placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all min-h-[100px]"
                                    placeholder="Define operational success criteria..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] block ml-1">Type</label>
                                    <select
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                    >
                                        <option value="boolean" className="bg-slate-900">Boolean</option>
                                        <option value="numeric" className="bg-slate-900">Numeric</option>
                                        <option value="percentage" className="bg-slate-900">Percentage</option>
                                    </select>
                                </div>

                                {formData.type !== 'boolean' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] block ml-1">Target</label>
                                            <input
                                                type="number"
                                                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                                value={formData.targetValue}
                                                onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] block ml-1">Unit</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. min, km, cups"
                                                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                                value={formData.unit}
                                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="space-y-4">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] block ml-1">Spectral ID</label>
                                <div className="flex flex-wrap gap-4">
                                    {['#22d3ee', '#10b981', '#a3e635', '#fbbf24', '#f87171', '#d946ef', '#6366f1'].map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-10 h-10 rounded-full transition-all relative ${formData.color === color ? 'scale-110 shadow-[0_0_15px_' + color + ']' : 'opacity-40 hover:opacity-100 hover:scale-110'}`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {formData.color === color && (
                                                <motion.div
                                                    layoutId="modal-color-marker"
                                                    className="absolute inset-0 rounded-full border-2 border-white scale-110"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)' }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full mt-8 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all uppercase tracking-widest text-sm"
                            >
                                <Plus size={20} strokeWidth={3} />
                                <span>Inject Node</span>
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}


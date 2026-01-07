'use client';

import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';

interface Badge {
    _id: string;
    name: string;
    description: string;
    icon: string;
    unlocked?: boolean;
}

export default function BadgeGallery({ badges, userBadges }: { badges: Badge[], userBadges: string[] }) {
    return (
        <div className="glass-card rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-8 flex items-center gap-3">
                <Award className="text-cyan-400" />
                <span>Neural Distinctions</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {badges.map((badge, idx) => {
                    const isUnlocked = userBadges.includes(badge._id);
                    return (
                        <motion.div
                            key={badge._id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative group flex flex-col items-center"
                        >
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden border ${isUnlocked
                                ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                                : 'bg-slate-900 border-white/5 grayscale'}`}
                            >
                                {isUnlocked ? (
                                    <motion.div
                                        className="text-cyan-400"
                                        animate={{ rotateY: [0, 360] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Award size={32} strokeWidth={2.5} />
                                    </motion.div>
                                ) : (
                                    <Lock size={24} className="text-slate-700" />
                                )}

                                {isUnlocked && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent pointer-events-none" />
                                )}
                            </div>

                            <div className="mt-3 text-center">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${isUnlocked ? 'text-white' : 'text-slate-600'}`}>
                                    {badge.name}
                                </p>
                                <p className="text-[8px] text-slate-500 mt-1 uppercase font-mono hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                                    {badge.description}
                                </p>
                            </div>

                            {!isUnlocked && (
                                <div className="absolute top-0 right-0 -mt-1 -mr-1">
                                    <div className="w-4 h-4 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                                        <Lock size={8} className="text-slate-500" />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

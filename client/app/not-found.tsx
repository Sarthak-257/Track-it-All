'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] px-4 text-center">
            <div className="neo-blur top-[-10%] left-[-5%] w-[50%] h-[50%] bg-red-500/5" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md"
            >
                <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20 mb-10 mx-auto shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                    <ShieldAlert className="text-red-500" size={48} />
                </div>

                <h1 className="text-6xl font-black text-white tracking-tighter mb-4">404</h1>
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6">
                    Neural Link <span className="text-red-500">Severed</span>
                </h2>

                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em] leading-relaxed mb-10">
                    The requested node does not exist in the current grid. Authentication timeout or invalid coordinate telemetry detected.
                </p>

                <Link href="/dashboard">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl flex items-center justify-center space-x-3 transition-all mx-auto group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Return to Core</span>
                    </motion.button>
                </Link>
            </motion.div>

            <div className="absolute top-10 left-10 flex items-center space-x-2 opacity-20">
                <Terminal size={14} className="text-red-500" />
                <span className="text-[8px] font-mono text-white tracking-widest uppercase">ERROR: 0xDEADBEEF</span>
            </div>
        </div>
    );
}

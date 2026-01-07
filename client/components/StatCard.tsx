'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon: LucideIcon;
    color: 'cyan' | 'purple' | 'lime';
}

const colorMap = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    lime: 'bg-lime-500/10 text-lime-400 border-lime-500/20',
};

const glowMap = {
    cyan: 'shadow-[0_0_15px_rgba(34,211,238,0.15)]',
    purple: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]',
    lime: 'shadow-[0_0_15px_rgba(163,230,53,0.15)]',
};

export default function StatCard({ label, value, subValue, icon: Icon, color }: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`glass-card p-6 rounded-2xl flex flex-col justify-between h-full relative overflow-hidden ${glowMap[color]}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorMap[color]} border`}>
                    <Icon size={24} />
                </div>
                {subValue && (
                    <span className="text-xs font-mono text-slate-500 tracking-wider">
                        {subValue}
                    </span>
                )}
            </div>

            <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                    {value || '---'}
                </h3>
            </div>

            {/* Decorative element */}
            <div className={`absolute -right-2 -bottom-2 w-24 h-24 blur-3xl opacity-10 rounded-full ${color === 'cyan' ? 'bg-cyan-500' : color === 'purple' ? 'bg-purple-500' : 'bg-lime-500'}`} />
        </motion.div>
    );
}

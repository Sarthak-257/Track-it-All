'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';

interface Habit {
    _id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
}

export default function HabitCard({ habit }: { habit: Habit }) {
    const [completed, setCompleted] = useState(false);
    const toggleHabit = useHabitStore((state) => state.toggleHabit);
    const deleteHabit = useHabitStore((state) => state.deleteHabit);

    const handleToggle = async () => {
        const today = new Date().toISOString().split('T')[0];
        await toggleHabit(habit._id, today);
        setCompleted(!completed);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-slate-700 transition-all shadow-lg"
        >
            <div className="flex items-center space-x-4">
                <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-inner"
                    style={{ backgroundColor: habit.color }}
                >
                    <span className="text-xl font-bold">{habit.name[0]}</span>
                </div>
                <div>
                    <h3 className="text-white font-semibold flex items-center">
                        {habit.name}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-1">{habit.description}</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={handleToggle}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${completed
                            ? 'bg-green-500/20 text-green-500 border-green-500/50'
                            : 'bg-slate-800 text-slate-500 hover:text-slate-300 border-slate-700'
                        } border-2`}
                >
                    <Check size={20} className={completed ? 'scale-110' : 'scale-100'} />
                </button>

                <button
                    onClick={() => deleteHabit(habit._id)}
                    className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </motion.div>
    );
}

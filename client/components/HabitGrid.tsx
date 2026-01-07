'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronLeft, ChevronRight, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';
import API from '@/services/api';
import JournalModal from './JournalModal';

export default function HabitGrid() {
    const { habits, toggleHabit } = useHabitStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedJournal, setSelectedJournal] = useState<{ habitId: string, habitName: string, date: string, data?: any } | null>(null);

    // Generate week days
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const startStr = format(days[0], 'yyyy-MM-dd');
            const endStr = format(days[6], 'yyyy-MM-dd');
            const { data } = await API.get(`/habits/logs?start=${startStr}&end=${endStr}`);
            setLogs(data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (habits.length > 0) {
            fetchLogs();
        }
    }, [currentDate, habits.length]);

    const getLog = (habitId: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return logs.find(log =>
            log.habit === habitId &&
            new Date(log.date).toISOString().split('T')[0] === dateStr
        );
    };

    const handleToggle = async (habitId: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        await toggleHabit(habitId, dateStr);
        fetchLogs(); // Refresh logs to get updated percentages
    };

    const handleProgressChange = async (habitId: string, date: Date, value: number) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        try {
            await API.post(`/habits/${habitId}/progress`, { date: dateStr, value });
            fetchLogs();
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleRepair = async (habitId: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        try {
            await API.post(`/habits/${habitId}/repair`, { date: dateStr });
            fetchLogs();
        } catch (error) {
            console.error('Error repairing streak:', error);
        }
    };

    return (
        <div className="glass-card rounded-[2.5rem] overflow-hidden mt-8 border border-white/10 shadow-2xl">
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-widest uppercase">Habit Tracker</h2>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.2em] mt-1">Status: Your Daily Progress</p>
                </div>
                <div className="flex items-center space-x-3 bg-[#030712]/50 rounded-2xl p-1.5 border border-white/5">
                    <button
                        onClick={() => setCurrentDate(addDays(currentDate, -7))}
                        className="p-3 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-xs font-black uppercase tracking-widest px-4 text-slate-300">
                        {format(days[0], 'MMM dd')} — {format(days[6], 'MMM dd')}
                    </span>
                    <button
                        onClick={() => setCurrentDate(addDays(currentDate, 7))}
                        className="p-3 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr>
                            <th className="p-6 px-8 text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] border-b border-white/5">Habit</th>
                            {days.map((day, i) => (
                                <th key={i} className="p-4 text-center border-b border-white/5">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] uppercase font-black text-slate-600 mb-1">{format(day, 'EEE')}</span>
                                        <span className={`text-sm font-mono font-bold ${isSameDay(day, new Date()) ? 'text-cyan-400 text-glow' : 'text-slate-400'}`}>
                                            {format(day, 'dd')}
                                        </span>
                                    </div>
                                </th>
                            ))}
                            <th className="p-6 text-center border-b border-white/5 text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Weekly</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habits.map((habit, idx) => {
                            const weeklyLogs = days.map(d => getLog(habit._id, d));
                            const completedCount = weeklyLogs.filter(l => l?.completed).length;
                            const totalWeeklyPercentage = weeklyLogs.reduce((acc, curr) => acc + (curr?.percentage || 0), 0) / 7;

                            return (
                                <motion.tr
                                    key={habit._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className="group hover:bg-white/[0.03] transition-all border-b border-white/5 last:border-0"
                                >
                                    <td className="p-6 px-8">
                                        <div className="flex flex-col">
                                            <div className="flex items-center space-x-3 mb-1">
                                                <div
                                                    className="w-2.5 h-2.5 rounded-full"
                                                    style={{ backgroundColor: habit.color, boxShadow: `0 0 12px ${habit.color}` }}
                                                />
                                                <span className="text-white font-black uppercase text-sm tracking-tight group-hover:text-cyan-400 transition-colors">
                                                    {habit.name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                                                ID: {habit._id.slice(-8)} | {habit.type}
                                            </span>
                                        </div>
                                    </td>
                                    {days.map((day, i) => {
                                        const log = weeklyLogs[i];
                                        const active = log?.completed;
                                        const dateStr = format(day, 'yyyy-MM-dd');

                                        return (
                                            <td key={i} className="p-4 py-6">
                                                <div className="flex flex-col items-center space-y-3">
                                                    {habit.type === 'boolean' ? (
                                                        <button
                                                            onClick={() => handleToggle(habit._id, day)}
                                                            className={`w-10 h-10 rounded-xl transition-all duration-500 flex items-center justify-center border-2 ${active
                                                                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                                                                : 'bg-slate-900/50 border-white/5 text-slate-700 hover:border-white/20 hover:text-slate-400'
                                                                }`}
                                                        >
                                                            {active ? <Check size={20} strokeWidth={4} /> : null}
                                                        </button>
                                                    ) : (
                                                        <div className="relative w-12 h-12 flex items-center justify-center group/progress">
                                                            <svg className="w-full h-full -rotate-90">
                                                                <circle
                                                                    cx="24" cy="24" r="20"
                                                                    className="stroke-white/5 fill-none"
                                                                    strokeWidth="3"
                                                                />
                                                                <motion.circle
                                                                    cx="24" cy="24" r="20"
                                                                    className="fill-none"
                                                                    style={{ stroke: habit.color }}
                                                                    strokeWidth="3"
                                                                    strokeDasharray="125.6"
                                                                    initial={{ strokeDashoffset: 125.6 }}
                                                                    animate={{ strokeDashoffset: 125.6 - (125.6 * (log?.percentage || 0)) / 100 }}
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                            <button
                                                                onClick={() => {
                                                                    const val = prompt(`Enter ${habit.unit || 'value'} for ${habit.name}:`, log?.value || 0);
                                                                    if (val !== null) handleProgressChange(habit._id, day, Number(val));
                                                                }}
                                                                className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-black text-white transition-all hover:scale-125"
                                                            >
                                                                {log?.percentage || 0}%
                                                            </button>
                                                        </div>
                                                    )}

                                                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button
                                                            onClick={() => setSelectedJournal({ habitId: habit._id, habitName: habit.name, date: dateStr, data: log })}
                                                            className={`p-1.5 rounded-lg transition-colors ${log?.journalText ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}
                                                            title="Journal Entry"
                                                        >
                                                            <MessageSquare size={14} />
                                                        </button>
                                                        {!active && !isSameDay(day, new Date()) && day < new Date() && (
                                                            <button
                                                                onClick={() => handleRepair(habit._id, day)}
                                                                className="p-1.5 rounded-lg text-slate-600 hover:text-purple-400 hover:bg-purple-400/10 transition-colors"
                                                                title="Repair Streak"
                                                            >
                                                                <ShieldCheck size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        );
                                    })}
                                    <td className="p-6">
                                        <div className="flex flex-col items-center">
                                            <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${totalWeeklyPercentage}%` }}
                                                    className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                                />
                                            </div>
                                            <span className="text-[10px] font-black font-mono text-cyan-400 mt-2 tracking-widest">
                                                {Math.round(totalWeeklyPercentage)}% DONE
                                            </span>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {selectedJournal && (
                <JournalModal
                    isOpen={!!selectedJournal}
                    onClose={() => { setSelectedJournal(null); fetchLogs(); }}
                    habitId={selectedJournal.habitId}
                    habitName={selectedJournal.habitName}
                    date={selectedJournal.date}
                    initialData={selectedJournal.data}
                />
            )}
        </div>
    );
}

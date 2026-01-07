'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';
import WeeklyReflectionSummary from '@/components/WeeklyReflectionSummary';
import { motion } from 'framer-motion';
import AuthGuard from '@/components/AuthGuard';

export default function ReflectionsPage() {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                // Get current week summary
                const { data } = await API.get(`/reflections/summary?date=${new Date().toISOString()}`);
                setSummary(data);
            } catch (error) {
                console.error('Error fetching weekly summary:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    return (
        <AuthGuard>
            <main className="relative">
                <div className="neo-blur top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/20" />

                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                        </div>
                    ) : summary ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <WeeklyReflectionSummary summary={summary} />
                        </motion.div>
                    ) : (
                        <div className="text-center py-20">
                            <h2 className="text-white font-black uppercase tracking-widest text-2xl">No Summary Found</h2>
                            <p className="text-slate-500 mt-2">No summary data available for this epoch.</p>
                        </div>
                    )}
                </div>
            </main>
        </AuthGuard>
    );
}

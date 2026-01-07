'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Terminal, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await API.post('/auth/register', formData);
            router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}&name=${encodeURIComponent(formData.name)}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed. Please check your internet connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="neo-blur top-[-10%] right-[-5%] w-[50%] h-[50%] bg-cyan-500/10" />
            <div className="neo-blur bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-purple-500/10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-card p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10"
            >
                <div className="mb-10">
                    <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 mb-6 mx-auto">
                        <UserPlus className="text-cyan-400" size={32} />
                    </div>
                    <h2 className="text-center text-3xl font-black text-white uppercase tracking-tighter">
                        Create Your <span className="text-cyan-400">Account</span>
                    </h2>
                    <p className="mt-2 text-center text-xs font-mono text-slate-500 uppercase tracking-widest">
                        Join our community of trackers
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="group">
                            <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ml-1">Your Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="block w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white/10 transition-all font-medium"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="block w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white/10 transition-all font-medium"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ml-1">Create Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="block w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white/10 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50 group"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Terminal size={18} strokeWidth={3} />
                                <span>Create Account</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>

                    <div className="text-center mt-6">
                        <Link href="/login" className="text-[10px] font-black text-slate-500 hover:text-cyan-400 uppercase tracking-widest transition-colors">
                            Already Authorized? <span className="text-white">Sign In</span>
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

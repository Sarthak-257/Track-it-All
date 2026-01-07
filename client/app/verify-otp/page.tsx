'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import API from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, RefreshCw, Smartphone, ArrowRight, ShieldAlert } from 'lucide-react';

export default function VerifyOTPPage() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(60);

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        if (!email) {
            router.push('/register');
        }
    }, [email, router]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== '') {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prev = (e.currentTarget.previousSibling as HTMLInputElement);
            if (prev) prev.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const { data } = await API.post('/auth/verify-otp', { email, otp: code });
            setUser(data);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setResending(true);
        try {
            await API.post('/auth/resend-otp', { email });
            setTimer(60);
            setError('');
        } catch (err: any) {
            setError('Failed to resend verification code.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4 relative overflow-hidden">
            <div className="neo-blur top-[-10%] left-[-5%] w-[50%] h-[50%] bg-cyan-500/10" />
            <div className="neo-blur bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-500/10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-card p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10"
            >
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 mb-6 mx-auto">
                        <ShieldCheck className="text-purple-400" size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Verify Your <span className="text-purple-400">Account</span>
                    </h2>
                    <p className="mt-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-relaxed">
                        We sent a 6-digit code to: <br />
                        <span className="text-white font-bold">{email}</span>
                    </p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-2">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                className="w-12 h-14 bg-white/5 border border-white/5 rounded-xl text-center text-xl font-black text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white/10 transition-all"
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-center space-x-2 text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-500/10 py-3 rounded-xl border border-red-500/20"
                            >
                                <ShieldAlert size={14} />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-500 hover:bg-purple-400 text-slate-950 font-black py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Smartphone size={18} strokeWidth={3} />
                                    <span>Verify Account</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </motion.button>

                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={timer > 0 || resending}
                            className={`w-full flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-widest transition-colors ${timer > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white'}`}
                        >
                            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                            <span>{timer > 0 ? `Resend in ${timer}s` : 'Resend verification code'}</span>
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                        Verification required to access your dashboard.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

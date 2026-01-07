'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, BarChart3, LogOut, User, ShieldAlert, Activity, Palette, Sword, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!user) return null;

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Challenges', href: '/challenges', icon: Sword },
        { name: 'Achievements', href: '/achievements', icon: Trophy },
        { name: 'Reflections', href: '/reflections', icon: Activity },
    ];

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl glass-card rounded-2xl z-50 px-6 py-3 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all">
                        <Activity className="text-slate-950" size={24} />
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-white font-black text-xl tracking-tighter block leading-none">TRACK</span>
                        <span className="text-cyan-400 font-mono text-[10px] tracking-[0.2em] block uppercase leading-none mt-1">IT ALL</span>
                    </div>
                </Link>

                <div className="flex items-center space-x-2 md:space-x-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-2 transition-all group relative py-2 ${active ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Icon size={18} />
                                <span className="text-xs font-black uppercase tracking-widest hidden md:block">{item.name}</span>
                                {active && (
                                    <motion.div
                                        layoutId="nav-glow"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 blur-[2px]"
                                    />
                                )}
                            </Link>
                        );
                    })}

                    {user.role === 'admin' && (
                        <Link href="/admin" className="text-slate-400 hover:text-purple-400 transition flex items-center space-x-2 group">
                            <ShieldAlert size={18} />
                            <span className="text-xs font-black uppercase tracking-widest hidden md:block">Admin</span>
                        </Link>
                    )}

                    <div className="h-4 w-px bg-white/10" />

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 text-slate-300">
                            <div className="w-9 h-9 rounded-xl bg-slate-800/50 border border-white/5 flex items-center justify-center text-cyan-400">
                                <User size={18} />
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">User</p>
                                <p className="text-xs font-bold text-white leading-none mt-1">{user.name}</p>
                            </div>
                        </div>
                        <ThemeSwitcher />
                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all border border-red-500/10"
                            title="De-authorize Sync"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}


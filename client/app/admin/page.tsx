'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import API from '@/services/api';
import AuthGuard from '@/components/AuthGuard';
import { Users, Trash2, ShieldAlert, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        const fetchUsers = async () => {
            try {
                const { data } = await API.get('/admin/users');
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchUsers();
    }, [user, router]);

    const handleDeleteUser = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await API.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                alert('Failed to delete user');
            }
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <AuthGuard>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center space-x-3">
                        <ShieldAlert className="text-red-500" />
                        <span>Admin Console</span>
                    </h1>
                    <p className="text-slate-400 mt-1">Manage users and global platform settings.</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                        <div className="flex items-center space-x-2">
                            <Users className="text-indigo-400" size={20} />
                            <h2 className="text-xl font-bold text-white">Platform Users</h2>
                        </div>
                        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold">
                            {users.length} Total
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Name</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Joined</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-800/30 transition">
                                        <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                                        <td className="px-6 py-4 text-slate-400">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    className="p-2 text-slate-500 hover:text-red-400 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                            {u.role === 'admin' && (
                                                <CheckCircle size={18} className="text-indigo-500 inline-block mr-2" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}

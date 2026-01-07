'use client';

import { create } from 'zustand';
import API from '@/services/api';

interface Participant {
    user: string;
    progress: number;
    status: 'active' | 'completed' | 'failed';
}

interface Challenge {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    goal: number;
    habits: string[];
    participants: Participant[];
    createdBy: string;
}

interface ChallengeState {
    challenges: Challenge[];
    loading: boolean;
    fetchChallenges: () => Promise<void>;
    joinChallenge: (id: string) => Promise<void>;
    createChallenge: (challenge: Partial<Challenge>) => Promise<void>;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
    challenges: [],
    loading: false,
    fetchChallenges: async () => {
        set({ loading: true });
        try {
            const { data } = await API.get('/challenges');
            set({ challenges: data });
        } catch (error) {
            console.error('Error fetching challenges:', error);
        } finally {
            set({ loading: false });
        }
    },
    joinChallenge: async (id) => {
        try {
            await API.post(`/challenges/${id}/join`);
            // Refresh challenges to show joining status
            const { data } = await API.get('/challenges');
            set({ challenges: data });
        } catch (error) {
            console.error('Error joining challenge:', error);
            throw error;
        }
    },
    createChallenge: async (challenge) => {
        try {
            const { data } = await API.post('/challenges', challenge);
            set({ challenges: [...get().challenges, data] });
        } catch (error) {
            console.error('Error creating challenge:', error);
            throw error;
        }
    },
}));

import { create } from 'zustand';
import API from '@/services/api';

interface Habit {
    _id: string;
    name: string;
    description: string;
    frequency: string;
    frequencyValue: number[];
    color: string;
    icon: string;
    tags: string[];
    isActive: boolean;
    type: 'boolean' | 'numeric' | 'percentage';
    targetValue?: number;
    unit?: string;
}

interface HabitState {
    habits: Habit[];
    loading: boolean;
    fetchHabits: () => Promise<void>;
    addHabit: (habit: Partial<Habit>) => Promise<void>;
    toggleHabit: (id: string, date: string) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
    habits: [],
    loading: false,
    fetchHabits: async () => {
        set({ loading: true });
        try {
            const { data } = await API.get('/habits');
            set({ habits: data });
        } catch (error) {
            console.error('Error fetching habits:', error);
        } finally {
            set({ loading: false });
        }
    },
    addHabit: async (habit) => {
        try {
            const { data } = await API.post('/habits', habit);
            set({ habits: [...get().habits, data] });
        } catch (error) {
            console.error('Error adding habit:', error);
        }
    },
    toggleHabit: async (id, date) => {
        try {
            await API.post(`/habits/${id}/toggle`, { date });
            // We don't necessarily need to update the entire habit list here
            // but we might want to refresh logs or just let the UI handle it
        } catch (error) {
            console.error('Error toggling habit:', error);
        }
    },
    deleteHabit: async (id) => {
        try {
            await API.delete(`/habits/${id}`);
            set({ habits: get().habits.filter((h) => h._id !== id) });
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    },
}));

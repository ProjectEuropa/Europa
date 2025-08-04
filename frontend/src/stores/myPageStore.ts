import { create } from 'zustand';
import type { MyPageState, MyPageTab } from '@/types/user';

interface MyPageStore extends MyPageState {
  // Actions
  setActiveTab: (tab: MyPageTab) => void;
  setLoading: (key: keyof MyPageState['loading'], value: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: MyPageState = {
  activeTab: 'profile',
  profile: null,
  files: [],
  events: [],
  loading: {
    profile: false,
    teams: false,
    matches: false,
    events: false,
  },
  error: null,
};

export const useMyPageStore = create<MyPageStore>(set => ({
  ...initialState,

  setActiveTab: tab => set(state => ({ ...state, activeTab: tab })),

  setLoading: (key, value) =>
    set(state => ({
      ...state,
      loading: { ...state.loading, [key]: value },
    })),

  setError: error => set(state => ({ ...state, error })),

  reset: () => set(initialState),
}));

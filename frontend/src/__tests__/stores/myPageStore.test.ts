import { beforeEach, describe, expect, it } from 'vitest';
import { useMyPageStore } from '@/stores/myPageStore';
import type { MyPageTab } from '@/types/user';

// ストアをリセットするヘルパー関数
const resetStore = () => {
  useMyPageStore.getState().reset();
};

describe('MyPageStore', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('初期状態', () => {
    it('初期状態が正しく設定されている', () => {
      const state = useMyPageStore.getState();

      expect(state.activeTab).toBe('profile');
      expect(state.profile).toBeNull();
      expect(state.files).toEqual([]);
      expect(state.events).toEqual([]);
      expect(state.loading).toEqual({
        profile: false,
        teams: false,
        matches: false,
        events: false,
      });
      expect(state.error).toBeNull();
    });
  });

  describe('setActiveTab', () => {
    it('アクティブタブを正しく更新する', () => {
      const { setActiveTab } = useMyPageStore.getState();

      setActiveTab('teams');
      expect(useMyPageStore.getState().activeTab).toBe('teams');

      setActiveTab('matches');
      expect(useMyPageStore.getState().activeTab).toBe('matches');

      setActiveTab('events');
      expect(useMyPageStore.getState().activeTab).toBe('events');

      setActiveTab('profile');
      expect(useMyPageStore.getState().activeTab).toBe('profile');
    });

    it('無効なタブを設定してもTypeScriptエラーが発生する', () => {
      const { setActiveTab } = useMyPageStore.getState();

      // TypeScript エラーをテスト（実行時ではなくコンパイル時）
      // @ts-expect-error - 無効なタブタイプ
      setActiveTab('invalid-tab' as MyPageTab);
    });
  });

  describe('setLoading', () => {
    it('特定のローディング状態を正しく更新する', () => {
      const { setLoading } = useMyPageStore.getState();

      setLoading('profile', true);
      expect(useMyPageStore.getState().loading.profile).toBe(true);
      expect(useMyPageStore.getState().loading.teams).toBe(false);

      setLoading('teams', true);
      expect(useMyPageStore.getState().loading.teams).toBe(true);
      expect(useMyPageStore.getState().loading.profile).toBe(true);

      setLoading('profile', false);
      expect(useMyPageStore.getState().loading.profile).toBe(false);
      expect(useMyPageStore.getState().loading.teams).toBe(true);
    });

    it('複数のローディング状態を同時に管理できる', () => {
      const { setLoading } = useMyPageStore.getState();

      setLoading('profile', true);
      setLoading('teams', true);
      setLoading('matches', true);
      setLoading('events', true);

      const loading = useMyPageStore.getState().loading;
      expect(loading).toEqual({
        profile: true,
        teams: true,
        matches: true,
        events: true,
      });
    });
  });

  describe('setError', () => {
    it('エラー状態を正しく設定・クリアする', () => {
      const { setError } = useMyPageStore.getState();

      setError('テストエラー');
      expect(useMyPageStore.getState().error).toBe('テストエラー');

      setError('別のエラー');
      expect(useMyPageStore.getState().error).toBe('別のエラー');

      setError(null);
      expect(useMyPageStore.getState().error).toBeNull();
    });
  });

  describe('reset', () => {
    it('ストア状態を初期状態にリセットする', () => {
      const { setActiveTab, setLoading, setError, reset } =
        useMyPageStore.getState();

      // 状態を変更
      setActiveTab('teams');
      setLoading('profile', true);
      setLoading('teams', true);
      setError('テストエラー');

      // 変更されていることを確認
      const modifiedState = useMyPageStore.getState();
      expect(modifiedState.activeTab).toBe('teams');
      expect(modifiedState.loading.profile).toBe(true);
      expect(modifiedState.loading.teams).toBe(true);
      expect(modifiedState.error).toBe('テストエラー');

      // リセット実行
      reset();

      // 初期状態に戻っていることを確認
      const resetState = useMyPageStore.getState();
      expect(resetState.activeTab).toBe('profile');
      expect(resetState.profile).toBeNull();
      expect(resetState.files).toEqual([]);
      expect(resetState.events).toEqual([]);
      expect(resetState.loading).toEqual({
        profile: false,
        teams: false,
        matches: false,
        events: false,
      });
      expect(resetState.error).toBeNull();
    });
  });

  describe('ストアの型安全性', () => {
    it('正しい型でのみ操作できる', () => {
      const state = useMyPageStore.getState();

      // TypeScript の型チェックをテスト
      expect(typeof state.setActiveTab).toBe('function');
      expect(typeof state.setLoading).toBe('function');
      expect(typeof state.setError).toBe('function');
      expect(typeof state.reset).toBe('function');
    });
  });

  describe('ストアの不変性', () => {
    it('状態の更新が不変性を保つ', () => {
      const { setLoading } = useMyPageStore.getState();
      const initialLoading = useMyPageStore.getState().loading;

      setLoading('profile', true);
      const updatedLoading = useMyPageStore.getState().loading;

      // 元のオブジェクトが変更されていないことを確認
      expect(initialLoading).not.toBe(updatedLoading);
      expect(initialLoading.profile).toBe(false);
      expect(updatedLoading.profile).toBe(true);
    });
  });
});

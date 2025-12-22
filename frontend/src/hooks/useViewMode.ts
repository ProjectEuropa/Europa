import { useState, useEffect } from 'react';

const TABLET_BREAKPOINT = 1024;

export type ViewMode = 'table' | 'card';

interface UseViewModeOptions {
    storageKey?: string;
    initialMode?: ViewMode;
}

/**
 * ビューモード（テーブル/カード表示）を管理するカスタムフック
 * - 画面サイズを監視し、タブレット以下では強制的にカード表示にする
 * - ユーザーの選択を localStorage に保存する
 */
export const useViewMode = (options: UseViewModeOptions = {}) => {
    const {
        storageKey = 'viewMode',
        initialMode = 'table'
    } = options;

    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
    const [userPreference, setUserPreference] = useState<ViewMode | null>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(storageKey);
            return (saved === 'card' || saved === 'table') ? (saved as ViewMode) : null;
        }
        return null;
    });

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobileOrTablet(window.innerWidth < TABLET_BREAKPOINT);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // 実際のビューモード（モバイル/タブレットでは強制カード、それ以外はユーザー設定優先）
    const viewMode: ViewMode = isMobileOrTablet ? 'card' : (userPreference ?? initialMode);

    // ビューモード手動変更
    const setViewMode = (mode: ViewMode) => {
        setUserPreference(mode);
        localStorage.setItem(storageKey, mode);
    };

    return { viewMode, setViewMode, isMobileOrTablet };
};

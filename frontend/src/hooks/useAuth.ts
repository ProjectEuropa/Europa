import { useState, useEffect } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  // 必要に応じて他のプロパティも追加
}

// XSS対策のためdangerouslySetInnerHTML禁止、CSP導入も推奨
// トークンはsessionStorageで管理し、画面リロードで消える設計
// ログイン・新規登録成功時は: sessionStorage.setItem('token', data.token);
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Bearerトークン認証: sessionStorageから取得
        const token = sessionStorage.getItem('token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          try {
            const data = await res.json();
            setUser(data);
          } catch (jsonErr) {
            console.error('ユーザー情報のJSONパースエラー', jsonErr);
            setUser(null);
          }
        } else {
          setUser(null);
          try {
            const errorData = await res.json();
            console.error('ユーザー情報取得失敗', errorData);
          } catch (jsonErr) {
            console.error('エラーレスポンスのJSONパースエラー', jsonErr);
          }
        }
      } catch (e) {
        console.error('ユーザー情報取得時の通信エラー', e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading, setUser };
}

import { useState, useEffect } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

// XSS対策のためdangerouslySetInnerHTML禁止、CSP導入も推奨
// ログイン・新規登録成功時は: localStorage.setItem('token', data.token);
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
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
          let errorText = await res.text();
          try {
            const errorData = JSON.parse(errorText);
            console.error('ユーザー情報取得失敗', errorData);
          } catch {
            console.error('ユーザー情報取得失敗: レスポンス内容:', errorText);
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

'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Calendar from '@/components/Calendar';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { registerEvent } from '@/utils/api';

// イベント種別の定義
type EventType = '大会' | '告知' | 'その他';

// イベント情報の型定義
interface EventData {
  name: string;
  details: string;
  url: string;
  deadline: string;
  endDisplayDate: string;
  type: EventType;
}

// 日付をYYYY/MM/DD形式に変換する関数
const formatDateToJST = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

const EventPage: React.FC = () => {
  // すべてのHooksを最上部で宣言
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<EventData>({
    name: '',
    details: '',
    url: '',
    deadline: '',
    endDisplayDate: '',
    type: '大会',
  });
  const [showDeadlineCalendar, setShowDeadlineCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // 未認証時は描画しない

  // 入力フィールド変更ハンドラー
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 締切日選択ハンドラー
  const handleDeadlineSelect = (date: Date) => {
    setFormData(prev => ({
      ...prev,
      deadline: formatDateToJST(date),
    }));
    setShowDeadlineCalendar(false);
  };

  // 表示最終日選択ハンドラー
  const handleEndDateSelect = (date: Date) => {
    setFormData(prev => ({
      ...prev,
      endDisplayDate: formatDateToJST(date),
    }));
    setShowEndDateCalendar(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // バリデーション
    if (
      !formData.name ||
      !formData.details ||
      !formData.deadline ||
      !formData.endDisplayDate
    ) {
      toast.error('必須項目を入力してください');
      return;
    }
    setIsSubmitting(true);
    try {
      await registerEvent(formData);
      toast.success('イベント情報が登録されました');
      setFormData({
        name: '',
        details: '',
        url: '',
        deadline: '',
        endDisplayDate: '',
        type: '大会',
      });
    } catch (err) {
      toast.error('登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'rgb(var(--background-rgb))',
      }}
    >
      <Header />

      <main
        style={{
          flex: '1',
          padding: '20px',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              color: '#00c8ff',
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            イベント登録
          </h1>
          <p
            style={{
              color: '#b0c4d8',
              fontSize: '1rem',
              marginBottom: '24px',
            }}
          >
            新しいイベント情報を登録することができます
          </p>

          {/* イベント登録フォーム */}
          <form onSubmit={handleSubmit}>
            <div
              style={{
                background: '#0A1022',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #1E3A5F',
                marginBottom: '24px',
              }}
            >
              {/* イベント名 */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#00c8ff',
                    fontSize: '1rem',
                    marginBottom: '8px',
                  }}
                >
                  イベント名 <span style={{ color: '#ff4d4d' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="イベント名を入力してください"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0F1A2E',
                    border: '1px solid #1E3A5F',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                  required
                />
              </div>

              {/* イベント詳細情報 */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#00c8ff',
                    fontSize: '1rem',
                    marginBottom: '8px',
                  }}
                >
                  イベント詳細情報 <span style={{ color: '#ff4d4d' }}>*</span>
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  placeholder="イベントの詳細情報を入力してください"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0F1A2E',
                    border: '1px solid #1E3A5F',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1rem',
                    minHeight: '150px',
                    resize: 'vertical',
                  }}
                  required
                />
              </div>

              {/* イベント詳細URL */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#00c8ff',
                    fontSize: '1rem',
                    marginBottom: '8px',
                  }}
                >
                  イベント詳細URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0F1A2E',
                    border: '1px solid #1E3A5F',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
              </div>

              {/* イベント受付締切日 */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#00c8ff',
                    fontSize: '1rem',
                    marginBottom: '8px',
                  }}
                >
                  イベント受付締切日 <span style={{ color: '#ff4d4d' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      placeholder="YYYY/MM/DD"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0F1A2E',
                        border: '1px solid #1E3A5F',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '1rem',
                      }}
                      required
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowDeadlineCalendar(!showDeadlineCalendar)
                      }
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#00c8ff',
                        marginLeft: '-40px',
                        cursor: 'pointer',
                        zIndex: 1,
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </button>
                  </div>

                  {showDeadlineCalendar && (
                    <div
                      style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1000,
                        background: '#0A1022',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                        border: '1px solid #1E3A5F',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '16px',
                        }}
                      >
                        <h3 style={{ color: '#00c8ff', margin: 0 }}>
                          日付を選択
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowDeadlineCalendar(false)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#00c8ff',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30px',
                            height: '30px',
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <Calendar onSelect={handleDeadlineSelect} size="small" />
                    </div>
                  )}
                </div>
              </div>

              {/* イベント表示最終日 */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#00c8ff',
                    fontSize: '1rem',
                    marginBottom: '8px',
                  }}
                >
                  イベント表示最終日 <span style={{ color: '#ff4d4d' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      name="endDisplayDate"
                      value={formData.endDisplayDate}
                      onChange={handleInputChange}
                      placeholder="YYYY/MM/DD"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0F1A2E',
                        border: '1px solid #1E3A5F',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '1rem',
                      }}
                      required
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowEndDateCalendar(!showEndDateCalendar)
                      }
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#00c8ff',
                        marginLeft: '-40px',
                        cursor: 'pointer',
                        zIndex: 1,
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </button>
                  </div>

                  {showEndDateCalendar && (
                    <div
                      style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1000,
                        background: '#0A1022',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                        border: '1px solid #1E3A5F',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '16px',
                        }}
                      >
                        <h3 style={{ color: '#00c8ff', margin: 0 }}>
                          日付を選択
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowEndDateCalendar(false)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#00c8ff',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30px',
                            height: '30px',
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <Calendar onSelect={handleEndDateSelect} size="small" />
                    </div>
                  )}
                </div>
              </div>

              {/* イベント種別 */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#00c8ff',
                    fontSize: '1rem',
                    marginBottom: '8px',
                  }}
                >
                  イベント種別 <span style={{ color: '#ff4d4d' }}>*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0F1A2E',
                    border: '1px solid #1E3A5F',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1rem',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300c8ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px',
                  }}
                  required
                >
                  <option value="大会">大会</option>
                  <option value="告知">告知</option>
                  <option value="その他">その他</option>
                </select>
              </div>
            </div>

            {/* 送信ボタン */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '24px',
              }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '16px 40px',
                  background: '#00c8ff',
                  color: '#020824',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      style={{
                        width: '20px',
                        height: '20px',
                        animation: 'spin 1s linear infinite',
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                    送信中...
                  </>
                ) : (
                  <>
                    <svg
                      style={{
                        width: '20px',
                        height: '20px',
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 2L11 13"></path>
                      <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                    </svg>
                    イベントを登録する
                  </>
                )}
              </button>
            </div>
          </form>

          {/* 注意事項 */}
          <div
            style={{
              background: '#0A1022',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #1E3A5F',
            }}
          >
            <h2
              style={{
                color: '#00c8ff',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg
                style={{
                  width: '20px',
                  height: '20px',
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              イベント登録に関する注意事項
            </h2>
            <ul
              style={{
                color: '#b0c4d8',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                paddingLeft: '20px',
              }}
            >
              <li>登録されたイベントは管理者の承認後に公開されます。</li>
              <li>イベント表示最終日を過ぎると自動的に表示が終了します。</li>
              <li>イベント詳細URLは正確に入力してください。</li>
              <li>
                登録内容に問題がある場合は、管理者から連絡することがあります。
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EventPage;

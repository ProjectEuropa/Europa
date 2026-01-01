'use client';
import { Lock } from 'lucide-react';
import * as React from 'react';
import { Z_INDEX } from '@/lib/utils';

export function DeleteModal({
  open,
  onOpenChange,
  onDelete,
  fileName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onDelete: (password: string) => void;
  fileName: string;
}) {
  const [password, setPassword] = React.useState('');

  const handleDelete = () => {
    onDelete(password);
    setPassword('');
    onOpenChange(false);
  };

  return open ? (
    <dialog
      open
      className="cyber-dialog m-auto rounded-2xl border-2 border-cyan-400 text-white w-full dialog-animation"
      style={{
        maxWidth: '560px',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: Z_INDEX.modal,
        background: 'linear-gradient(135deg, #0a1022 0%, #0a0818 100%)',
        boxShadow: '0 0 32px 8px rgba(0, 200, 255, 0.3), 0 0 0 2px #00c8ff',
        backdropFilter: 'blur(4px)',
        backgroundImage:
          'radial-gradient(circle at 20% 30%, rgba(29, 78, 216, 0.15) 0%, transparent 80%), radial-gradient(circle at 80% 70%, rgba(0, 200, 255, 0.1) 0%, transparent 80%)',
      }}
    >
      <form
        onSubmit={e => {
          e.preventDefault();
          handleDelete();
        }}
        style={{
          padding: '36px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        <h2
          style={{
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '16px',
            textShadow: '0 0 8px #00c8ff',
            lineHeight: 1.4,
          }}
        >
          {fileName}を本当に削除しますか？
        </h2>
        <p
          style={{
            color: '#ffffff',
            fontSize: '18px',
            lineHeight: 1.7,
            marginBottom: '8px',
          }}
        >
          削除する場合は、削除パスワードを入力してください。
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '8px',
            marginBottom: '8px',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            <Lock className="w-6 h-6" color="#00c8ff" />
            削除パスワード
          </label>
          <input
            type="password"
            placeholder="削除パスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
            maxLength={100}
            autoComplete="off"
            style={{
              width: '100%',
              padding: '18px 20px',
              borderRadius: '12px',
              border: '1.5px solid #00c8ff',
              background: '#0a1022',
              color: '#fff',
              fontSize: '17px',
              marginTop: '4px',
              marginBottom: '8px',
              boxShadow: '0 0 8px rgba(0, 200, 255, 0.2)',
            }}
          />
          <div
            style={{
              textAlign: 'right',
              color: '#aaa',
              fontSize: '14px',
              marginTop: '4px',
            }}
          >
            {password.length} / 100
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '32px',
            padding: '0',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <button
              type="button"
              style={{
                background: 'transparent',
                color: '#b0c4d8',
                fontWeight: 600,
                padding: '14px 24px',
                border: '1px solid #485870',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '130px',
                fontSize: '16px',
              }}
              onClick={() => {
                setPassword('');
                onOpenChange(false);
              }}
            >
              キャンセル
            </button>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button
              type="submit"
              style={{
                background: '#00c8ff',
                color: '#0a0818',
                fontWeight: 600,
                padding: '14px 24px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '130px',
                fontSize: '16px',
              }}
            >
              削除実行
            </button>
          </div>
        </div>
      </form>
    </dialog>
  ) : null;
}

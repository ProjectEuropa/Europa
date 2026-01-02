'use client';
import { Lock } from 'lucide-react';
import * as React from 'react';

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

  // ESCキーでモーダルを閉じる
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setPassword('');
      onOpenChange(false);
    }
  };

  return open ? (
    <dialog
      open
      role="dialog"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
      aria-modal="true"
      className="cyber-dialog m-auto rounded-2xl border-2 border-cyan-400 text-white w-full max-w-[560px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm dialog-animation z-[1000] bg-gradient-to-br from-[#0a1022] to-[#0a0818] shadow-[0_0_32px_8px_rgba(0,200,255,0.3),0_0_0_2px_#00c8ff]"
      onKeyDown={handleKeyDown}
    >
      <form
        onSubmit={e => {
          e.preventDefault();
          handleDelete();
        }}
        className="py-9 px-10 flex flex-col gap-7"
      >
        <h2
          id="delete-modal-title"
          className="text-white text-[28px] font-bold mb-4 leading-[1.4] [text-shadow:0_0_8px_#00c8ff]"
        >
          {fileName}を本当に削除しますか？
        </h2>
        <p
          id="delete-modal-description"
          className="text-white text-lg leading-[1.7] mb-2"
        >
          削除する場合は、削除パスワードを入力してください。
        </p>
        <div className="flex flex-col gap-4 mt-2 mb-2">
          <label className="flex items-center gap-3 text-white text-lg font-semibold mb-2">
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
            className="w-full py-[18px] px-5 rounded-xl border-[1.5px] border-[#00c8ff] bg-[#0a1022] text-white text-[17px] mt-1 mb-2 shadow-[0_0_8px_rgba(0,200,255,0.2)]"
          />
          <div className="text-right text-[#aaa] text-sm mt-1">
            {password.length} / 100
          </div>
        </div>
        <div className="flex justify-between w-full mt-8 p-0">
          <div className="text-left">
            <button
              type="button"
              className="bg-transparent text-[#b0c4d8] font-semibold py-3.5 px-6 border border-[#485870] rounded-lg cursor-pointer transition-all duration-200 min-w-[130px] text-base"
              onClick={() => {
                setPassword('');
                onOpenChange(false);
              }}
            >
              キャンセル
            </button>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="bg-[#00c8ff] text-[#0a0818] font-semibold py-3.5 px-6 border-none rounded-lg cursor-pointer transition-all duration-200 min-w-[130px] text-base"
            >
              削除実行
            </button>
          </div>
        </div>
      </form>
    </dialog>
  ) : null;
}

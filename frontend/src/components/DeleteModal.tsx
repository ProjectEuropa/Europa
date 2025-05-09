"use client";
import * as React from "react";
import { Lock } from "lucide-react";

export function DeleteModal({ open, onOpenChange, onDelete, fileName }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onDelete: (password: string) => void;
  fileName: string;
}) {
  const [password, setPassword] = React.useState("");

  const handleDelete = () => {
    onDelete(password);
    setPassword("");
    onOpenChange(false);
  };

  return open ? (
    <dialog
      open
      className="cyber-dialog m-auto rounded-2xl border-2 border-cyan-400 text-white p-8 w-full dialog-animation"
      style={{
        maxWidth: '500px',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        background: 'linear-gradient(135deg, #0a1022 0%, #0a0818 100%)',
        boxShadow: '0 0 32px 8px rgba(0, 200, 255, 0.3), 0 0 0 2px #00c8ff',
        backdropFilter: 'blur(4px)',
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(29, 78, 216, 0.15) 0%, transparent 80%), radial-gradient(circle at 80% 70%, rgba(0, 200, 255, 0.1) 0%, transparent 80%)'
      }}
    >
        <form
          onSubmit={e => {
            e.preventDefault();
            handleDelete();
          }}
        >
          <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: "bold", marginBottom: "12px", textShadow: "0 0 8px #00c8ff" }}>
            {fileName}を本当に削除しますか？
          </h2>
          <p style={{ color: "#ffffff", marginBottom: "16px", fontSize: "16px" }}>
            削除する場合は、削除パスワードを入力してください。
          </p>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ffffff", fontSize: "16px", fontWeight: "600", marginBottom: "8px", marginTop: "16px" }}>
            <Lock className="w-5 h-5" color="#00c8ff" />
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
              width: "100%",
              padding: "12px 16px",
              backgroundColor: "rgba(10, 10, 32, 0.7)",
              border: "1px solid #00c8ff",
              borderRadius: "4px",
              color: "white",
              fontSize: "16px",
              marginBottom: "4px",
              outline: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 0 8px rgba(0, 200, 255, 0.2)"
            }}
          />
          <div style={{ textAlign: "right", color: "#ffffff", fontSize: "12px", marginBottom: "8px" }}>{password.length} / 100</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
            <button
              type="button"
              style={{
                background: "transparent",
                color: "#b0c4d8",
                fontWeight: 600,
                padding: "12px 20px",
                border: "1px solid #485870",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onClick={() => {
                setPassword("");
                onOpenChange(false);
              }}
            >
              キャンセル
            </button>
            <button 
              type="submit"
              style={{
                background: "#00c8ff",
                color: "#0a0818",
                fontWeight: 600,
                padding: "12px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              削除実行
            </button>
          </div>
        </form>
      </dialog>
  ) : null;
}

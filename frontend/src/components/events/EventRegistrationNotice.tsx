export default function EventRegistrationNotice() {
  return (
    <div className="bg-[#0A1022] rounded-xl p-5 border border-[#1E3A5F]">
      <h2 className="text-[#00c8ff] text-[1.2rem] font-bold mb-3 flex items-center gap-2">
        <svg
          className="w-5 h-5"
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
      <ul className="text-[#b0c4d8] text-[0.9rem] leading-[1.6] pl-5">
        <li>登録されたイベントは管理者の承認後に公開されます。</li>
        <li>イベント表示最終日を過ぎると自動的に表示が終了します。</li>
        <li>イベント詳細URLは正確に入力してください。</li>
        <li>登録内容に問題がある場合は、管理者から連絡することがあります。</li>
      </ul>
    </div>
  );
}

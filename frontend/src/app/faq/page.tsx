'use client';

import StaticPageLayout from '@/components/layout/StaticPageLayout';
import { FAQItem } from '@/components/layout/StaticPageContent';

export default function FAQPage() {
  return (
    <StaticPageLayout
      titleEn="FAQ"
      titleJa="よくある質問"
      description="よくいただくご質問とその回答"
    >
      <div className="space-y-6">
        <FAQItem question="Project Europaとは何ですか？">
          Project Europaは、カルネージハート
          EXAのプレイヤーコミュニティをサポートするための非公式プラットフォームです。
          チームデータの共有、検索、分析などの機能を提供し、プレイヤー同士の交流を促進しています。
        </FAQItem>

        <FAQItem question="アカウント登録は必要ですか？">
          一部の機能（イベント告知機能やマイページなど）を利用するにはアカウント登録が必要です。
          ただし、検索機能やダウンロード機能など、基本的な機能はアカウント登録なしでも利用できます。
        </FAQItem>

        <FAQItem question="チームデータをアップロードするにはどうすればいいですか？">
          「アップロード」ページからチームデータをアップロードできます。
          対応しているファイル形式は、カルネージハート
          EXAの標準フォーマット（.CHE）です。
        </FAQItem>

        <FAQItem question="アップロードしたデータは誰でも見ることができますか？">
          はい、アップロードされたチームデータは基本的に公開され、他のユーザーが検索・閲覧できるようになります。
          ただし、一部の詳細情報はアップロードしたユーザーのみが閲覧できる場合があります。
        </FAQItem>

        <FAQItem question="データの検索方法を教えてください">
          「検索」ページから、チーム名、プレイヤー名の特性などで検索できます。
          詳細検索オプションを使用すると、より細かい条件で絞り込むことも可能です。
          検索結果は一覧表示され、各項目をクリックすると詳細情報を確認できます。
        </FAQItem>

        <FAQItem question="パスワードを忘れてしまいました">
          ログインページの「パスワードをお忘れですか？」リンクから、パスワードリセット手続きを行えます。
          登録したメールアドレスにリセット用のリンクが送信されますので、そちらから新しいパスワードを設定してください。
        </FAQItem>

        <FAQItem question="アカウントを削除するにはどうすればいいですか？">
          マイページの「アカウント設定」から、アカウント削除の手続きを行えます。
          アカウントを削除すると、アップロードしたデータも削除されますのでご注意ください。
          削除前にデータのバックアップをお勧めします。
        </FAQItem>

        <FAQItem question="サイトの利用は無料ですか？">
          はい、Project Europaの全ての機能は無料でご利用いただけます。
        </FAQItem>

        <FAQItem question="不具合や機能リクエストはどこに報告すればいいですか？">
          お問い合わせフォームから、不具合の報告や機能リクエストを送信できます。
          できるだけ詳細な情報（発生状況、ブラウザの種類など）を添えていただけると、
          対応がスムーズになります。
        </FAQItem>

        <FAQItem question="開発に参加することはできますか？">
          はい、Project Europaは常に開発協力者を募集しています。
          プログラミング、デザイン、翻訳、ドキュメント作成など、様々な形で貢献いただけます。
          興味がある方は、お問い合わせフォームからご連絡ください。
        </FAQItem>
      </div>
    </StaticPageLayout>
  );
}

'use client';

import StaticPageLayout from '@/components/layout/StaticPageLayout';
import {
  List,
  ListItem,
  MetaInfo,
  Paragraph,
  SectionTitle,
} from '@/components/layout/StaticPageContent';

export default function PrivacyPolicyPage() {
  return (
    <StaticPageLayout
      titleEn="PRIVACY POLICY"
      titleJa="プライバシーポリシー"
      description="個人情報の取り扱いについて"
    >
      <Paragraph>
        Project
        Europa（以下、「当サイト」）は、ユーザーの個人情報保護を重要視しています。
        当サイトのプライバシーポリシーは、当サイトがどのように情報を収集、使用、保護するかについて説明します。
      </Paragraph>

      <SectionTitle>1. 収集する情報</SectionTitle>
      <Paragraph>当サイトでは、以下の情報を収集することがあります：</Paragraph>
      <List>
        <ListItem>
          アカウント登録時に提供される情報（ユーザー名、メールアドレスなど）
        </ListItem>
        <ListItem>
          ゲームデータ（アップロードされたチームデータ、マッチデータなど）
        </ListItem>
        <ListItem>
          サイト利用状況に関する情報（アクセスログ、IPアドレス、ブラウザ情報など）
        </ListItem>
        <ListItem>お問い合わせフォームから送信される情報</ListItem>
      </List>

      <SectionTitle>2. 情報の利用目的</SectionTitle>
      <Paragraph>収集した情報は、以下の目的で利用します：</Paragraph>
      <List>
        <ListItem>サービスの提供と改善</ListItem>
        <ListItem>ユーザーアカウントの管理</ListItem>
        <ListItem>サイトのセキュリティ確保</ListItem>
        <ListItem>ユーザーサポートの提供</ListItem>
        <ListItem>サービスに関する通知の送信</ListItem>
      </List>

      <SectionTitle>3. 情報の共有</SectionTitle>
      <Paragraph>
        当サイトは、以下の場合を除き、ユーザーの個人情報を第三者と共有することはありません：
      </Paragraph>
      <List>
        <ListItem>ユーザーの同意がある場合</ListItem>
        <ListItem>法的要請に応じる必要がある場合</ListItem>
        <ListItem>
          サービス提供に必要なパートナー企業との共有（この場合、適切なデータ保護措置を講じます）
        </ListItem>
      </List>

      <SectionTitle>4. データセキュリティ</SectionTitle>
      <Paragraph>
        当サイトは、ユーザー情報を保護するために適切なセキュリティ対策を実施しています。
        ただし、インターネット上での完全なセキュリティを保証することはできません。
      </Paragraph>

      <SectionTitle>5. Cookieの使用</SectionTitle>
      <Paragraph>
        当サイトでは、ユーザー体験の向上やサイト機能の提供のためにCookieを使用しています。
        ブラウザの設定でCookieを無効にすることも可能ですが、一部のサービスが正常に機能しなくなる可能性があります。
      </Paragraph>

      <SectionTitle>6. ユーザーの権利</SectionTitle>
      <Paragraph>ユーザーには以下の権利があります：</Paragraph>
      <List>
        <ListItem>個人情報へのアクセス</ListItem>
        <ListItem>個人情報の訂正</ListItem>
        <ListItem>個人情報の削除</ListItem>
        <ListItem>データ処理の制限</ListItem>
        <ListItem>データポータビリティ</ListItem>
      </List>
      <Paragraph>
        これらの権利を行使するには、お問い合わせフォームからご連絡ください。
      </Paragraph>

      <SectionTitle>7. プライバシーポリシーの変更</SectionTitle>
      <Paragraph>
        当サイトは、必要に応じてプライバシーポリシーを更新することがあります。
        重要な変更がある場合は、サイト上で通知します。
      </Paragraph>

      <SectionTitle>8. お問い合わせ</SectionTitle>
      <Paragraph>
        プライバシーポリシーに関するご質問やご懸念がある場合は、お問い合わせフォームからご連絡ください。
      </Paragraph>

      <MetaInfo>最終更新日: 2025年5月12日</MetaInfo>
    </StaticPageLayout>
  );
}

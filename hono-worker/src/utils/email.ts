/**
 * メール送信ユーティリティ（Resend）
 */

import { Resend } from 'resend';

export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

/**
 * Resendを使用してメールを送信
 */
export async function sendEmail(
    options: SendEmailOptions,
    apiKey: string,
    fromEmail: string = 'onboarding@resend.dev'
): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
        console.log('[Email] Attempting to send email via Resend');
        console.log('[Email] To:', options.to);
        console.log('[Email] From:', fromEmail);
        console.log('[Email] Subject:', options.subject);
        console.log('[Email] API Key length:', apiKey.length);

        const resend = new Resend(apiKey);

        const result = await resend.emails.send({
            from: fromEmail,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });

        console.log('[Email] Resend API response:', JSON.stringify(result, null, 2));

        if (result.error) {
            console.error('[Email] Failed to send email:', result.error);
            return { success: false, error: result.error.message };
        }

        console.log('[Email] Email sent successfully, ID:', result.data?.id);
        return { success: true, data: result.data };
    } catch (error) {
        console.error('[Email] Email sending error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * パスワードリセットメールのHTML生成
 */
export function generatePasswordResetEmail(
    resetUrl: string,
    email: string
): { html: string; text: string } {
    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>パスワードリセット</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- ヘッダー -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                パスワードリセット
                            </h1>
                        </td>
                    </tr>

                    <!-- メインコンテンツ -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                                こんにちは、
                            </p>

                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                                アカウント <strong>${email}</strong> のパスワードリセットがリクエストされました。
                            </p>

                            <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                                下のボタンをクリックして、新しいパスワードを設定してください：
                            </p>

                            <!-- ボタン -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                        <a href="${resetUrl}"
                                           style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                                            パスワードをリセット
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 20px; font-size: 14px; line-height: 1.6; color: #666666;">
                                ボタンが機能しない場合は、以下のURLをコピーしてブラウザに貼り付けてください：
                            </p>

                            <p style="margin: 0 0 30px; padding: 15px; background-color: #f8f9fa; border-radius: 4px; font-size: 13px; word-break: break-all; color: #495057;">
                                ${resetUrl}
                            </p>

                            <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e0e0e0;">
                                <p style="margin: 0 0 10px; font-size: 14px; line-height: 1.6; color: #666666;">
                                    <strong>⚠️ 重要な注意事項：</strong>
                                </p>
                                <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6; color: #666666;">
                                    <li>このリンクは <strong>1時間</strong> 後に無効になります</li>
                                    <li>パスワードリセットをリクエストしていない場合は、このメールを無視してください</li>
                                    <li>セキュリティ上の理由から、このメールを他の人と共有しないでください</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- フッター -->
                    <tr>
                        <td style="padding: 30px 40px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                                このメールは自動送信されています。返信しないでください。
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #999999;">
                                © ${new Date().getFullYear()} Europa. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    const text = `
パスワードリセット

こんにちは、

アカウント ${email} のパスワードリセットがリクエストされました。

以下のリンクをクリックして、新しいパスワードを設定してください：
${resetUrl}

重要な注意事項：
- このリンクは1時間後に無効になります
- パスワードリセットをリクエストしていない場合は、このメールを無視してください
- セキュリティ上の理由から、このメールを他の人と共有しないでください

このメールは自動送信されています。返信しないでください。

© ${new Date().getFullYear()} Europa. All rights reserved.
    `.trim();

    return { html, text };
}

/**
 * 開発環境用のコンソールログ出力
 */
export function logEmailToConsole(
    to: string,
    subject: string,
    resetUrl: string,
    token: string
): void {
    console.log('='.repeat(60));
    console.log('📧 Password Reset Email (Development Mode)');
    console.log('='.repeat(60));
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token: ${token}`);
    console.log('='.repeat(60));
}

/**
 * ログイン認証コード（ワンタイムパスコード）メールのHTML・テキスト生成
 */
export function generateOtpEmail(
    otpCode: string,
    email: string,
    expiresInMinutes: number = 10
): { html: string; text: string } {
    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログイン認証コード</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 15px;">
                <table role="presentation" style="width: 100%; max-width: 560px; border-collapse: collapse; background-color: #0d1527; border-radius: 16px; border: 1px solid #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <!-- ヘッダー -->
                    <tr>
                        <td style="padding: 36px 40px 24px; text-align: center; border-bottom: 1px solid #1e293b;">
                            <h1 style="margin: 0; color: #00c8ff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">
                                Europa ログイン認証コード
                            </h1>
                        </td>
                    </tr>

                    <!-- メインコンテンツ -->
                    <tr>
                        <td style="padding: 36px 40px;">
                            <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                                アカウント <strong>${email}</strong> のログイン要求を受け付けました。
                            </p>

                            <p style="margin: 0 0 28px; font-size: 15px; line-height: 1.6; color: #94a3b8;">
                                以下の6桁の認証コードをログイン画面に入力してください：
                            </p>

                            <!-- 認証コード表示ボックス -->
                            <div style="background: linear-gradient(135deg, rgba(0, 200, 255, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%); border: 1px solid #00c8ff; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px;">
                                <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #00c8ff; display: inline-block;">
                                    ${otpCode}
                                </span>
                            </div>

                            <div style="background-color: #131d35; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                                <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #38bdf8;">
                                    ⚠️ セキュリティ上のご案内
                                </p>
                                <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #94a3b8;">
                                    <li>この認証コードの有効期限は <strong>${expiresInMinutes}分間</strong> です。</li>
                                    <li>心当たりがない場合は、第三者が不正にログインを試みた可能性があります。パスワードの変更をご検討ください。</li>
                                    <li>このコードを第三者に教えたり共有したりしないでください。</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- フッター -->
                    <tr>
                        <td style="padding: 24px 40px; text-align: center; border-top: 1px solid #1e293b; background-color: #090e1a; border-radius: 0 0 16px 16px;">
                            <p style="margin: 0 0 6px; font-size: 12px; color: #64748b;">
                                このメールは送信専用アドレスから自動配信されています。
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #475569;">
                                © ${new Date().getFullYear()} Project Europa. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    const text = `
Europa ログイン認証コード

アカウント ${email} のログイン要求を受け付けました。
以下の認証コードをログイン画面に入力してください：

【認証コード】
${otpCode}

※有効期限: ${expiresInMinutes}分間

【注意事項】
・心当たりがない場合は、第三者が不正ログインを試みた可能性があります。パスワードを変更してください。
・このコードを第三者と共有しないでください。

© ${new Date().getFullYear()} Project Europa. All rights reserved.
    `.trim();

    return { html, text };
}

/**
 * 開発環境用のOTPコンソールログ出力
 */
export function logOtpToConsole(to: string, otpCode: string): void {
    console.log('='.repeat(60));
    console.log('🔑 Login OTP Code (Development Mode)');
    console.log('='.repeat(60));
    console.log(`To: ${to}`);
    console.log(`Code: ${otpCode}`);
    console.log('='.repeat(60));
}

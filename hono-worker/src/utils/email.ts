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

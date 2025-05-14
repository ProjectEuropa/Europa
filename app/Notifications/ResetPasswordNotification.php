<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    public $token;
    public $email;

    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $frontendUrl = config('app.frontend_url', 'https://local.europa.com');
        $resetUrl = "{$frontendUrl}/reset-password?token={$this->token}&email=" . urlencode($this->email);

        return (new MailMessage)
            ->subject('パスワード再設定')
            ->line('下のボタンをクリックしてパスワードを再設定してください。')
            ->action('パスワード再設定', $resetUrl)
            ->line('心当たりがない場合は、このメッセージは破棄してください。');
    }
}

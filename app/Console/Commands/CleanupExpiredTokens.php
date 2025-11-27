<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;

class CleanupExpiredTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sanctum:prune-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '期限切れのSanctumトークンをデータベースから削除します';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $expiredTokens = PersonalAccessToken::where('expires_at', '<', now())->count();

        if ($expiredTokens === 0) {
            $this->info('期限切れのトークンはありません。');
            return 0;
        }

        PersonalAccessToken::where('expires_at', '<', now())->delete();

        $this->info("{$expiredTokens}個の期限切れトークンを削除しました。");

        return 0;
    }
}

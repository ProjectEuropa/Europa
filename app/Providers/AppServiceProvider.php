<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // CHEファイルバリデーション
        Validator::extend('che_file', 'App\Validation\CustomValidator@validateCheFile');
        //ローカル以外（本番環境下）ではhttpsを強制する
        if (!\App::environment('local')) {
            $this->app['request']->server->set('HTTPS','on');
        }
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}

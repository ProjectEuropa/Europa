<?php

namespace App\Providers;

use Illuminate\Routing\UrlGenerator;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(UrlGenerator $url)
    {
        // CHEファイルバリデーション
        Validator::extend('che_file', 'App\Validation\CustomValidator@validateCheFile');
        if (in_array(config('app.env'), ['production', 'staging'], true)) {
            $url->forceScheme('https');
        }
    }
}

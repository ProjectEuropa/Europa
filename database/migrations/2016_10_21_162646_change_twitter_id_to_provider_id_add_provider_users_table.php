<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeTwitterIdToProviderIdAddProviderUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('twitter_id', 'provider_id');//twitter_idカラムをprovider_idに変更
            $table->string('provider')->nullable();// providerカラムを追加
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('provider_id', 'twitter_id'); //provider_idをtwitter_idを戻す
            $table->dropColumn('provider');// providerカラムを削除
        });
    }
}

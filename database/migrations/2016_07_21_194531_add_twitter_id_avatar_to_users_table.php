<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTwitterIdAvatarToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('password')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->string('handle')->unique()->nullable();
            $table->string('twitter_id')->nullable();
            $table->string('avatar')->nullable();
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
            $table->string('password')->change();
            $table->string('email')->change();
            $table->dropColumn('handle');
            $table->dropColumn('twitter_id');
            $table->dropColumn('avatar');
        });
    }
}

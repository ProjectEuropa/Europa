<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTeamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->increments('id');
            $table->string('upload_user_name');
            $table->string('file_title');
            $table->string('file_comment');
            $table->string('upload_type');//通常アップロード(1)かログインなし簡易か(2)
            $table->string('data_type');// チーム:1 or マッチ:2か
            $table->string('delete_password');
            $table->binary('file_data');
            $table->timestamps();
            
            // file_title⇒file_name変更
            // upload_user_id userとのJoin用追加
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('teams');
    }
}

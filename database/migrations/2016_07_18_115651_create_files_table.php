<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('files', function (Blueprint $table) {
            $table->increments('id');
            $table->string('upload_user_id')->nullable();
            $table->string('upload_owner_name');
            $table->string('file_name');
            $table->string('file_comment');
            $table->binary('file_data');
            $table->string('upload_type');//通常アップロード(1)かログインなし簡易か(2)
            $table->string('data_type');// チーム:1 or マッチ:2
            $table->string('delete_password');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('files');
    }
}

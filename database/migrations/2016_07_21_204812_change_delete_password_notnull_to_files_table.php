<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeDeletePasswordNotnullToFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('files', function (Blueprint $table) {
            //
            $table->string('delete_password')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('files', function (Blueprint $table) {
            //
            $table->string('delete_password')->change();
        });
    }
}

<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSearchTagToFilesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('files', function (Blueprint $table) {
            $table->string('search_tag1')->nullable(); // search_tag1カラムを追加
            $table->string('search_tag2')->nullable(); // search_tag2カラムを追加
            $table->string('search_tag3')->nullable(); // search_tag3カラムを追加
            $table->string('search_tag4')->nullable(); // search_tag4カラムを追加
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('files', function (Blueprint $table) {
            $table->dropColumn('search_tag1'); // search_tag1カラムを削除
            $table->dropColumn('search_tag2'); // search_tag2カラムを削除
            $table->dropColumn('search_tag3'); // search_tag3カラムを削除
            $table->dropColumn('search_tag4'); // search_tag4カラムを削除
        });
    }

}

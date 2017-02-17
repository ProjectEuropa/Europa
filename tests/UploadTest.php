<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UploadTest extends TestCase {

    /**
     * 簡易アップロードチームValidationtest.
     *
     * @return void
     */
    public function testSimpleUploadTeamValidation() {
        $this->visit('/simpleupload')
                ->see('Simple Upload')
                ->see('チームデータアップロード')
                ->press('チームデータアップロード')
                ->seePageIs('/simpleupload')
                ->see('オーナー名は必須です。')
                ->see('コメントは必須です。')
                ->see('削除パスワードは必須です。')
                ->see('チームファイルは必須です。');
    }

    /**
     * 簡易アップロードマッチValidationtest.
     *
     * @return void
     */
    public function testSimpleUploadMatchValidation() {
        $this->visit('/simpleupload')
                ->see('Simple Upload')
                ->see('チームデータアップロード')
                ->press('マッチデータアップロード')
                ->seePageIs('/simpleupload')
                ->see('オーナー名は必須です。')
                ->see('コメントは必須です。')
                ->see('削除パスワードは必須です。')
                ->see('マッチファイルは必須です。');
    }

    /**
     * 簡易アップロードチームtest.
     *
     * @return void
     */
//     public function testSimpleUploadTeam() {
//         $this->visit('/simpleupload')
//                 ->type('テストユーザ', 'teamOwnerName')
//                 ->type('簡易アップロードチームテスト', 'teamComment')
//                 ->type('test', 'teamDeletePassWord')
//                 ->attach(public_path('testfiles/HROHM6.CHE'), 'teamFile')
//                 ->press('チームデータアップロード')
//                 ->seePageIs('/simpleupload')
//                 ->see('チームデータのアップロードが完了しました。')
//                 ->visit('/search/team')
//                 ->see('テストユーザ')
//                 ->see('簡易アップロードチームテスト')
//                 ->see('HROHM6.CHE');
//     }

    /**
     * 簡易アップロードマッチtest.
     *
     * @return void
     */
//     public function testSimpleUploadMatch() {
//         $this->visit('/simpleupload')
//                 ->type('テストユーザ', 'matchOwnerName')
//                 ->type('簡易アップロードマッチテスト', 'matchComment')
//                 ->type('test', 'matchDeletePassWord')
//                 ->attach(public_path('testfiles/4MSH.CHE'), 'matchFile')
//                 ->press('マッチデータアップロード')
//                 ->seePageIs('/simpleupload')
//                 ->see('マッチデータのアップロードが完了しました。')
//                 ->visit('/search/match')
//                 ->see('テストユーザ')
//                 ->see('簡易アップロードマッチテスト')
//                 ->see('4MSH.CHE');
//     }

}

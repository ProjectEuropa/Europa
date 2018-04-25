<?php

namespace Tests\Unit;

use App\User;
use DB;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RouteGetUnitTest extends TestCase
{
    /**
     * ユーザーセットアップfunction
     * ユーザーを新規に作成してログインし、作成したユーザー情報を返却する
     *
     * @return User class
     */
    private function userSetUp() : User
    {
        $user = factory(User::class)->create();
        $this->be($user);
        return $user;
    }

    
    /**
     * トップ画面テスト
     *
     * @return void
     */
    public function testTopPage()
    {
        $response = $this->call('GET', '/');
        $this->assertEquals(200, $response->status());
    }

    /**
     * マイページ画面テスト
     *
     * @return void
     */
    public function testUploadPage()
    {
        $user = $this->userSetUp();
        $response = $this->call('GET', '/upload');
        $this->assertEquals(200, $response->status());
        User::find($user->id)->delete();
    }

    /**
     * 簡易アップロード画面テスト
     *
     * @return void
     */
    public function testSimpleUploadPage()
    {
        $response = $this->call('GET', '/simpleupload');
        
        $this->assertEquals(200, $response->status());
    }

    /**
     * リンク画面テスト
     *
     * @return void
     */
    public function testLinksPage()
    {
        $response = $this->call('GET', '/links');
        
        $this->assertEquals(200, $response->status());
    }

    /**
     * 検索画面テスト
     *
     * @return void
     */
    public function testSearchPage()
    {
        $response = $this->call('GET', '/search/team');
        $this->assertEquals(200, $response->status());

        $response = $this->call('GET', '/search/match');
        $this->assertEquals(200, $response->status());

    }

    /**
     * 一括ダウンロード画面テスト
     *
     * @return void
     */
    public function testSumDonwloadPage()
    {
        $response = $this->call('GET', '/sumdownload/team');
        $this->assertEquals(200, $response->status());

        $response = $this->call('GET', '/sumdownload/match');
        $this->assertEquals(200, $response->status());

    }

    /**
     * インフォメーション・イベントカレンダー画面テスト
     *
     * @return void
     */
    public function testInformationPage()
    {
        $response = $this->call('GET', '/information');
        $this->assertEquals(200, $response->status());

        $response = $this->call('GET', '/eventcalendar');
        $this->assertEquals(200, $response->status());
    }

    /**
     * イベント告知画面テスト
     *
     * @return void
     */
    public function testEventNoticePage()
    {
        $user = $this->userSetUp();
        $response = $this->call('GET', '/eventnotice');
        $this->assertEquals(200, $response->status());
        User::find($user->id)->delete();
    }

    /**
     * マイページ画面テスト
     *
     * @return void
     */
    public function testMyPage()
    {
        $user = $this->userSetUp();
        $response = $this->call('GET', '/mypage');
        $this->assertEquals(200, $response->status());
        User::find($user->id)->delete();
    }

    /**
     * ダウンロード画面テスト
     *
     * @return void
     */
    public function testDownloadRoute()
    {
        $files = DB::table('files')->select('id')->inRandomOrder();
        if ($files) {
            $id = $files->first()->id;
            $response = $this->call('GET', '/search/download/'.$id);
            $this->assertEquals(200, $response->baseResponse->getStatusCode());
        }
    } 

}

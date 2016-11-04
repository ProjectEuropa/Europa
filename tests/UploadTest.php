<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UploadTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUploadTeamValidation()
    {
        $this->visit('/simpleupload')
                ->see('Simple Upload')
                ->see('チームデータアップロード')
                ->press('チームデータアップロード')
                ->seePageIs('/simpleupload')
                ->see('チームファイル');
    }
}

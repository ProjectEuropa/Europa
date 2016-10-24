<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class HeaderLinkTest extends TestCase {

    /**
     * ヘッダーリンクテストTop画面
     *
     * @return void
     */
    public function testHeaderLinkTop() {
        $this->visit('/')
                ->see('Welcome To Europa')
                ->see('Top')->see('Information')->see('Search')
                ->see('Team Data')->see('Match Data')->see('Sum DL')
                ->see('DL Team')->see('DL Match')->see('Simple Upload')
                ->see('Help')->see('Links')->see('Login')
                ->click('Top')
                ->seePageIs('/')
                ->see('Welcome To Europa')
                ->see('Top')->see('Information')->see('Search')
                ->see('Team Data')->see('Match Data')->see('Sum DL')
                ->see('DL Team')->see('DL Match')->see('Simple Upload')
                ->see('Help')->see('Links')->see('Login');
    }

    /**
     * ヘッダーリンクテストInformation画面
     *
     * @return void
     */
    public function testHeaderLinkInformation() {
        $this->visit('/information')
                ->see('Information')
                ->click('Information')
                ->seePageIs('/information')
                ->see('Information');
    }

    /**
     * ヘッダーリンクテストTeam Data・Match Data画面
     *
     * @return void
     */
    public function testHeaderLinkSearch() {
        $this->visit('/search/team')
                ->see('Team Data')
                ->click('Search')->click('Team Data')
                ->seePageIs('/search/team')
                ->see('Team Data')
                ->visit('/search/match')
                ->click('Search')->click('Match Data')
                ->seePageIs('/search/match')
                ->see('Match Data');
    }
}

<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\File;
use Carbon\Carbon;

class FileModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function masked_comment_returns_masked_when_downloadable_in_future()
    {
        $file = File::create([
            'upload_owner_name' => 'Test',
            'file_name'         => 'test.txt',
            'file_comment'      => 'secret comment',
            'upload_user_id'    => 1,
            'upload_type'       => '1',
            'data_type'         => '1',
            'search_tag1'       => 'tag1',
            'search_tag2'       => 'tag2',
            'search_tag3'       => 'tag3',
            'search_tag4'       => 'tag4',
            'file_data'         => '',
            'downloadable_at'   => Carbon::now()->addDay(),
        ]);

        $this->assertEquals(
            'ダウンロード可能日時が過ぎていないためコメントは非表示です',
            $file->masked_comment
        );
    }

    /** @test */
    public function masked_comment_returns_original_when_downloadable_past_or_null()
    {
        $past = File::create([
            'upload_owner_name' => 'Past',
            'file_name'         => 'past.txt',
            'file_comment'      => 'past comment',
            'upload_user_id'    => 1,
            'upload_type'       => '1',
            'data_type'         => '1',
            'search_tag1'       => 'tag1',
            'search_tag2'       => 'tag2',
            'search_tag3'       => 'tag3',
            'search_tag4'       => 'tag4',
            'file_data'         => '',
            'downloadable_at'   => Carbon::now()->subDay(),
        ]);
        $null = File::create([
            'upload_owner_name' => 'Null',
            'file_name'         => 'null.txt',
            'file_comment'      => 'null comment',
            'upload_user_id'    => 2,
            'upload_type'       => '2',
            'data_type'         => '2',
            'search_tag1'       => 'tag1',
            'search_tag2'       => 'tag2',
            'search_tag3'       => 'tag3',
            'search_tag4'       => 'tag4',
            'file_data'         => '',
            'downloadable_at'   => null,
        ]);

        $this->assertEquals('past comment', $past->masked_comment);
        $this->assertEquals('null comment', $null->masked_comment);
    }

    /** @test */
    public function scope_with_keyword_filters_records_correctly()
    {
        File::create([
            'upload_owner_name' => 'Alice',
            'file_name'         => 'alpha.txt',
            'file_comment'      => 'foo',
            'upload_user_id'    => 1,
            'upload_type'       => '1',
            'data_type'         => '1',
            'search_tag1'       => 'hello',
            'search_tag2'       => 'world',
            'search_tag3'       => '',
            'search_tag4'       => '',
            'file_data'         => '',
            'downloadable_at'   => null,
        ]);
        File::create([
            'upload_owner_name' => 'Bob',
            'file_name'         => 'beta.txt',
            'file_comment'      => 'bar',
            'upload_user_id'    => 2,
            'upload_type'       => '1',
            'data_type'         => '1',
            'search_tag1'       => 'tag1',
            'search_tag2'       => 'tag2',
            'search_tag3'       => '',
            'search_tag4'       => '',
            'file_data'         => '',
            'downloadable_at'   => null,
        ]);

        $results = File::withKeyword('hello')->get();
        $this->assertCount(1, $results);
        $this->assertEquals('alpha.txt', $results->first()->file_name);
    }
}

<?php

use Illuminate\Database\Seeder;

class TeamsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        for ($i = 1; $i <= 10; $i++) {
            DB::table('teams')->insert([
                'file_title' => 'sample'.$i,
                'file_comment' => 'testComent'.$i,
                'upload_user_name' => 'Owner'.$i,
                'upload_type' => '2',
                'data_type' => '1',
                'data_type' => 'del',
            ]);
        }
    }
}

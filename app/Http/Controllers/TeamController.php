<?php

namespace App\Http\Controllers;

use App\Team;

use Illuminate\Http\Request;

use App\Http\Requests;

/*
 *
 * 
 */
class TeamController extends Controller
{
    //
  public function index() {
    //teamテーブルのデータをすべて取得する
    $teams = Team::orderBy('id', 'asc')->get();
    return view('team.index', [
        'teams' => $teams
    ]);
  }
  
    /**
     * ファイルダウンロード実行Action
     * download/{id}のURLのidから指定したidのファイルをDLする
     */
  public function download($id) {
    $team = Team::where('id', '=', $id)->first();
    
    // タイトル取得
    $title = $team->file_title;
    // CHEバイナリデータ取得
    $file_data = $team->file_data;
    
    // 取得したバイナリデータを書き込み
    $che_data = '.CHE'; 
    file_put_contents($che_data, $file_data);
    
    $headers = array(
        'Content-Type: application/CHE',
    );
    
    return response()->download($che_data, $title, $headers);
  }
}

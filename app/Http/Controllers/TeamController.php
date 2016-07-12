<?php

namespace App\Http\Controllers;

use App\Team;
use Illuminate\Http\Request;
use App\Http\Requests;

// TODO 定数クラス作成
const DATA_TYPE_TEAM = '1';
const DATA_TYPE_MATCH = '2';
/*
 *　チームデータ検索コントローラ
 */
class TeamController extends Controller {

    /*
     *　チームデータ検索処理
     *  ページング機能を実装
     */
    public function index(Request $request) {

        // 検索ワード取得
        $keyword = $request->input('keyword');

        //チームデータ検索Query生成
        $query = Team::query();

        //キーワード存在時の処理
        if (!empty($keyword)) {
            $query->Where('upload_user_name', 'like', '%' . $keyword . '%')
                    ->orWhere('file_title', 'like', '%' . $keyword . '%')
                    ->orWhere('file_comment', 'like', '%' . $keyword . '%');
        }

        //ページング機能を実装
        $teams = $query->where('data_type', '=', DATA_TYPE_TEAM)
                ->orderBy('id','asc')->paginate(5);
        
        return view('team.index', [
            'teams' => $teams,
            'keyword'=> $keyword
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

<?php

namespace App\Http\Controllers;

use App\Team;
use Illuminate\Http\Request;

// TODO 定数クラス作成
const DATA_TYPE_TEAM = '1';
const DATA_TYPE_MATCH = '2';
const SEARCH_TYPE_TEAM = 'team';
const SEARCH_TYPE_MATCH = 'match';
const ORDER_TYPE_NEW = 'new';
/*
 *　チームデータ検索コントローラ
 */
class SearchController extends Controller {

    /*
     *　チーム・マッチデータ検索処理
     *  ページング機能を実装
     */
    public function index(Request $request, $type) {
        
        //チームデータ検索Query生成
        $query = Team::query();
        // 検索ワード取得
        $keyword = $request->input('keyword');
        
        //キーワード存在時の処理
        if (!empty($keyword)) {
            $query->Where('upload_user_name', 'like', '%' . $keyword . '%')
                    ->orWhere('file_title', 'like', '%' . $keyword . '%')
                    ->orWhere('file_comment', 'like', '%' . $keyword . '%');
        }
        
        // search/{type}のurlがチームかマッチかで分岐
        if ($type == SEARCH_TYPE_TEAM) {
            $teams = $query->where('data_type', '=', DATA_TYPE_TEAM);
        } else if ($type == SEARCH_TYPE_MATCH) {
            $teams = $query->where('data_type', '=', DATA_TYPE_MATCH);
        } else {
            return null;
        }
        // ソートタイプ
        $query->orderBy('id','desc');
        
        // ソート順未実装
//        $orderType = $request->input('orderType');
//        if ($orderType == ORDER_TYPE_NEW) {
//            $query->orderBy('id','desc');
//        } else {
//            $query->orderBy('id','asc');
//        }
        
        //ページング機能を実装
        $teams = $query->paginate(5);
        
        // 検索ワードと検索結果、検索タイプを送信
        return view('team.index', [
            'teams' => $teams,
            'keyword'=> $keyword,
            'type'=>$type
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
    
    /**
     * ファイル削除実行Action
     * 
     */
    public function delete(Request $request) {
        $id = $request->input('id');
        
        //チームデータ検索Query生成
        $dbDeletePassWord = Team::where('id', '=', $id)->select('delete_password')->first()->delete_password;

        $inputDeletePassWord = $request->input('deletePassword');
        
        // 画面がチームかマッチか
        $dataType = $request->input('dataType');
        
        // 入力パスとDBのパスが一致していない 
        if ($dbDeletePassWord != $inputDeletePassWord) {
            \Session::flash('error_message', '削除パスワードに誤りがあります。');
            if ($dataType == DATA_TYPE_TEAM) {
                return redirect('search/team');       
            } else {
                return redirect('search/match');                 
            }
            return redirect('search/team');
        }
        
        // 画面がチームかマッチか
        $dataType = $request->input('dataType');
        Team::where('id', '=', $id)->where('delete_password', '=', $inputDeletePassWord)->delete();
        
        if ($dataType == DATA_TYPE_TEAM) {
            \Session::flash('flash_message', 'チームデータの削除が完了しました。');
            return redirect('search/team');       
        } else {
            \Session::flash('flash_message', 'マッチデータの削除が完了しました。');
            return redirect('search/match');                 
        }
        

    }
}

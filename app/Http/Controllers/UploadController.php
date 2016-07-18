<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\File;
use Validator;
use DB;

use App\CommonUtils\Constants;

const TEAM_FLG_TRUE = true;
const TEAM_FLG_FALSE = false;

/*
  アップロード操作実行コントローラ
 */

class UploadController extends Controller {

    //
    public function index() {
        return view('upload.index');
    }

    /**
     * チームアップロード操作実行Action
     *
     * @param  Request  $request
     * @return view upload.index
     */
    public function teamUpload(Request $request) {

        /*
          　オーナー名・コメント・削除パスワード・チームファイル必須
          　チームフファイルCHEのみ・260KBまで
          　 no_che_fileはApp\Validation\CustomValidatorで設定
         */
        $validator = Validator::make($request->all(), [
                    'ownerName' => 'required|max:12',
                    'comment' => 'required|max:60',
                    'deletePassWord' => 'required|max:12',
                    'teamFile' => 'required|no_che_file|max:24'
        ]);

        if ($validator->fails()) {
            return redirect('/simpleUpload')
                            ->withInput()
                            ->withErrors($validator);
        }

        // ファイルデータ登録処理
        $this->insertFileData($request, TEAM_FLG_TRUE);

        \Session::flash('flash_message', 'チームデータのアップロードが完了しました。');

        return view('upload.index');
    }

    /**
     * マッチデータアップロード操作実行Action
     *
     * @param  Request  $request
     * @return view upload.index
     */
    public function matchUpload(Request $request) {

        /*
          　オーナー名・コメント・削除パスワード・マッチファイル必須
          　マッチファイルCHEのみ・260KBまで
          　 no_che_fileはApp\Validation\CustomValidatorで設定
         */
        $validator = Validator::make($request->all(), [
                    'ownerName' => 'required|max:12',
                    'comment' => 'required|max:60',
                    'deletePassWord' => 'required|max:12',
                    'matchFile' => 'required|no_che_file|max:260',
        ]);

        if ($validator->fails()) {
            return redirect('/simpleUpload')
                            ->withInput()
                            ->withErrors($validator);
        }
        
        // ファイルデータ登録処理
        $this->insertFileData($request, TEAM_FLG_FALSE);

        \Session::flash('flash_message', 'マッチデータのアップロードが完了しました。');

        return view('upload.index');
    }

    /**
     * ファイルデータ登録処理
     * @param Request リクエスト
     * @param  bool  true場合チーム falseの場合マッチデータ
     * @return void
     */
    private function insertFileData(Request $request, bool $teamFlg) {

        $dataType = null;
        $file = null;

        // チームFlgがオンならばチームデータを取得、offならばマッチデータ
        if ($teamFlg) {
            $dataType = Constants::DB_STR_DATA_TYPE_TEAM;
            $file = $request->file('teamFile');
        } else {
            $dataType = Constants::DB_STR_DATA_TYPE_MATCH;
            $file = $request->file('matchFile');
        }
 
        $fileData = file_get_contents($file);       // ファイルのバイナリデータ取得
        $uploadType = Constants::DB_UPLOAD_TYPE_SIMPLE; //現在簡易アップロードのみの対応
        $fileName = $file->getClientOriginalName();     // ファイル名
        $uploadOwnerName = $request->input('ownerName');   // アップロードオーナー名（編集可能）
        $fileComment = $request->input('comment');          // コメント
        $deletePassword = $request->input('deletePassWord'); // 削除パスワード
        $now = date('Y/m/d H:i:s'); // 現在日付
        
        // LOB仕様のためPDOを取得し直接SQLを実行する
        $db = DB::connection('pgsql')->getPdo();
        
        $stmt = $db->prepare("INSERT INTO files (file_data, upload_type, file_name, upload_owner_name, file_comment, delete_password, data_type, created_at, updated_at) "
                . "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->bindParam(1, $fileData, $db::PARAM_LOB);//ラージオブジェクトとして登録
        $stmt->bindParam(2, $uploadType, $db::PARAM_STR);
        $stmt->bindParam(3, $fileName, $db::PARAM_STR);
        $stmt->bindParam(4, $uploadOwnerName, $db::PARAM_STR);
        $stmt->bindParam(5, $fileComment, $db::PARAM_STR);
        $stmt->bindParam(6, $deletePassword, $db::PARAM_STR);
        $stmt->bindParam(7, $dataType, $db::PARAM_STR);
        $stmt->bindParam(8, $now, $db::PARAM_STR);
        $stmt->bindParam(9, $now, $db::PARAM_STR);

        // 登録実行
        $stmt->execute();
        // 切断
        unset($db);
    }

}

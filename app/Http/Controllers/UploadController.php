<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\File;
use Validator;
use DB;
use Auth;

use App\CommonUtils\Constants;

const TEAM_FLG_TRUE = true;
const TEAM_FLG_FALSE = false;

const NORMAL_UPLOAD_FLG_TRUE = true;
const NORMAL_UPLOAD_FLG_FALSE = false;

/*
  アップロード操作実行コントローラ
 */

class UploadController extends Controller {

    //簡易アップロード
    public function simpleIndex() {
        return view('upload.simpleIndex');
    }
    //
    public function normalIndex() {
        return view('upload.normalIndex');
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
          　コメント100文字まで（改行コード含む）・チームファイルCHEのみ・260KBまで
          　 no_che_fileはApp\Validation\CustomValidatorで設定
         */
        $validator = Validator::make($request->all(), [
                    'ownerName' => 'required|max:12',
                    'comment' => 'required|max:100',
                    'deletePassWord' => 'required|max:12',
                    'teamFile' => 'required|no_che_file|max:24'
        ]);

        if ($validator->fails()) {
            return redirect('/simpleUpload')
                            ->withInput()
                            ->withErrors($validator);
        }

        // ファイルデータ登録処理
        $this->insertFileData($request, TEAM_FLG_TRUE, NORMAL_UPLOAD_FLG_FALSE);

        \Session::flash('flash_message', trans('messages.upload_complete', ['name' => 'チームデータ']));

        return view('upload.simpleIndex');
    }

    /**
     * 通常チームアップロード操作実行Action
     *
     * @param  Request  $request
     * @return view upload.index
     */
    public function normalTeamUpload(Request $request) {
        /*
          　オーナー名・コメント・チームファイル必須
          　コメント100文字まで（改行コード含む）・チームフファイルCHEのみ・260KBまで
          　 no_che_fileはApp\Validation\CustomValidatorで設定
         */
        $validator = Validator::make($request->all(), [
                    'ownerName' => 'required|max:12',
                    'comment' => 'required|max:100',
                    'teamFile' => 'required|no_che_file|max:24'
        ]);

        if ($validator->fails()) {
            return redirect('/upload')
                            ->withInput()
                            ->withErrors($validator);
        }

        // ファイルデータ登録処理
        $this->insertFileData($request, TEAM_FLG_TRUE, NORMAL_UPLOAD_FLG_TRUE);

        \Session::flash('flash_message', trans('messages.upload_complete', ['name' => 'チームデータ']));

        return view('upload.normalIndex');
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
          　コメント100文字まで（改行コード含む）・マッチファイルCHEのみ・260KBまで
          　 no_che_fileはApp\Validation\CustomValidatorで設定
         */
        $validator = Validator::make($request->all(), [
                    'ownerName' => 'required|max:12',
                    'comment' => 'required|max:100',
                    'deletePassWord' => 'required|max:12',
                    'matchFile' => 'required|no_che_file|max:260',
        ]);

        if ($validator->fails()) {
            return redirect('/simpleUpload')
                            ->withInput()
                            ->withErrors($validator);
        }
        
        // ファイルデータ登録処理
        $this->insertFileData($request, TEAM_FLG_FALSE, NORMAL_UPLOAD_FLG_FALSE);

        \Session::flash('flash_message', trans('messages.upload_complete', ['name' => 'マッチデータ']));

        return view('upload.simpleIndex');
    }
        /**
     * マッチデータアップロード操作実行Action
     *
     * @param  Request  $request
     * @return view upload.index
     */
    public function normalMatchUpload(Request $request) {

        /*
          　オーナー名・コメント・マッチファイル必須
          　コメント100文字まで（改行コード含む）・マッチファイルCHEのみ・260KBまで
          　 no_che_fileはApp\Validation\CustomValidatorで設定
         */
        $validator = Validator::make($request->all(), [
                    'ownerName' => 'required|max:12',
                    'comment' => 'required|max:100',
                    'matchFile' => 'required|no_che_file|max:260',
        ]);

        if ($validator->fails()) {
            return redirect('/simpleUpload')
                            ->withInput()
                            ->withErrors($validator);
        }
        
        // ファイルデータ登録処理
        $this->insertFileData($request, TEAM_FLG_FALSE, NORMAL_UPLOAD_FLG_TRUE);

        \Session::flash('flash_message', trans('messages.upload_complete', ['name' => 'マッチデータ']));

        return view('upload.simpleIndex');
    }

    /**
     * ファイルデータ登録処理
     * @param Request リクエスト
     * @param  bool  true場合チーム falseの場合マッチデータ
     * @param  bool  true通常アップロード場合チーム falseの場合簡易アップロード     
     * @return void
     */
    private function insertFileData(Request $request, bool $teamFlg, bool $normalUploadFlg) {

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
        $fileName = $file->getClientOriginalName();     // ファイル名
        $uploadOwnerName = $request->input('ownerName');   // アップロードオーナー名（編集可能）
        $fileComment = $request->input('comment');          // コメント
        $deletePassword = $request->input('deletePassWord'); // 削除パスワード
        $now = date('Y/m/d H:i:s'); // 現在日付

        $uploadUserId = null;
        $uploadType = null;

        // 通常アップロードであるならばセッションのユーザーIDを登録
        if ($normalUploadFlg) {
            $uploadUserId = Auth::user()->id;
            $uploadType = Constants::DB_UPLOAD_TYPE_NORMAL; //通常アップロード
        } else {
            $uploadUserId = 0;
	    $uploadType = Constants::DB_UPLOAD_TYPE_SIMPLE; //簡易アップロード
        }
        
        // LOB仕様のためPDOを取得し直接SQLを実行する
        $db = DB::connection('pgsql')->getPdo();
        
        $stmt = $db->prepare("INSERT INTO files (file_data, upload_type, file_name, upload_owner_name, file_comment, delete_password, data_type, created_at, updated_at, upload_user_id) "
                . "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->bindParam(1, $fileData, $db::PARAM_LOB);//ラージオブジェクトとして登録
        $stmt->bindParam(2, $uploadType, $db::PARAM_STR);
        $stmt->bindParam(3, $fileName, $db::PARAM_STR);
        $stmt->bindParam(4, $uploadOwnerName, $db::PARAM_STR);
        $stmt->bindParam(5, $fileComment, $db::PARAM_STR);
        $stmt->bindParam(6, $deletePassword, $db::PARAM_STR);
        $stmt->bindParam(7, $dataType, $db::PARAM_STR);
        $stmt->bindParam(8, $now, $db::PARAM_STR);
        $stmt->bindParam(9, $now, $db::PARAM_STR);
        $stmt->bindParam(10, $uploadUserId, $db::PARAM_INT);

        // 登録実行
        $stmt->execute();
        // 切断
        unset($db);
    }

}

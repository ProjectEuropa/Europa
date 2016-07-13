<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Team;
use Validator;

const DATA_TYPE_TEAM = '1';
const DATA_TYPE_MATCH = '2';
const UPLOAD_TYPE_SIMPLE = '2';
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

    /*
      チームアップロード操作実行コントローラ
     */
    public function teamUpload(Request $request) {

        /*
          　オーナー名・コメント・チームファイル必須
          　チームフファイルCHEのみ・260KBまで
          　 no_che_fileはApp\Validation\CustomValidatorで設定
         */
        $validator = Validator::make($request->all(), [
                    'ownerName' => 'required|max:12',
                    'comment' => 'required|max:60',
                    'teamFile' => 'required|no_che_file|max:24'
        ]);

        if ($validator->fails()) {
            return redirect('/simpleUpload')
                            ->withInput()
                            ->withErrors($validator);
        }

        // ファイルデータをモデルにセット
        $team = $this->setFileDataToModel($request, TEAM_FLG_TRUE);

        $team->save();

        \Session::flash('flash_message', 'チームデータのアップロードが完了しました。');

        return view('upload.index');
    }

    /*
      マッチデータアップロード操作実行コントローラ
     */
    public function matchUpload(Request $request) {

        /*
          　オーナー名・コメント・マッチファイル必須
          　マッチファイルCHEのみ・260KBまで
          　 no_che_fileはApp\Validation\CustomValidatorで設定
         */
        $validator = Validator::make($request->all(), [
                    'ownerName' => 'required|max:12',
                    'comment' => 'required|max:60',
                    'matchFile' => 'required|no_che_file|max:260',
        ]);

        if ($validator->fails()) {
            return redirect('/simpleUpload')
                            ->withInput()
                            ->withErrors($validator);
        }

        $team = $this->setFileDataToModel($request, TEAM_FLG_FALSE);

        $team->save();

        \Session::flash('flash_message', 'マッチデータのアップロードが完了しました。');

        return view('upload.index');
    }

    /*
      ファイルデータ設定処理
      第二引数がtrueの場合チーム、falseの場合マッチデータアップロード
     */

    private function setFileDataToModel(Request $request, bool $teamFlg) {

        $team = new Team;
        $file = null;

        // チームFlgがオンならばチームデータを取得、offならばマッチデータ
        if ($teamFlg) {
            $team->data_type = DATA_TYPE_TEAM;
            $file = $request->file('teamFile');
        } else {
            $team->data_type = DATA_TYPE_MATCH;
            $file = $request->file('matchFile');
        }

        $team->upload_user_name = $request->input('ownerName');
        $team->file_comment = $request->input('comment');
        $team->delete_password = $request->input('deletePassWord');
        $team->file_data = file_get_contents($file);
        $team->file_title = $file->getClientOriginalName();
        
        // 現在簡易アップロードのみの対応
        $team->upload_type = UPLOAD_TYPE_SIMPLE;
        return $team;
    }

}

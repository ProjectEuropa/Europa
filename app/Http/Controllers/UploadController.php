<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Team;

const DATA_TYPE_TEAM = '1';
const UPLOAD_TYPE_SIMPLE = '2';

/*
  アップロード操作実行コントローラ
 */

class UploadController extends Controller {

    //
    public function index() {
        return view('upload.index');
    }

    public function upload(Request $request) {

        $this->validate($request, [
            'ownerName' => 'required',
            'comment' => 'required',
            'teamFile' => 'required',
        ]);

        $team = new Team;

        // fileデータ取得
        $file = $request->file('teamFile');

        $team->upload_user_name = $request->input('ownerName');
        $team->file_comment = $request->input('comment');
        $team->delete_password = $request->input('deletePassWord');
        $team->file_data = file_get_contents($file);
        $team->file_title = $file->getClientOriginalName();
        $team->data_type = DATA_TYPE_TEAM;
        $team->upload_type = UPLOAD_TYPE_SIMPLE;

        $team->save();

        \Session::flash('flash_message', 'チームデータのアップロードが完了しました。');
        
        return view('upload.index');
    }

}

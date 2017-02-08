<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\BusinessService\FileService;
use Validator;
use App\CommonUtils\Constants;

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
                    'teamOwnerName' => 'required|max:12',
                    'teamComment' => 'required|max:100',
                    'teamDeletePassWord' => 'required|max:12',
                    'teamFile' => 'required|no_che_file|max:24',
        			'teamSearchTags.*' => 'max:20'
        ]);

        if ($validator->fails()) {
            return redirect('/simpleupload')
                            ->withInput()
                            ->withErrors($validator);
        }

        // ファイルデータ登録処理
        FileService::registerFileData($request, Constants::IS_TEAM_FLG_TRUE, Constants::IS_NORMAL_UPLOAD_FLG_FALSE);

        \Session::flash('flash_message', trans('messages.upload_complete', ['name' => 'チームデータ']));

        return redirect('/simpleupload');
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
                    'teamOwnerName' => 'required|max:12',
                    'teamComment' => 'required|max:100',
                    'teamFile' => 'required|no_che_file|max:24',
        			'teamSearchTags.*' => 'max:20'
        ]);

        if ($validator->fails()) {
            return redirect('/upload')
                            ->withInput()
                            ->withErrors($validator);
        }

        // ファイルデータ登録処理
        FileService::registerFileData($request, Constants::IS_TEAM_FLG_TRUE, Constants::IS_NORMAL_UPLOAD_FLG_TRUE);

        \Session::flash('flash_message', trans('messages.upload_complete', ['name' => 'チームデータ']));

        return redirect('/upload');
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
                    'matchOwnerName' => 'required|max:12',
                    'matchComment' => 'required|max:100',
                    'matchDeletePassWord' => 'required|max:12',
                    'matchFile' => 'required|no_che_file|max:260',
        			'matchSearchTags.*' => 'max:20'
        ]);

        if ($validator->fails()) {
            return redirect('/simpleupload')
                            ->withInput()
                            ->withErrors($validator);
        }

        // ファイルデータ登録処理
        FileService::registerFileData($request, Constants::IS_TEAM_FLG_FALSE, Constants::IS_NORMAL_UPLOAD_FLG_FALSE);

        \Session::flash('flash_message', trans('messages.upload_complete', ['name' => 'マッチデータ']));

        return redirect('/simpleupload');
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
                    'matchOwnerName' => 'required|max:12',
                    'matchComment' => 'required|max:100',
                    'matchFile' => 'required|no_che_file|max:260',
        			'matchSearchTags.*' => 'max:20'
        ]);

        if ($validator->fails()) {
            return redirect('/upload')
                            ->withInput()
                            ->withErrors($validator);
        }

        // ファイルデータ登録処理
        FileService::registerFileData($request, Constants::IS_TEAM_FLG_FALSE, Constants::IS_NORMAL_UPLOAD_FLG_TRUE);

        \Session::flash('flash_message', trans('messages.upload_complete', ['name' => 'マッチデータ']));

        return redirect('/upload');
    }
}

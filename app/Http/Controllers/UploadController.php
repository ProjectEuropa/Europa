<?php

namespace App\Http\Controllers;

use App\BusinessService\FileService;
use App\Http\Requests\UploadRequest;

class UploadController extends Controller
{
    private $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    /**
     *
     *
     * @return
     */
    public function teamSimpleUpload(UploadRequest $request)
    {
        // チームアップロードかつ簡易アップロード
        $arrayIsTeamOrNormarUpdate = [
            'isTeam' => \Config::get('const.IS_TEAM_FLG_TRUE'),
            'isNormalUpdate' => \Config::get('const.IS_NORMAL_UPLOAD_FLG_FALSE'),
        ];

        $this->fileService->registerFileData($request, $arrayIsTeamOrNormarUpdate);

        return redirect('/simpleupload')->with('message', 'チームデータのアップロードが完了しました');
    }

    /**
     *
     *
     * @return
     */
    public function matchSimpleUpload(UploadRequest $request)
    {
        // マッチデータアップロードかつ簡易アップロード
        $arrayIsTeamOrNormarUpdate = [
            'isTeam' => \Config::get('const.IS_TEAM_FLG_FALSE'),
            'isNormalUpdate' => \Config::get('const.IS_NORMAL_UPLOAD_FLG_FALSE'),
        ];

        $this->fileService->registerFileData($request, $arrayIsTeamOrNormarUpdate);

        return redirect('/simpleupload')->with('message', 'マッチデータのアップロードが完了しました');
    }

    /**
     *
     *
     * @return
     */
    public function teamUpload(UploadRequest $request)
    {
        // チームアップロードかつ通常アップロード
        $arrayIsTeamOrNormarUpdate = [
            'isTeam' => \Config::get('const.IS_TEAM_FLG_TRUE'),
            'isNormalUpdate' => \Config::get('const.IS_NORMAL_UPLOAD_FLG_TRUE'),
        ];

        $this->fileService->registerFileData($request, $arrayIsTeamOrNormarUpdate);

        return redirect('/upload')->with('message', 'チームデータのアップロードが完了しました');
    }

    /**
     *
     *
     * @return
     */
    public function matchUpload(UploadRequest $request)
    {
        // マッチデータアップロードかつ通常アップロード
        $arrayIsTeamOrNormarUpdate = [
            'isTeam' => \Config::get('const.IS_TEAM_FLG_FALSE'),
            'isNormalUpdate' => \Config::get('const.IS_NORMAL_UPLOAD_FLG_TRUE'),
        ];

        $this->fileService->registerFileData($request, $arrayIsTeamOrNormarUpdate);

        return redirect('/upload')->with('message', 'マッチデータのアップロードが完了しました');
    }
}

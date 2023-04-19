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
     * Upload file data.
     *
     * @param UploadRequest $request
     * @param bool $isTeam
     * @param bool $isNormalUpdate
     * @return \Illuminate\Http\RedirectResponse
     */
    public function upload(UploadRequest $request, bool $isTeam, bool $isNormalUpdate)
    {
        $options = [
            'isTeam' => $isTeam,
            'isNormalUpdate' => $isNormalUpdate,
        ];

        $this->fileService->registerFileData($request, $options);

        $message = ($isTeam ? 'チーム' : 'マッチ') . 'データのアップロードが完了しました';

        return redirect($isNormalUpdate ? '/upload' : '/simpleupload')->with('message', $message);
    }
}

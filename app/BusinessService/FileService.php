<?php

namespace App\BusinessService;

use Auth;
use DB;
use Illuminate\Http\Request;
/*
 * FileService
 * Fileモデルに関わるロジックを記述
 */
class FileService
{
    public function registerFileData(Request $request, array $options)
    {
        $dataType = $options['isTeam'] ? 'team' : 'match';
        $dataTypeId = $dataType === 'team' ? '1' : '2';
        $uploadType = $options['isNormalUpdate'] ? 'normal' : 'simple';

        $file = $request->file("{$dataType}File");
        $fileData = file_get_contents($file);
        $fileName = $file->getClientOriginalName();
        $now = now();
        $uploadUserId = $options['isNormalUpdate'] ? Auth::user()->id : 0;

        $params = [
            'upload_owner_name' => $request->input("{$dataType}OwnerName"),
            'file_comment' => $request->input("{$dataType}Comment"),
            'delete_password' => $request->input("{$dataType}DeletePassWord"),
            'search_tags' => array_pad(explode(',', $request->input("{$dataType}SearchTags")), 4, null),
        ];

        $db = DB::connection('pgsql')->getPdo();
        $stmt = $db->prepare("INSERT INTO files (file_data, upload_type, file_name, upload_owner_name, file_comment, delete_password, data_type, created_at, updated_at, upload_user_id, search_tag1, search_tag2, search_tag3, search_tag4) "
            . "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->bindParam(1, $fileData, $db::PARAM_LOB);
        $stmt->bindParam(2, $uploadType, $db::PARAM_STR);
        $stmt->bindParam(3, $fileName, $db::PARAM_STR);
        $stmt->bindParam(4, $params['upload_owner_name'], $db::PARAM_STR);
        $stmt->bindParam(5, $params['file_comment'], $db::PARAM_STR);
        $stmt->bindParam(6, $params['delete_password'], $db::PARAM_STR);
        $stmt->bindParam(7, $dataTypeId, $db::PARAM_STR);
        $stmt->bindParam(8, $now, $db::PARAM_STR);
        $stmt->bindParam(9, $now, $db::PARAM_STR);
        $stmt->bindParam(10, $uploadUserId, $db::PARAM_INT);
        $stmt->bindParam(11, $params['search_tags'][0], $db::PARAM_STR);
        $stmt->bindParam(12, $params['search_tags'][1], $db::PARAM_STR);
        $stmt->bindParam(13, $params['search_tags'][2], $db::PARAM_STR);
        $stmt->bindParam(14, $params['search_tags'][3], $db::PARAM_STR);

        $stmt->execute();
        unset($db);
    }
}

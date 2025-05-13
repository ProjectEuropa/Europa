<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Resources\Json\JsonResource;

class FileResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                => $this->id,
            'upload_owner_name' => $this->upload_owner_name,
            'file_name'         => $this->file_name,
            'file_comment'      => $this->masked_comment,
            'created_at'        => $this->created_at,
            'upload_user_id'    => $this->upload_user_id,
            'upload_type'       => $this->upload_type,
            'search_tags1'      => $this->search_tag1,
            'search_tags2'      => $this->search_tag2,
            'search_tags3'      => $this->search_tag3,
            'search_tags4'      => $this->search_tag4,
            'downloadable_at'   => $this->downloadable_at,
        ];
    }
}

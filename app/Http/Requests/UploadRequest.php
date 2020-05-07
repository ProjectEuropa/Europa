<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class UploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(Request $re)
    {
        $url = $re->url();

        if (strpos($url, 'team') !== false) {
            //'url'のなかに'team'が含まれている場合
            if (strpos($url, 'simpleupload') !== false) {
                //'url'のなかに'simpleupload'が含まれている場合
                return [
                    'teamOwnerName' => 'required|max:100',
                    'teamComment' => 'required|max:200',
                    'teamDeletePassWord' => 'required|max:100',
                    'teamFile' => 'required|che_file|max:24',
                    'teamSearchTags.*' => 'max:100'
                ];
            } else {
                //'url'のなかに'simpleupload'が含まれてない場合（通常アップロード）
                return [
                    'teamOwnerName' => 'required|max:100',
                    'teamComment' => 'required|max:200',
                    'teamFile' => 'required|che_file|max:24',
                    'teamSearchTags.*' => 'max:100'
                ];
            }
        } else {
            //'url'のなかに'team'が含まれてない場合（match）
            if (strpos($url, 'simpleupload') !== false) {
                //'url'のなかに'simpleupload'が含まれている場合
                return [
                    'matchOwnerName' => 'required|max:100',
                    'matchComment' => 'required|max:200',
                    'matchDeletePassWord' => 'required|max:100',
                    'matchFile' => 'required|che_file|max:260|min:250',
                    'matchSearchTags.*' => 'max:100'
                ];
            } else {
                //'url'のなかに'simpleupload'が含まれてない場合（通常アップロード）
                return [
                    'matchOwnerName' => 'required|max:100',
                    'matchComment' => 'required|max:200',
                    'matchFile' => 'required|che_file|max:260|min:250',
                    'matchSearchTags.*' => 'max:100'
                ];
            }
        }
    }
}

<?php
namespace App\Validation;

class CustomValidator
{
    /**
     * 
     * 拡張子がCHEか否か
     * @param $attribute
     * @param $value
     * @param $parameters
     * @return bool
     */
    public function validateCheFile($attribute, $value, $parameters) {
        // ファイルから拡張子を抽出
        $fileName = $value->getClientOriginalName();
        $extension = \File::extension($fileName);
        if ($extension === 'CHE') {
            return true;  
        }
        return false;
    }
}
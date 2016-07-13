<?php

namespace App\Validation;
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
    public function validateNoCheFile($attribute, $value, $parameters) {

        // ファイルから拡張子を抽出
        $fileName = $value->getClientOriginalName();
        $extension = \File::extension($fileName);
        if ($extension == 'CHE') {
            return true;  
        }

        return false;
    }
}


<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;

class UploadController extends Controller {

    //
    public function index() {
        return view('upload.index');
    }

}

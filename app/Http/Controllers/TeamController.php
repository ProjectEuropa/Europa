<?php

namespace App\Http\Controllers;

use App\Team;

use Illuminate\Http\Request;

use App\Http\Requests;

class TeamController extends Controller
{
    //
  public function index() {
    //teamテーブルのデータをすべて取得する
    $teams = Team::orderBy('id', 'asc')->get();
    return view('team.index', [
        'teams' => $teams
    ]);
  }
  
  
}

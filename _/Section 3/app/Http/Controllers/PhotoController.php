<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Photo;
use \App\Events\NewPhoto;

class PhotoController extends Controller
{
    public function index(Request $request) {
        return Photo::all();
    }

    public function store(Request $request) {
        $path = $request->file->store('public');
        $path = str_replace('public/', '', $path);

        $photo = new Photo;
        $photo->filePath = $path;
        $photo->name = $request->file->getClientOriginalName();
        $photo->save();

        broadcast(new NewPhoto($photo));

        return $photo->toJson();
    }
}

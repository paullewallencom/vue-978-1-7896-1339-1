<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Chat;
use App\Events\NewChatMessage;

class ChatController extends Controller
{
    public function index(Request $request) {
        return Chat::all();
    }

    public function add(Request $request) {
        $cm = new Chat;
        $cm->text = $request->text;
        $cm->save();

        broadcast(new NewChatMessage($cm));

        return $cm;
    }
}

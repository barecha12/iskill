<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class ConversationController extends Controller
{
    public function index(): JsonResponse
    {
        $authUser = request()->user();

        $conversations = User::query()
            ->with('profile')
            ->whereKeyNot($authUser->id)
            ->orderBy('name')
            ->get()
            ->map(function (User $user) use ($authUser) {
                $latestMessage = Message::query()
                    ->with('attachments')
                    ->where(function ($query) use ($authUser, $user) {
                        $query->where('sender_id', $authUser->id)
                            ->where('receiver_id', $user->id);
                    })
                    ->orWhere(function ($query) use ($authUser, $user) {
                        $query->where('sender_id', $user->id)
                            ->where('receiver_id', $authUser->id);
                    })
                    ->latest()
                    ->first();

                $unreadCount = Message::query()
                    ->where('sender_id', $user->id)
                    ->where('receiver_id', $authUser->id)
                    ->whereNull('read_at')
                    ->count();

                return [
                    'user' => $user,
                    'last_message' => $latestMessage,
                    'unread_count' => $unreadCount,
                ];
            })
            ->sortByDesc(fn (array $conversation) => optional($conversation['last_message'])->created_at)
            ->values();

        return response()->json($conversations);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MessageController extends Controller
{
    private const ALLOWED_FILE_TYPES = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/png',
        'image/jpeg',
        'application/zip',
        'application/x-zip-compressed',
    ];

    public function index(User $user): JsonResponse
    {
        $authUser = request()->user();

        $messages = Message::query()
            ->with(['sender.profile', 'receiver.profile', 'attachments'])
            ->where(function ($query) use ($authUser, $user) {
                $query->where('sender_id', $authUser->id)
                    ->where('receiver_id', $user->id);
            })
            ->orWhere(function ($query) use ($authUser, $user) {
                $query->where('sender_id', $user->id)
                    ->where('receiver_id', $authUser->id);
            })
            ->orderBy('created_at')
            ->get();

        Message::query()
            ->where('sender_id', $user->id)
            ->where('receiver_id', $authUser->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json($messages);
    }

    public function store(Request $request): JsonResponse
    {
        return $this->persistMessage($request, false);
    }

    public function storeAttachment(Request $request): JsonResponse
    {
        return $this->persistMessage($request, true);
    }

    public function downloadAttachment(MessageAttachment $attachment): StreamedResponse
    {
        $authUser = request()->user();
        $message = $attachment->message;

        abort_unless(
            in_array($authUser->id, [$message->sender_id, $message->receiver_id], true),
            403,
            'You are not allowed to access this attachment.'
        );

        abort_unless(Storage::disk('local')->exists($attachment->file_path), 404, 'File not found.');

        return Storage::disk('local')->download($attachment->file_path, $attachment->original_name);
    }

    private function persistMessage(Request $request, bool $attachmentRequired): JsonResponse
    {
        $validated = $request->validate([
            'receiver_id' => ['required', 'integer', 'exists:users,id'],
            'message' => ['nullable', 'string', $attachmentRequired ? 'sometimes' : 'required_without:attachment'],
            'attachment' => [$attachmentRequired ? 'required' : 'nullable', 'file', 'max:10240', 'mimetypes:'.implode(',', self::ALLOWED_FILE_TYPES)],
        ]);

        abort_if((int) $validated['receiver_id'] === $request->user()->id, 422, 'You cannot message yourself.');
        abort_if(empty($validated['message']) && ! isset($validated['attachment']), 422, 'A message or attachment is required.');

        $message = DB::transaction(function () use ($request, $validated) {
            $message = Message::create([
                'sender_id' => $request->user()->id,
                'receiver_id' => $validated['receiver_id'],
                'message' => $validated['message'] ?? null,
            ]);

            if (isset($validated['attachment'])) {
                $file = $validated['attachment'];
                $path = $file->store('messages', 'local');

                $message->attachments()->create([
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
            }

            return $message->load(['sender.profile', 'receiver.profile', 'attachments']);
        });

        return response()->json($message, 201);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users(): JsonResponse
    {
        $users = User::with('profile')->latest()->get();
        return response()->json($users);
    }

    public function toggleAdmin(User $user): JsonResponse
    {
        // Prevent admins from removing their own admin status (safety)
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'You cannot modify your own administrative status.'], 403);
        }

        $user->update(['is_admin' => !$user->is_admin]);

        return response()->json([
            'message' => $user->is_admin ? 'User promoted to Administrator.' : 'User administrative access revoked.',
            'user' => $user->load('profile'),
        ]);
    }

    public function documents(): JsonResponse
    {
        $documents = \App\Models\Document::with('uploader.profile')->latest()->get();
        return response()->json($documents);
    }

    public function updateUserCompliance(Request $request, User $user): JsonResponse
    {
        $request->validate(['status' => 'required|string|in:compliant,under_review,flagged']);
        $user->update(['compliance_status' => $request->status]);

        return response()->json([
            'message' => "User compliance status updated to {$request->status}.",
            'user' => $user->load('profile'),
        ]);
    }

    public function updateDocumentCompliance(Request $request, \App\Models\Document $document): JsonResponse
    {
        $request->validate(['status' => 'required|string|in:compliant,under_review,flagged']);
        $document->update(['compliance_status' => $request->status]);

        return response()->json([
            'message' => "Document compliance status updated to {$request->status}.",
            'document' => $document->load('uploader.profile'),
        ]);
    }

    public function announcements(): JsonResponse
    {
        $announcements = \App\Models\Announcement::with(['user.profile', 'readByUsers'])->latest()->get();
        return response()->json($announcements);
    }

    public function markAnnouncementRead(\App\Models\Announcement $announcement): JsonResponse
    {
        $announcement->readByUsers()->syncWithoutDetaching([auth()->id()]);
        return response()->json(['message' => 'Signal acknowledged.']);
    }

    public function storeAnnouncement(Request $request): JsonResponse
    {
        $request->validate(['content' => 'required|string|max:1000']);
        
        $announcement = \App\Models\Announcement::create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        return response()->json([
            'message' => 'System signal dispatched successfully.',
            'announcement' => $announcement->load('user.profile'),
        ]);
    }

    public function deleteUser(User $user): JsonResponse
    {
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'You cannot delete your own account from the console.'], 403);
        }

        // Delete user's documents from storage
        foreach ($user->documents as $doc) {
            \Illuminate\Support\Facades\Storage::disk('local')->delete($doc->file_path);
            $doc->delete();
        }

        $user->delete();

        return response()->json(['message' => 'User account and associated assets purged.']);
    }
}

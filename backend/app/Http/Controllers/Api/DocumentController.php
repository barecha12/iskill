<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
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

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $documents = Document::query()
            ->with('uploader.profile')
            ->latest()
            ->get()
            ->filter(function ($doc) use ($user) {
                // Admins see everything
                if ($user->is_admin) return true;
                // Owner always sees their own documents (with status badge)
                if ($doc->uploaded_by === $user->id) return true;
                // Everyone else only sees compliant documents
                return $doc->compliance_status === 'compliant' || $doc->compliance_status === null;
            })
            ->values();

        return response()->json($documents);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'file' => ['required', 'file', 'max:10240', 'mimetypes:' . implode(',', self::ALLOWED_FILE_TYPES)],
        ]);

        $file = $validated['file'];
        $path = $file->store('documents', 'local');

        $document = Document::create([
            'uploaded_by' => $request->user()->id,
            'title' => $validated['title'] ?: Str::beforeLast($file->getClientOriginalName(), '.'),
            'file_path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'compliance_status' => 'under_review',
        ])->load('uploader.profile');

        return response()->json($document, 201);
    }

    public function download(Request $request, Document $document): StreamedResponse
    {
        // Allow token in query string for browser downloads/inspection
        if ($request->has('token')) {
            $request->headers->set('Authorization', 'Bearer ' . $request->query('token'));
        }

        // Check if file exists on disk
        if (!Storage::disk('local')->exists($document->file_path)) {
            abort(404, 'The physical file was not found on the server. It may have been deleted during a deployment.');
        }

        return Storage::disk('local')->download($document->file_path, $document->original_name);
    }

    public function destroy(Request $request, Document $document): JsonResponse
    {
        abort_unless($document->uploaded_by === $request->user()->id || $request->user()->is_admin, 403, 'Unauthorized access.');

        Storage::disk('local')->delete($document->file_path);
        $document->delete();

        return response()->json([
            'message' => 'Document deleted.',
        ]);
    }
}

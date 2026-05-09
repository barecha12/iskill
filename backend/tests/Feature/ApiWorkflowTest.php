<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_log_in_and_fetch_profile(): void
    {
        $user = User::factory()->create([
            'email' => 'teammate@example.com',
            'password' => 'password',
        ]);

        $user->profile()->create([
            'department' => 'Engineering',
            'title' => 'Engineer',
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'email' => 'teammate@example.com',
            'password' => 'password',
        ]);

        $loginResponse
            ->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'profile']]);

        $token = $loginResponse->json('token');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('email', 'teammate@example.com')
            ->assertJsonPath('profile.department', 'Engineering');
    }

    public function test_authenticated_user_can_list_people_and_conversations(): void
    {
        $authUser = User::factory()->create();
        $coworker = User::factory()->create(['name' => 'Alex Coworker']);
        $coworker->profile()->create(['department' => 'Product', 'title' => 'PM']);

        Message::create([
            'sender_id' => $coworker->id,
            'receiver_id' => $authUser->id,
            'message' => 'Can you review the spec?',
        ]);

        Sanctum::actingAs($authUser);

        $this->getJson('/api/users')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Alex Coworker']);

        $this->getJson('/api/conversations')
            ->assertOk()
            ->assertJsonPath('0.user.name', 'Alex Coworker')
            ->assertJsonPath('0.unread_count', 1);
    }

    public function test_authenticated_user_can_upload_and_delete_document(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->post('/api/documents', [
            'title' => 'Operations Manual',
            'file' => UploadedFile::fake()->create('manual.pdf', 120, 'application/pdf'),
        ]);

        $response->assertCreated()->assertJsonPath('title', 'Operations Manual');

        $document = Document::firstOrFail();
        Storage::disk('local')->assertExists($document->file_path);

        $this->deleteJson('/api/documents/'.$document->id)
            ->assertOk()
            ->assertJsonPath('message', 'Document deleted.');

        Storage::disk('local')->assertMissing($document->file_path);
    }

    public function test_authenticated_user_can_send_and_fetch_message_with_attachment(): void
    {
        Storage::fake('local');

        $sender = User::factory()->create();
        $receiver = User::factory()->create();

        Sanctum::actingAs($sender);

        $sendResponse = $this->post('/api/messages/attachment', [
            'receiver_id' => $receiver->id,
            'message' => 'Sharing the latest file.',
            'attachment' => UploadedFile::fake()->create('update.zip', 150, 'application/zip'),
        ]);

        $sendResponse
            ->assertCreated()
            ->assertJsonPath('receiver_id', $receiver->id)
            ->assertJsonPath('attachments.0.original_name', 'update.zip');

        Sanctum::actingAs($receiver);

        $messagesResponse = $this->getJson('/api/messages/'.$sender->id);
        $attachmentId = $messagesResponse->json('0.attachments.0.id');

        $messagesResponse
            ->assertOk()
            ->assertJsonPath('0.message', 'Sharing the latest file.');

        $this->get('/api/messages/attachments/'.$attachmentId.'/download')
            ->assertOk();
    }
}

<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password');

        $users = collect([
            ['name' => 'Amina Njoroge', 'email' => 'amina@iskill.local', 'department' => 'Operations', 'title' => 'Operations Lead'],
            ['name' => 'Brian Otieno', 'email' => 'brian@iskill.local', 'department' => 'Engineering', 'title' => 'Frontend Engineer'],
            ['name' => 'Carla Mensah', 'email' => 'carla@iskill.local', 'department' => 'People', 'title' => 'HR Partner'],
            ['name' => 'Daniel Kimani', 'email' => 'daniel@iskill.local', 'department' => 'Finance', 'title' => 'Finance Manager'],
            ['name' => 'Esther Mwangi', 'email' => 'esther@iskill.local', 'department' => 'Product', 'title' => 'Product Manager'],
        ])->map(function (array $data) use ($password) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                ['name' => $data['name'], 'password' => $password]
            );

            $user->profile()->updateOrCreate(
                ['user_id' => $user->id],
                ['department' => $data['department'], 'title' => $data['title']]
            );

            return $user;
        })->values();

        $sampleDocuments = [
            ['title' => 'Team Handbook', 'name' => 'team-handbook.pdf', 'mime' => 'application/pdf', 'body' => "Iskill Team Handbook\n\nWelcome to the internal workspace."],
            ['title' => 'Q2 Planning', 'name' => 'q2-planning.docx', 'mime' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'body' => 'Q2 planning notes and ownership summary.'],
            ['title' => 'Budget Snapshot', 'name' => 'budget-snapshot.xlsx', 'mime' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'body' => "Department,Budget\nOperations,125000"],
        ];

        foreach ($sampleDocuments as $index => $documentData) {
            $path = 'seed/documents/'.$documentData['name'];
            Storage::disk('local')->put($path, $documentData['body']);

            Document::updateOrCreate(
                ['title' => $documentData['title']],
                [
                    'uploaded_by' => $users[$index]->id,
                    'file_path' => $path,
                    'original_name' => $documentData['name'],
                    'mime_type' => $documentData['mime'],
                    'size' => Storage::disk('local')->size($path),
                ]
            );
        }

        Message::query()->delete();

        Message::create([
            'sender_id' => $users[0]->id,
            'receiver_id' => $users[1]->id,
            'message' => 'Morning. Can you share the updated onboarding notes in Documents?',
            'created_at' => now()->subHours(5),
            'updated_at' => now()->subHours(5),
            'read_at' => now()->subHours(4),
        ]);

        Message::create([
            'sender_id' => $users[1]->id,
            'receiver_id' => $users[0]->id,
            'message' => 'Done. I also uploaded the planning draft for review.',
            'created_at' => now()->subHours(4),
            'updated_at' => now()->subHours(4),
            'read_at' => now()->subHours(3),
        ]);

        $attachmentPath = 'seed/messages/workshop-pack.zip';
        Storage::disk('local')->put($attachmentPath, 'Workshop pack placeholder');

        $messageWithAttachment = Message::create([
            'sender_id' => $users[4]->id,
            'receiver_id' => $users[0]->id,
            'message' => 'Attaching the latest workshop pack here.',
            'created_at' => now()->subHours(2),
            'updated_at' => now()->subHours(2),
        ]);

        $messageWithAttachment->attachments()->create([
            'file_path' => $attachmentPath,
            'original_name' => 'workshop-pack.zip',
            'mime_type' => 'application/zip',
            'size' => Storage::disk('local')->size($attachmentPath),
        ]);

        Message::create([
            'sender_id' => $users[2]->id,
            'receiver_id' => $users[3]->id,
            'message' => 'Please review the revised leave policy before lunch.',
            'created_at' => now()->subHour(),
            'updated_at' => now()->subHour(),
        ]);
    }
}

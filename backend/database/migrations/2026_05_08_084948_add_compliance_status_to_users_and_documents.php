<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $blueprint) {
            $blueprint->string('compliance_status')->default('compliant'); // compliant, under_review, flagged
        });

        Schema::table('documents', function (Blueprint $blueprint) {
            $blueprint->string('compliance_status')->default('compliant'); // compliant, under_review, flagged
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $blueprint) {
            $blueprint->dropColumn('compliance_status');
        });

        Schema::table('documents', function (Blueprint $blueprint) {
            $blueprint->dropColumn('compliance_status');
        });
    }
};

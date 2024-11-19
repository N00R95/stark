<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        try {
            // Drop existing indexes using raw SQL to avoid errors if they don't exist
            DB::statement('DROP INDEX IF EXISTS profiles_phone_unique ON profiles');
            DB::statement('DROP INDEX IF EXISTS profiles_phone_type_unique ON profiles');

            // Add new composite unique index
            Schema::table('profiles', function (Blueprint $table) {
                $table->unique(['phone', 'type'], 'profiles_phone_type_unique');
            });

        } catch (\Exception $e) {
            \Log::error('Migration failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            try {
                // Drop the composite unique index
                DB::statement('DROP INDEX IF EXISTS profiles_phone_type_unique ON profiles');

                // Restore single column unique index
                $table->unique('phone', 'profiles_phone_unique');
            } catch (\Exception $e) {
                \Log::error('Migration rollback failed:', [
                    'error' => $e->getMessage()
                ]);
            }
        });
    }
};

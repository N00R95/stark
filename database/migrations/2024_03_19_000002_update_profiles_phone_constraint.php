<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // First, check if the profiles table exists
        if (Schema::hasTable('profiles')) {
            // Drop existing indexes safely
            Schema::table('profiles', function (Blueprint $table) {
                try {
                    $sm = Schema::getConnection()->getDoctrineSchemaManager();
                    $indexes = $sm->listTableIndexes('profiles');

                    // Drop any existing phone-related indexes
                    if (isset($indexes['profiles_phone_unique'])) {
                        $table->dropUnique('profiles_phone_unique');
                    }
                    if (isset($indexes['profiles_phone_type_unique'])) {
                        $table->dropUnique('profiles_phone_type_unique');
                    }
                } catch (\Exception $e) {
                    \Log::error('Failed to drop indexes:', [
                        'error' => $e->getMessage()
                    ]);
                }
            });

            // Add new composite unique index
            Schema::table('profiles', function (Blueprint $table) {
                try {
                    $table->unique(['phone', 'type'], 'profiles_phone_type_unique');
                } catch (\Exception $e) {
                    \Log::error('Failed to add new index:', [
                        'error' => $e->getMessage()
                    ]);
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('profiles')) {
            Schema::table('profiles', function (Blueprint $table) {
                try {
                    // Drop composite index
                    $table->dropUnique('profiles_phone_type_unique');

                    // Restore single column unique index
                    $table->unique('phone', 'profiles_phone_unique');
                } catch (\Exception $e) {
                    \Log::error('Failed to restore indexes:', [
                        'error' => $e->getMessage()
                    ]);
                }
            });
        }
    }
};

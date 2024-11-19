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
        try {
            // First check if the old unique index exists
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexes = $sm->listTableIndexes('profiles');

            Schema::table('profiles', function (Blueprint $table) use ($indexes) {
                // Only drop if the old unique index exists
                if (isset($indexes['profiles_phone_unique'])) {
                    $table->dropUnique('profiles_phone_unique');
                }

                // Add new composite unique index if it doesn't exist
                if (!isset($indexes['profiles_phone_type_unique'])) {
                    $table->unique(['phone', 'type'], 'profiles_phone_type_unique');
                }
            });
        } catch (\Exception $e) {
            // Log the error but don't throw it
            \Log::error('Migration failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Drop the composite unique index
            $table->dropUnique('profiles_phone_type_unique');

            // Restore single column unique index
            $table->unique('phone', 'profiles_phone_unique');
        });
    }
};

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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id');
            $table->string('title');
            $table->text('description');
            $table->enum('type', ["apartment","villa","floor","office"])->default('apartment');
            $table->double('price');
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->integer('area');
            $table->string('location');
            $table->date('year_built');
            $table->integer('year');
            $table->enum('furnished', ["furnished","unfurnished"])->default('furnished');
            $table->enum('booking_status', ["booked","unbooked"])->default('unbooked');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};

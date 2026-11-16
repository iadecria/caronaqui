<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rides', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('driver_id');

            // Origem
            $table->string('origin_city');
            $table->string('origin_state', 2);
            $table->string('origin_neighborhood')->nullable();
            $table->string('origin_meeting_point')->nullable();
            $table->decimal('origin_lat', 10, 7)->nullable();
            $table->decimal('origin_lng', 10, 7)->nullable();

            // Destino
            $table->string('destination_city');
            $table->string('destination_state', 2);
            $table->string('destination_neighborhood')->nullable();
            $table->string('destination_dropoff_point')->nullable();
            $table->decimal('destination_lat', 10, 7)->nullable();
            $table->decimal('destination_lng', 10, 7)->nullable();

            // Data/Hora
            $table->date('date');
            $table->time('time');

            // Detalhes
            $table->decimal('price', 8, 2);
            $table->integer('available_seats');
            $table->integer('total_seats');
            $table->string('car_model');
            $table->string('car_color');

            // Configuracoes
            $table->boolean('allows_pets')->default(false);
            $table->boolean('allows_smoking')->default(false);
            $table->boolean('allows_luggage')->default(true);
            $table->boolean('has_ac')->default(true);
            $table->boolean('ladies_only')->default(false);

            // Viagem regular
            $table->boolean('is_regular')->default(false);
            $table->json('weekdays')->nullable();

            $table->text('description')->nullable();
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
            $table->timestamps();

            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rides');
    }
};

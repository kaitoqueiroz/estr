<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAtendimentosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('atendimento', function(Blueprint $table) {
            $table->increments('id');
            $table->string('outro_dia')->nullable;
            $table->string('motivo');
            $table->integer('produto_id')->unsigned();
            $table->foreign('produto_id')->references('id')->on('produto')->onDelete('cascade');
            $table->integer('vendedor_id')->unsigned();
            $table->foreign('vendedor_id')->references('id')->on('vendedor')->onDelete('cascade');
            $table->timestamps();
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('atendimento');
	}

}

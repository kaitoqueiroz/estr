<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMensagemsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('mensagem', function(Blueprint $table) {
            $table->increments('id');
            $table->text('mensagem');
            $table->integer('vendedor_id')->unsigned();
            $table->foreign('vendedor_id')->references('id')->on('vendedor');
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
		Schema::drop('mensagem');
	}

}

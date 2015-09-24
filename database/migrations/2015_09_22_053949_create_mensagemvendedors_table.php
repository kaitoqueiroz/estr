<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMensagemVendedorsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('mensagemvendedor', function(Blueprint $table) {
            $table->increments('id');
            $table->integer('mensagem_id')->unsigned();
            $table->foreign('mensagem_id')->references('id')->on('mensagem');
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
		Schema::drop('mensagemvendedor');
	}

}

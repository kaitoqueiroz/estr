<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\ProdutoRequest;
use App\Http\Controllers\Controller;

use DB;
use App\Produto;
use Illuminate\Http\Request;

class ProdutoController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(Request $request)
	{
		$take = $request->input('itensPorPagina');
		$pagina = $request->input('pagina');
		$orderBy = $request->input('orderBy');
		$orderByField = $request->input('orderByField');
		$skip = $take*$pagina;
		$qb = DB::table('produto');
		if($take){
			$qb = $qb->take($take);
		}
		if($skip){
			$qb = $qb->skip($skip);
		}
		if($orderByField && $orderBy){
			$qb = $qb->orderBy($orderByField, $orderBy);
		}
		$list = $qb->get();

		return response()->json($list);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return Response
	 */
	public function store(ProdutoRequest $request)
	{
		$produto = new Produto();

		$produto->cod_produto = $request->input("cod_produto");
        $produto->descricao = $request->input("descricao");
        $produto->valor = $request->input("valor");

		$produto->save();

		return response()->json($produto);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$produto = Produto::findOrFail($id);

		return response()->json($produto);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function update(ProdutoRequest $request, $id)
	{
		$produto = Produto::findOrFail($id);

        $produto->cod_produto = $request->input("cod_produto");
        $produto->descricao = $request->input("descricao");
        $produto->valor = $request->input("valor");

		$produto->save();

		return response()->json($produto);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$produto = Produto::findOrFail($id);
		$produto->delete();

		return response()->json(array());
	}

}

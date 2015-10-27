<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\VendedorRequest;
use App\Http\Controllers\Controller;

use DB;
use App\Vendedor;
use App\Filial;
use Illuminate\Http\Request;

class VendedorController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(Request $request)
	{
		$take = $request->input('itensPorPagina');
		$filial = "";
		if(isset($_COOKIE['filial'])){
			$filial = $_COOKIE['filial'];
		}
		$pagina = $request->input('pagina');
		$orderBy = $request->input('orderBy');
		$orderByField = $request->input('orderByField');

		$skip = $take*$pagina;
		$qb = DB::table('vendedor')
            ->join('filial', 'filial.id', '=', 'vendedor.filial_id')
            ->select('vendedor.*', 'filial.nome as nome_filial');
		if($filial){
			$qb = $qb->where("filial_id","=",$filial);
		}
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
	public function store(VendedorRequest $request)
	{
		$vendedor = new Vendedor();
        $vendedor->nome = $request->input("nome");
        $vendedor->login = $request->input("login");
        $vendedor->senha = $request->input("senha");
        $vendedor->filial_id = $request->input("filial")["id"];

		$vendedor->save();

		return response()->json($vendedor);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$vendedor = Vendedor::findOrFail($id);
		$vendedor["filial"] = Filial::findOrFail($vendedor["filial_id"]);
		$filiais = Filial::all();

		return response()->json($vendedor);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function update(VendedorRequest $request, $id)
	{
		$vendedor = Vendedor::findOrFail($id);

        $vendedor->nome = $request->input("nome");
        $vendedor->login = $request->input("login");
        $vendedor->senha = $request->input("senha");
        $vendedor->filial_id = $request->input("filial")["id"];

		$vendedor->save();

		return response()->json($vendedor);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$vendedor = Vendedor::findOrFail($id);
		$vendedor->delete();

		return response()->json(array());
	}

}

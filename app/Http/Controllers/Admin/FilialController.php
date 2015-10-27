<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\FilialRequest;
use App\Http\Controllers\Controller;

use DB;
use App\Filial;
use Illuminate\Http\Request;

class FilialController extends Controller {

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
		$qb = DB::table('filial');
		$filial = "";
        if(isset($_COOKIE['filial'])){
            $filial = $_COOKIE['filial'];
        }
        if($filial){
            $qb = $qb->where("id","=",$filial);
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
	public function store(FilialRequest $request)
	{
		$filial = new Filial();
        $filial->nome = $request->input("nome");

		$filial->save();

		return response()->json($filial);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$filial = Filial::findOrFail($id);

		return response()->json($filial);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function update(FilialRequest $request, $id)
	{
		$filial = Filial::findOrFail($id);

        $filial->nome = $request->input("nome");

		$filial->save();

		return response()->json($filial);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$filial = Filial::findOrFail($id);
		$filial->delete();

		return response()->json(array());
	}

}

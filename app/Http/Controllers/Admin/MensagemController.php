<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\MensagemRequest;
use App\Http\Controllers\Controller;

use DB;
use App\Mensagem;
use Illuminate\Http\Request;

class MensagemController extends Controller {

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
		$qb = DB::table('mensagem')
            ->join('vendedor', 'vendedor.id', '=', 'mensagem.vendedor_id')
            ->select('mensagem.*', 'vendedor.nome as nome_vendedor');
        $filial = "";
        if(isset($_COOKIE['filial'])){
            $filial = $_COOKIE['filial'];
        }
        if($filial){
            $qb = $qb->where("vendedor.filial_id","=",$filial);
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
		$qb = $qb->groupBy("mensagem.vendedor_id");
		$list = $qb->get();

		return response()->json($list);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return Response
	 */
	public function store(MensagemRequest $request)
	{
		$mensagem = new Mensagem();
        $mensagem->mensagem = $request->input("mensagem");
        $mensagem->sender = 'admin';
        $mensagem->vendedor_id = $request->input("vendedor_id")["id"];

		$mensagem->save();

		return response()->json($mensagem);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$qb = DB::table('mensagem')
            ->join('vendedor', 'vendedor.id', '=', 'mensagem.vendedor_id')
            ->select('mensagem.*', 'vendedor.nome as nome_vendedor');

        $qb = $qb->where("vendedor.id","=",$id);
        $mensagens = $qb->get();

		return response()->json($mensagens);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function update(MensagemRequest $request, $id)
	{
		$mensagem = Mensagem::findOrFail($id);

        $mensagem->mensagem = $request->input("mensagem");
        $mensagem->vendedor_id = $request->input("vendedor_id")["id"];

		$mensagem->save();

		return response()->json($mensagem);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$mensagem = Mensagem::findOrFail($id);
		$mensagem->delete();

		return response()->json(array());
	}

}

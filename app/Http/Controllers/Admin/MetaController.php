<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\MetaRequest;
use App\Http\Controllers\Controller;

use DB;
use App\Meta;
use App\Vendedor;
use App\Filial;
use App\ProdutoMeta;
use Illuminate\Http\Request;

class MetaController extends Controller {

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
		$qb = DB::table('meta')
            ->join('vendedor', 'vendedor.id', '=', 'meta.vendedor_id')
            ->select('meta.*', 'vendedor.nome as nome_vendedor');
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
	public function store(MetaRequest $request)
	{
		$meta = new Meta();
        $meta->tipo = $request->input("tipo")["id"];
        

        $meta->data = null;
        if($request->input("data")){
	        $data_dia = substr($request->input("data"),0,2);
	        $data_mes = substr($request->input("data"),2,2);
	        $data_ano = substr($request->input("data"),-4);
        	$meta->data = $data_ano."-".$data_mes."-".$data_dia;
		}
        $meta->mes = null;
        if($request->input("mes")){
	        $mes_mes = substr($request->input("mes"),0,2);
	        $mes_ano = substr($request->input("mes"),-4);
        	$meta->mes = $mes_mes."-".$mes_ano;
        }

        $meta->valor = $request->input("valor");
        $meta->vendedor_id = $request->input("vendedor_id")["id"];
        $produtos_meta = $request->input("produtos_meta");

		$meta->save();
        foreach ($produtos_meta as $key => $produto_meta) {
        	$produtoMeta = new ProdutoMeta();
			$produtoMeta->meta_id = $meta->id;
			$produtoMeta->produto_id = $produto_meta["id"];
			$produtoMeta->quantidade = $produto_meta["quantidade"];
			$produtoMeta->save();
        }

		return response()->json($meta);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$meta = Meta::findOrFail($id);

		$meta->vendedor_id = Vendedor::findOrFail($meta->vendedor_id);
		$meta->filial = Filial::findOrFail($meta->vendedor_id->filial_id);

		$meta->produtos_meta = DB::table('produtometa')
			->join('produto', 'produto.id', '=', 'produtometa.produto_id')
			->where('meta_id','=',$meta->id)->get();

		return response()->json($meta);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function update(MetaRequest $request, $id)
	{
		$meta = Meta::findOrFail($id);

        $meta->tipo = $request->input("tipo")["id"];
        
        $meta->data = null;
        if($request->input("data")){
	        $data_dia = substr($request->input("data"),0,2);
	        $data_mes = substr($request->input("data"),2,4);
	        $data_ano = substr($request->input("data"),-4);
        	$meta->data = $data_ano."-".$data_mes.".".$data_dia;
		}
        $meta->mes = null;
        if($request->input("mes")){
	        $mes_mes = substr($request->input("mes"),0,2);
	        $mes_ano = substr($request->input("mes"),-4);
        	$meta->mes = $mes_ano."-".$mes_mes;
        }



        $meta->valor = $request->input("valor");
        $meta->vendedor_id = $request->input("vendedor_id")["id"];
        $produtos_meta = $request->input("produtos_meta");

		$meta->save();

		DB::table('produtometa')->where('meta_id', '=', $meta->id)->delete();
        foreach ($produtos_meta as $key => $produto_meta) {
        	$produtoMeta = new ProdutoMeta();
			$produtoMeta->meta_id = $meta->id;
			$produtoMeta->produto_id = $produto_meta["id"];
			$produtoMeta->quantidade = $produto_meta["quantidade"];
			$produtoMeta->save();
        }

		return response()->json($meta);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$meta = Meta::findOrFail($id);
		$meta->delete();

		return response()->json(array());
	}

}

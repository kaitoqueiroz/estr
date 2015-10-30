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

        $meta->de = null;
        if($request->input("de")){
	        $de_dia = substr($request->input("de"),0,2);
	        $de_mes = substr($request->input("de"),2,2);
	        $de_ano = substr($request->input("de"),-4);
        	$meta->de = $de_ano."-".$de_mes."-".$de_dia;
		}
        $meta->ate = null;
        if($request->input("ate")){
            $ate_dia = substr($request->input("ate"),0,2);
            $ate_mes = substr($request->input("ate"),2,2);
            $ate_ano = substr($request->input("ate"),-4);
            $meta->ate = $ate_ano."-".$ate_mes."-".$ate_dia;
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

        $meta->de = null;
        if($request->input("de")){
            $de_dia = substr($request->input("de"),0,2);
            $de_mes = substr($request->input("de"),2,2);
            $de_ano = substr($request->input("de"),-4);
            $meta->de = $de_ano."-".$de_mes."-".$de_dia;
        }
        $meta->ate = null;
        if($request->input("ate")){
            $ate_dia = substr($request->input("ate"),0,2);
            $ate_mes = substr($request->input("ate"),2,2);
            $ate_ano = substr($request->input("ate"),-4);
            $meta->ate = $ate_ano."-".$ate_mes."-".$ate_dia;
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


	public function metaValorDiario(){
		$metas = Meta::where("tipo","valor_diaria")->get();
		return response()->json($metas);
	}
	public function metaValorAll(){

		$metas_diario = Meta::where("tipo","valor_diaria")->get();
		$metas_mensal = Meta::where("tipo","valor_mensal")->get();
		$metas = ['metas_diario'=>$metas_diario,'metas_mensal'=>$metas_mensal];
		return response()->json($metas);
	}


    public function metas(Request $request)
    {
        $take = $request->input('itensPorPagina');
        $de = $request->input('de');
        $ate = $request->input('ate');
        $pagina = $request->input('pagina');
        $orderBy = $request->input('orderBy');
        $orderByField = $request->input('orderByField');
        $tipo = $request->input('tipo');

        $skip = $take*$pagina;
        $qb = DB::table('meta')
            ->leftJoin('produtometa', 'produtometa.meta_id', '=', 'meta.id')
            ->leftJoin('produto', 'produto.id', '=', 'produtometa.produto_id')
            ->leftJoin('produtovenda', 'produtovenda.produto_id', '=', 'produto.id')
            ->leftJoin('venda',function($join){
                {
                    $join->on('venda.data', '=', 'meta.data')
                         ->where('meta.vendedor_id', '=', 'venda.vendedor_id');
                }
            })
            ->join('vendedor', 'vendedor.id', '=', 'meta.vendedor_id')
            ->join('filial', 'filial.id', '=', 'vendedor.filial_id')
            ->select(
                DB::raw('coalesce(sum(produtometa.quantidade)*produto.valor,meta.valor) as valor_total'),
                DB::raw('coalesce(sum(produtovenda.quantidade)*produto.valor,0) as valor_atingido'),
                'meta.*', 'vendedor.nome as nome_vendedor', 'filial.nome as nome_filial');
        if($tipo){
            $qb = $qb->where('meta.tipo', '=', $tipo);
        }
        if($de && $ate){
            $qb = $qb->whereBetween('meta.data', array($de, $ate));
        }
        $dados_totais = $qb->get();
        $valor_total_meta = 0;
        foreach ($dados_totais as $key => $meta) {
            $valor_total_meta+=$meta->valor_total;
        }
        $valor_total_atingido = 0;
        foreach ($dados_totais as $key => $venda) {
            $valor_total_atingido+=$venda->valor_atingido;
        }

        if($take){
            $qb = $qb->take($take);
        }
        if($skip){
            $qb = $qb->skip($skip);
        }
        $qb->groupBy('meta.id');
        if($orderByField && $orderBy){
            $qb = $qb->orderBy($orderByField, $orderBy);
        }
        $list = $qb->get();

        return response()->json(array('list'=>$list,'valor_total_meta'=>$valor_total_meta,'valor_total_atingido'=>$valor_total_atingido));
    }

}

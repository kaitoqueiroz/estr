<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\MetaRequest;
use App\Http\Controllers\Controller;

use DB;
use App\Meta;
use App\Vendedor;
use App\Filial;
use App\Venda;
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
        $vendedor_id = $request->input('vendedor_id');
        $pagina = $request->input('pagina');
        $orderBy = $request->input('orderBy');
        $orderByField = $request->input('orderByField');

        $skip = $take*$pagina;
        $qb = DB::table('meta')
            ->join('produtometa', 'produtometa.meta_id', '=', 'meta.id')
            ->join('produto', 'produto.id', '=', 'produtometa.produto_id')
            ->join('vendedor', 'vendedor.id', '=', 'meta.vendedor_id')
            ->join('filial', 'filial.id', '=', 'vendedor.filial_id')
            ->select(
                DB::raw('coalesce(sum(produtometa.quantidade*produto.valor),0) as valor_total'),
                'meta.*', 'vendedor.id as vendedor_id', 'vendedor.nome as nome_vendedor', 'filial.id as id_filial', 'filial.nome as nome_filial');

        if($vendedor_id){
            $qb = $qb->where('meta.vendedor_id', '=', $vendedor_id);
        }
        if($de && $ate){
            $qb = $qb->whereBetween('meta.de', array($de, $ate));
            $qb = $qb->whereBetween('meta.ate', array($de, $ate));
        }
        $dados_totais = $qb->get();
        $valor_total_meta = 0;
        foreach ($dados_totais as $key => $meta) {
            $valor_total_meta+=$meta->valor_total;
        }
        $valor_total_atingido = 0;

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

        $dados_venda = array();
        $filiais = array();
        $valor_total_atingido_meta = 0;
        foreach ($list as $key => $meta) {

            $list[$key]->vendas = DB::table('venda')
            ->leftJoin('produtovenda', 'produtovenda.venda_id', '=', 'venda.id')
            ->join('produto', 'produto.id', '=', 'produtovenda.produto_id')
            ->whereBetween('venda.data', array($meta->de , $meta->ate))
            ->where('venda.vendedor_id','=',$meta->vendedor_id)
            ->select(
                'venda.*'
            )
            ->groupBy('venda.id')
            ->get();

            $list[$key]->produtos =  DB::table('produtometa')
                ->join('produto', 'produto.id', '=', 'produtometa.produto_id')
                ->where('meta_id','=',$meta->id)
                ->get();

            $total_atingido_meta = 0;
            $total_atingido = 0;
            foreach ($list[$key]->vendas as $key_venda => $venda) {
                $venda->produtos =  DB::table('produtovenda')
                ->join('produto', 'produto.id', '=', 'produtovenda.produto_id')
                ->where('venda_id','=',$venda->id)
                ->select('produtovenda.*','produto.*')
                ->get();

                foreach ($venda->produtos as $key_produto => $produto) {
                    $items = array();
                        $total_atingido+=($produto->quantidade*$produto->valor);
                    foreach($list[$key]->produtos as $struct) {
                        if ($produto->produto_id == $struct->produto_id) {
                            $total_atingido_meta+=($produto->quantidade*$produto->valor);
                        }
                    }
                }
            }
            $list[$key]->valor_atingido_meta = $total_atingido_meta;
            $list[$key]->valor_atingido = $total_atingido;

            $valor_total_atingido+=$list[$key]->valor_atingido;
            $valor_total_atingido_meta+=$total_atingido_meta;
        }

        return response()->json(array('list'=>$list,'valor_total_meta'=>$valor_total_meta,'valor_total_atingido'=>$valor_total_atingido,'valor_total_atingido_meta'=>$valor_total_atingido_meta));
    }


    public function metas_filial(Request $request)
    {
        $take = $request->input('itensPorPagina');
        $mes = $request->input('mes');
        $filial_id = $request->input('filial_id');
        $pagina = $request->input('pagina');
        $orderBy = $request->input('orderBy');
        $orderByField = $request->input('orderByField');
        $skip = $take*$pagina;

        $filiais_metas = Filial::with('vendedores.metas.produtos')
        ->whereHas('vendedores.metas', function($query) use ($mes,$filial_id){
            if($mes){
                $query->where('de', 'like', '%'.$mes.'%')->where('ate','like','%'.$mes.'%');
            }
            if($filial_id){
                $query->where('filial_id','=',$filial_id);
            }
        });
        $filiais_vendas = Filial::with('vendedores.vendas.produtos')
        ->whereHas('vendedores.vendas', function($query) use ($mes,$filial_id){
            if($mes){
                $query->where('data', 'like', '%'.$mes.'%');
            }
            if($filial_id){
                $query->where('filial_id','=',$filial_id);
            }
        });

        if($take){
            $filiais_metas = $filiais_metas->take(intval($take))->skip($skip);
            $filiais_vendas = $filiais_vendas->take(intval($take))->skip($skip);
        }
        $filiais_metas = $filiais_metas->get();
        $filiais_vendas = $filiais_vendas->get();

        $filiais = array();
        $produtos_meta = array();

        foreach ($filiais_metas as $filial) {
            $filiais[$filial->id]['filial_nome'] = $filial->nome;
            $filiais[$filial->id]['valor_total'] = 0;
            $filiais[$filial->id]['metas'] = array();
            foreach($filial->vendedores as $vendedor){
                foreach ($vendedor->metas as $meta) {
                    $valor_total = 0;
                    foreach ($meta->produtos as $produto) {
                        $produtos_meta[$produto->id] = $produto;
                        $valor_total+=$produto->valor*$produto->pivot->quantidade; 
                        $filiais[$filial->id]['valor_total']+=$produto->valor*$produto->pivot->quantidade;
                    }

                    $filiais[$filial->id]['metas'][$meta->id] = $meta;
                    $filiais[$filial->id]['metas'][$meta->id]["valor_total"] = $valor_total;
                }
            }
        }

        foreach ($filiais_vendas as $filial) {
            $filiais[$filial->id]['valor_total_financeira'] = 0;
            $filiais[$filial->id]['valor_total_meta'] = 0;
            foreach($filial->vendedores as $vendedor){
                foreach ($vendedor->vendas as $meta) {
                    foreach ($meta->produtos as $produto) {
                        if(isset($produtos_meta[$produto->id])){
                            $filiais[$filial->id]['valor_total_meta']+=$produto->valor*$produto->pivot->quantidade;
                        }
                        $filiais[$filial->id]['valor_total_financeira']+=$produto->valor*$produto->pivot->quantidade;
                    }
                }
            }
        }
        $dados_retornodados_retorno = array();
        $dados_retorno['filiais'] = $filiais;
        $dados_retorno['valor_total'] = 0;
        $dados_retorno['valor_total_financeira'] = 0;
        $dados_retorno['valor_total_meta'] = 0;
        foreach ($dados_retorno['filiais'] as $filial) {
            $dados_retorno['valor_total']+=(isset($filial['valor_total']))?$filial['valor_total']:0;
            $dados_retorno['valor_total_financeira']+=(isset($filial['valor_total_financeira']))?$filial['valor_total_financeira']:0;
            $dados_retorno['valor_total_meta']+=(isset($filial['valor_total_meta']))?$filial['valor_total_meta']:0;
        }

        return response()->json(array('dados'=>$dados_retorno));
    }

}

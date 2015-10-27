<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\VendaRequest;
use App\Http\Controllers\Controller;

use DB;
use App\Venda;
use Illuminate\Http\Request;

class VendaController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$venda = Venda::all();

		return view('admin.venda.index', compact('venda'));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		return view('admin.venda.create');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return Response
	 */
	public function store(VendaRequest $request)
	{
		$venda = new Venda();

		$venda->vendedor_id = $request->input("vendedor_id");
        $venda->vendedor_id = $request->input("vendedor_id");
        $venda->data = $request->input("data");

		$venda->save();

		return redirect()->action('Admin\VendaController@index')->with('message', 'Item created successfully.');
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$venda = Venda::findOrFail($id);

		return view('admin.venda.show', compact('venda'));
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		$venda = Venda::findOrFail($id);

		return view('admin.venda.edit', compact('venda'));
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function update(VendaRequest $request, $id)
	{
		$venda = Venda::findOrFail($id);

		$venda->vendedor_id = $request->input("vendedor_id");
        $venda->vendedor_id = $request->input("vendedor_id");
        $venda->data = $request->input("data");

		$venda->save();

		return redirect()->action('Admin\VendaController@index')->with('message', 'Item updated successfully.');
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$venda = Venda::findOrFail($id);
		$venda->delete();

		return redirect()->action('Admin\VendaController@index')->with('message', 'Item deleted successfully.');
	}
	public function vendas(Request $request)
	{
		$take = $request->input('itensPorPagina');
		$de = $request->input('de');
		$ate = $request->input('ate');
		$pagina = $request->input('pagina');
		$orderBy = $request->input('orderBy');
		$orderByField = $request->input('orderByField');

		$skip = $take*$pagina;
		$qb = DB::table('venda')
            ->leftJoin('produtovenda', 'produtovenda.venda_id', '=', 'venda.id')
            ->leftJoin('produto', 'produto.id', '=', 'produtovenda.produto_id')
            ->join('vendedor', 'vendedor.id', '=', 'venda.vendedor_id')
            ->join('filial', 'filial.id', '=', 'vendedor.filial_id')
            ->select(
            	DB::raw('coalesce(sum(produtovenda.quantidade)*produto.valor,0) as valor_total')
            	,'venda.*', 'vendedor.nome as nome_vendedor', 'filial.nome as nome_filial');
		if($de && $ate){
			$qb = $qb->whereBetween('venda.data', array($de, $ate));
		}
		$dados_totais = $qb->get();
		$valor_total_periodo = 0;
		foreach ($dados_totais as $key => $venda) {
			$valor_total_periodo+=$venda->valor_total;
		}

		if($take){
			$qb = $qb->take($take);
		}
		if($skip){
			$qb = $qb->skip($skip);
		}
        $qb->groupBy('venda.id');
		if($orderByField && $orderBy){
			$qb = $qb->orderBy($orderByField, $orderBy);
		}
		$list = $qb->get();
		
		$valor_total_pagina = 0;
		foreach ($list as $key => $venda) {
			$valor_total_pagina+=$venda->valor_total;
		}


		return response()->json(array('list'=>$list,'valor_total_pagina'=>$valor_total_pagina,'valor_total_periodo'=>$valor_total_periodo));
	}

	public function getProdutoVenda(){
		$vendas = Venda::has("produto_venda.produto")->get();
		$vendas->load('produto_venda.produto');
		return response()->json($vendas);
	}

}

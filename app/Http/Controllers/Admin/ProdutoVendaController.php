<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\ProdutoVendaRequest;
use App\Http\Controllers\Controller;

use DB;
use App\ProdutoVenda;
use Illuminate\Http\Request;

class ProdutoVendaController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$produtovenda = ProdutoVenda::all();

		return view('admin.produtovenda.index', compact('produtovenda'));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		return view('admin.produtovenda.create');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return Response
	 */
	public function store(ProdutoVendaRequest $request)
	{
		$produtovenda = new ProdutoVenda();

		$produtovenda->quantidade = $request->input("quantidade");
        $produtovenda->venda_id = $request->input("venda_id");
        $produtovenda->venda_id = $request->input("venda_id");

		$produtovenda->save();

		return redirect()->action('Admin\ProdutoVendaController@index')->with('message', 'Item created successfully.');
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$produtovenda = ProdutoVenda::findOrFail($id);

		return view('admin.produtovenda.show', compact('produtovenda'));
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		$produtovenda = ProdutoVenda::findOrFail($id);

		return view('admin.produtovenda.edit', compact('produtovenda'));
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function update(ProdutoVendaRequest $request, $id)
	{
		$produtovenda = ProdutoVenda::findOrFail($id);

		$produtovenda->quantidade = $request->input("quantidade");
        $produtovenda->venda_id = $request->input("venda_id");
        $produtovenda->venda_id = $request->input("venda_id");

		$produtovenda->save();

		return redirect()->action('Admin\ProdutoVendaController@index')->with('message', 'Item updated successfully.');
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$produtovenda = ProdutoVenda::findOrFail($id);
		$produtovenda->delete();

		return redirect()->action('Admin\ProdutoVendaController@index')->with('message', 'Item deleted successfully.');
	}
	public function produtosVendidos(Request $request)
	{
		$take = $request->input('itensPorPagina');
		$de = $request->input('de');
		$ate = $request->input('ate');
		$vendedor_id = $request->input('vendedor_id');
		$pagina = $request->input('pagina');
		$orderBy = $request->input('orderBy');
		$orderByField = $request->input('orderByField');

		$skip = $take*$pagina;
		$qb = DB::table('produtovenda')
            ->join('produto', 'produto.id', '=', 'produtovenda.produto_id')
            ->join('venda', 'venda.id', '=', 'produtovenda.venda_id')
            ->join('vendedor', 'vendedor.id', '=', 'venda.vendedor_id');
        $filial = "";
		if(isset($_COOKIE['filial'])){
			$filial = $_COOKIE['filial'];
		}
		if($filial){
			$ss = $qb->where('vendedor.filial_id', $filial);
		}
		if($de && $ate){
			$qb = $qb->whereBetween('produtovenda.created_at', array($de, $ate));
		}
		if($vendedor_id){
			$qb = $qb->where('venda.vendedor_id', $vendedor_id);
		}

		$dados_venda = $qb->select("venda.id",
            	DB::raw('sum(produtovenda.quantidade*produto.valor) as valor_total, count(venda.id) as qtde_vendas')
            	)->get();

		if($take){
			$qb = $qb->take($take);
		}
		if($skip){
			$qb = $qb->skip($skip);
		}
        $qb->groupBy('produto.id');
		if($orderByField && $orderBy){
			$qb = $qb->orderBy($orderByField, $orderBy);
		}
		$list["dados"] = $qb->select(
            	DB::raw('sum(produtovenda.quantidade) as produtos_vendidos, 
            			sum(produtovenda.quantidade)*produto.valor as valor_total')
            	,'produto.*')->get();
		$list["dados_venda"] = $dados_venda;

		return response()->json($list);
	}

}

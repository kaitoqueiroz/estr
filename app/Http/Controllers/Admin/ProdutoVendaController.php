<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\ProdutoVendaRequest;
use App\Http\Controllers\Controller;

use DB;
use App\ProdutoVenda;
use App\Venda;
use App\Produto;
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

		$filial = "";
		if(isset($_COOKIE['filial'])){
			$filial = $_COOKIE['filial'];
		}
		$venda = new Venda();
		if($take){
			if($de && $ate){
				$venda = $venda->where('data','>=',$de)->where('data','<=',$ate)->take(intval($take))->skip($skip);
			}
			if($vendedor_id){
				$venda = $venda->where('vendedor_id',$vendedor_id);
			}
			$venda = $venda->take(intval($take))->skip($skip)->get();
		}else{
			$venda = Venda::get();
		}
		$venda = $venda->load(['vendedor' => function ($query) use ($filial) {
			if($filial){
			    $query->where('filial_id', $filial);
			}
		}]);
		$vendas = $venda->load('produtos');

		$produtos = array();
		$dados_venda = array();
		$vendedores = array();
		
		$dados_venda['qtde_vendas'] = 0;
		$dados_venda['valor_total'] = 0;
		foreach ($vendas as $key => $venda) {
			$valor_parcial = 0;
			if(isset($venda->vendedor)){

				foreach ($venda->produtos as $key => $produto) {
					if(isset($produtos[$produto->id])){
						$prod = $produtos[$produto->id];
						$prod['valor_total'] = 0;
						$prod['produtos_vendidos']+= $produto->pivot->quantidade;
						$prod['valor_total'] = $prod['produtos_vendidos']*$produto->valor;
						$prod['vendedor_id'] = $venda->vendedor->id;
						$prod['vendedor_nome'] = $venda->vendedor->nome;
					}else{
						$prod = array();
						$prod['id'] = $produto->id;
						$prod['valor_total'] = 0;
						$prod['produtos_vendidos'] = $produto->pivot->quantidade;
						$prod['valor_total'] = $produto->pivot->quantidade*$produto->valor;
						$prod['vendedor_id'] = $venda->vendedor->id;
						$prod['vendedor_nome'] = $venda->vendedor->nome;
						$prod['cod_produto'] = $produto->cod_produto;
						$prod['descricao'] = $produto->descricao;
					}
					if(isset($prod['vendedores'][$venda->vendedor->id])){
						$prod['vendedores'][$venda->vendedor->id]['quantidade'] += $produto->pivot->quantidade;
					}else{
						$prod['vendedores'][$venda->vendedor->id]['nome'] = $venda->vendedor->nome;
						$prod['vendedores'][$venda->vendedor->id]['quantidade'] = $produto->pivot->quantidade;
					}

					$produtos[$produto->id] = $prod;
				}
			}
			$dados_venda['qtde_vendas']++;
		}
		foreach ($produtos as $key => $produto) {
			$dados_venda['valor_total'] += $produto['valor_total'];
			/*if(isset($produto['vendedor_id'])){
				$vendedores[$produto['vendedor_id']]["quantidade"]=$produto['produtos_vendidos'];
				$vendedores[$produto['vendedor_id']]["nome"]=$produto['vendedor_nome'];
				$produto["vendedores"][$produto['vendedor_id']] = $vendedores[$produto['vendedor_id']];
			}*/
			$produtos[$key] = $produto;
		}

		$retorno = array();
		$retorno["dados"] = $produtos;
		$retorno["dados_venda"] = $dados_venda;

		return response()->json($retorno);
	}

}

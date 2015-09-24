<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\ProdutoVendaRequest;
use App\Http\Controllers\Controller;

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

}

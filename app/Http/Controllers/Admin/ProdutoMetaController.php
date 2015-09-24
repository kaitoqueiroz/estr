<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\ProdutoMetaRequest;
use App\Http\Controllers\Controller;

use App\ProdutoMeta;
use Illuminate\Http\Request;

class ProdutoMetaController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$produtometa = ProdutoMeta::all();

		return view('admin.produtometa.index', compact('produtometa'));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		return view('admin.produtometa.create');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return Response
	 */
	public function store(ProdutoMetaRequest $request)
	{
		$produtometa = new ProdutoMeta();

		$produtometa->quantidade = $request->input("quantidade");
        $produtometa->meta_id = $request->input("meta_id");
        $produtometa->meta_id = $request->input("meta_id");

		$produtometa->save();

		return redirect()->action('Admin\ProdutoMetaController@index')->with('message', 'Item created successfully.');
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$produtometa = ProdutoMeta::findOrFail($id);

		return view('admin.produtometa.show', compact('produtometa'));
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		$produtometa = ProdutoMeta::findOrFail($id);

		return view('admin.produtometa.edit', compact('produtometa'));
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function update(ProdutoMetaRequest $request, $id)
	{
		$produtometa = ProdutoMeta::findOrFail($id);

		$produtometa->quantidade = $request->input("quantidade");
        $produtometa->meta_id = $request->input("meta_id");
        $produtometa->meta_id = $request->input("meta_id");

		$produtometa->save();

		return redirect()->action('Admin\ProdutoMetaController@index')->with('message', 'Item updated successfully.');
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$produtometa = ProdutoMeta::findOrFail($id);
		$produtometa->delete();

		return redirect()->action('Admin\ProdutoMetaController@index')->with('message', 'Item deleted successfully.');
	}

}

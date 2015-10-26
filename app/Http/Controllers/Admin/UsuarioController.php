<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\UsuarioRequest;
use App\Http\Controllers\Controller;

use DB;
use App\Usuario;
use App\Filial;
use Illuminate\Http\Request;

class UsuarioController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(Request $request)
	{
		$take = $request->input('itensPorPagina');
		$usuarios_by_filial = $request->input('usuarios_by_filial');
		$pagina = $request->input('pagina');
		$orderBy = $request->input('orderBy');
		$orderByField = $request->input('orderByField');

		$skip = $take*$pagina;
		$qb = DB::table('usuario')
            ->join('filial', 'filial.id', '=', 'usuario.filial_id')
            ->select('usuario.*', 'filial.nome as nome_filial');
		if($usuarios_by_filial){
			$qb = $qb->where("filial_id","=",$usuarios_by_filial);
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
		$qb = $qb->where("tipo","!=","admin");
		$list = $qb->get();

		return response()->json($list);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$usuario = Usuario::findOrFail($id);
		$usuario["filial"] = Filial::findOrFail($usuario["filial_id"]);
		$filiais = Filial::all();

		return response()->json($usuario);
	}
	
	public function login(UsuarioRequest $request)
	{	
		$login = $request->input("login");
		$senha = $request->input("senha");

		$usuario = DB::table('usuario')
					->where("login","=",$login)->get();

		if(count($usuario) > 0){
			// Hashing the password with its hash as the salt returns the same hash
			if (hash_equals($usuario[0]->senha, crypt($senha, $usuario[0]->senha))) {
				$dados = array("result"=>"OK","usuario"=>$usuario[0]->id);
				setcookie("admin", $usuario[0]->id);
			}else{
				$dados = array("result"=>"ERROR");			
			}
		}else{
			$dados = array("result"=>"ERROR");			
		}

		return response()->json($dados);
		
	}
	public function logout()
	{
		setcookie("admin", '');

		return response()->json(array());
		
	}
	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function updateSenha(UsuarioRequest $request, $id)
	{
		$usuario = Usuario::findOrFail($id);

        if (hash_equals($usuario->senha, crypt($request->input("senha"), $usuario->senha))) {
	        $usuario->senha = $request->input("senha");
	        $nova_senha = $request->input("nova_senha");

	        $cost = 10;
			$salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
			$salt = sprintf("$2a$%02d$", $cost) . $salt;
			$hash = crypt($nova_senha, $salt);
	        $usuario->senha = $hash;
			$usuario->save();
			$dados = array("result"=>"OK","usuario"=>$usuario->id);
        }else{
        	$dados = array("result"=>"ERROR");
        }

		return response()->json($dados);
	}
	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function update(UsuarioRequest $request, $id)
	{
		$usuario = Usuario::findOrFail($id);
		$usuario->nome = $request->input("nome");
        $usuario->login = $request->input("login");
        $usuario->filial_id = $request->input("filial")["id"];

		$usuario->save();

		return response()->json($usuario);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$usuario = Usuario::findOrFail($id);
		$usuario->delete();

		return response()->json(array());
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return Response
	 */
	public function store(UsuarioRequest $request)
	{
		$usuario = new Usuario();
        $usuario->nome = $request->input("nome");
        $usuario->login = $request->input("login");
        $usuario->tipo = "gerente";
        $senha = $request->input("senha");

        $cost = 10;
		$salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
		$salt = sprintf("$2a$%02d$", $cost) . $salt;
		$hash = crypt($senha, $salt);
        $usuario->senha = $hash;
        $usuario->filial_id = $request->input("filial")["id"];

		$usuario->save();

		return response()->json($usuario);
	}

}

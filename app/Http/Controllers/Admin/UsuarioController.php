<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\UsuarioRequest;
use App\Http\Controllers\Controller;

use DB;
use App\Usuario;
use Illuminate\Http\Request;

class UsuarioController extends Controller {

	
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

		$usuario->login = $request->input("login");
        $usuario->nome = $request->input("nome");

        $usuario->senha = $request->input("senha");

        $cost = 10;
		$salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
		$salt = sprintf("$2a$%02d$", $cost) . $salt;
		$hash = crypt($usuario->senha, $salt);
        $usuario->senha = $hash;


		$usuario->save();

		return redirect()->action('Admin\UsuarioController@index')->with('message', 'Item updated successfully.');
	}

}
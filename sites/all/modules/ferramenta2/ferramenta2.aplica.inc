<?php
session_start();

//header ('Content-Type: text/plain; charset=ISO-8859-2');
//escuro
function aplica_questionario(){

$diretorio = drupal_get_path('module', 'ferramenta2');
$opts = array('absolute' => TRUE);
$url_padrao = url('', $opts);
 
$codigo=arg(1);
$email=arg(2);

if (strlen($email)<=0 or strlen($codigo)<=0 ) {
    echo "<h1> Avaliação inexistente</h1> ";
    return;
}

$sql = "select codigo_formulario from ferramenta2.formulario where link='$codigo'";
$ret = db_query($sql);

if ( pg_num_rows($ret) > 0 ) { //formulario existe
    $formulario = pg_fetch_object($ret); 
    //verifica a data de aplicacao
    //se a data atual esta entre o inicio e fim
    $sql = "select datainicio, datafim
	    from ferramenta2.gerencia
	    where codigo_formulario='$formulario->codigo_formulario' and datainicio <= current_date and datafim >= current_date";
    $ret = db_query($sql);
    if ( pg_num_rows($ret) <= 0 ) {
	echo "<p style='text-align:center;'><h3 class=error>Infelizmente, a data de aplicação do questionário já expirou.</h3><p>";
	$erro=1;	
    }
}else {
    echo "<p><h1 class=error>Formulario não existe.<h1><p>";
    $erro=1;
}

if ($erro==1) {
    echo "<h3>A equipe do projeto http://avaliacao.kinghost.net agradece.</h3>";
    return;
}

$sql = "select email from tabelas.usuario_$codigo where email='$email'";//verifica se este email ja fez esta avaliacao
$ret = db_query($sql);

 //armazena variaveis para identificar o usuario e o codigo do questionario
echo "<input type='hidden' id='controle1' value='$codigo' /> "; 
echo "<input type='hidden' id='controle2' value='$email' /> ";
echo "<input type='hidden' id='padrao' value='$url_padrao' /> ";
if ( pg_num_rows($ret) > 0 ) {
    echo "<input type='hidden' id='acao' value='1' /> ";//1 atualizar
}else {
    echo "<input type='hidden' id='acao' value='0' /> ";//0 inserir 
}


//echo "$codigo - $email";
$_SESSION[codigo]=$codigo;
$_SESSION[email]=$email;
 ferramenta2_carrega_variaveis_javascript();
echo "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='en' lang='en'>
<head>
<title>Sistema de Avalia&ccedil;&atilde;o Online Beta</title>";
   echo "<link rel='stylesheet' href='$url_padrao$diretorio/css/questionario/questionario.css' type='text/css' />";
    echo "<script src='$url_padrao$diretorio/js/js/jquery-1.4.2.min.js' type='text/javascript'></script>";
    echo "<script src='$url_padrao$diretorio/js/js/jquery-ui-1.8.1.custom.min.js' type='text/javascript'></script>";
    echo "<script src='$url_padrao$diretorio/js/development-bundle/ui/jquery.ui.core.js' type='text/javascript'></script>";
    echo "<script src='$url_padrao$diretorio/js/development-bundle/ui/jquery.ui.draggable.js' type='text/javascript'></script>";
    echo "<script src='$url_padrao$diretorio/js/development-bundle/ui/jquery.ui.resizable.js' type='text/javascript'></script>";
    echo "<script src='$url_padrao$diretorio/js/questionario.js' type='text/javascript'></script>";
  echo "</head>
<body>";
   echo '
        <div id="aviso-avaliacao" title="Mensagem Avaliação.">
    	</div>
            
        ';
  
   $sql = "select * from ferramenta2.formulario where link='$codigo'";
   // echo $sql;
   
    $ret=db_query($sql);
    
    $resultado=db_fetch_object($ret);
    
    $saida= $resultado->json ;
    $saida =  str_replace('","','||',$saida);
    $saida= explode("||", $saida); //pega cada linha e divide em um array assim=> "identificador": "f", pegando cada linha individualmente
    $saida =  str_replace('":"','||',$saida);
    
    $array_linha =  str_replace('"','',$saida);
    
   $saida = "<form action='usuario$codigo' method='POST'>";

 //cabecalho principal
 
$saida .= "

<div id='content' class='container_12 bloco_principal'>
    <div id='' class='grid_12 '>";


    $flag_cor=0;
    $cor[0]='#d0e4fe'; //claro e0ecff
    $cor[1]='#c3d9fb';
 
    foreach($array_linha as $linhas) {
        $linha = explode("||",$linhas);
        // print_r($linha);    
       if ($flag_cor==1) {
	$flag_cor=0;
      }else {
	$flag_cor=1;
      }
        if ($linha[0]=='identificador' and $linha[1]=='f') {
            $controle ='f';
        }
        
        if ($controle=='f') { //pega os valores do formulario
            if ($linha[0]=='titulo') {
                $titulo=$linha[1];
            }
            if ($linha[0]=='codigo') {
                $codigo=$linha[1];
            }           
            if ($linha[0]=='texto') {
                $texto=$linha[1]; //ultimo campo apos devera imprimir na tela
                
               $saida .= adiciona_formulario($codigo, $titulo, $texto);
            }//fim do ultimo campo
            
        }//fim de controle de funcao
        
        //------------------------------------------------------------------------- SECAO
        if ($linha[0]=='identificador' && $linha[1]=='s') {
            $controle ='s';
            //console.log(controle);//firebird
        }
        if ($controle=='s') { //pega os valores do formulario
            
            //console.log($linha[0]);//firebird
            
            if ($linha[0]=='codigo') {
                $codigo=$linha[1];                    
            }
            
            if ($linha[0]=='titulo') {
                $titulo=$linha[1];
                $saida .= adiciona_secao($codigo,$titulo);
            }
            //fim do ultimo campo
            
        }//fim de controle de funcao
        
    //------------------------------------------------------------------------- PERGUNTA
  
        if ($linha[0]=='identificador' && $linha[1]=='p') {
            $controle ='p';
          //  console.log(controle);//firebird
        }
        if ($controle=='p') { //pega os valores do formulario
            
            if ($linha[0]=='codigo') {
                $codigo=$linha[1];        
            }
            if ($linha[0]=='titulo') {
                $titulo=$linha[1];
		$tamanho_pergunta=strlen($linha[1]);
            //    console.log(exibeFormulario.titulo);//firebird
                $saida .= adiciona_pergunta($codigo, $titulo, $tamanho_pergunta,  $cor[$flag_cor]);
            }//fim do ultimo campo
            
        }//fim de controle
       
        //------------------------------------------------------------------------- RESPOSTA
        
        if ($linha[0]=='identificador' && $linha[1]=='r') {
            $controle ='r';
          //  console.log(controle);//firebird
        }
        if ($controle=='r') { //pega os valores do formulario
            if ($linha[0]=='codigo_objeto') {
                $codigo_objeto=$linha[1];
          
            }
            if ($linha[0]=='codigo_resposta') {
                $codigo_resposta=$linha[1];
            }
            if ($linha[0]=='tipo') {
                $tipo=$linha[1];
            }  
            if ($linha[0]=='tabela') {
                $tabela=$linha[1]; //ultimo campo apos devera imprimir na tela
                $saida .= adiciona_resposta( $codigo_objeto, $codigo_resposta, $tipo, $tabela, $tamanho_pergunta ,  $cor[$flag_cor]);
            // $saida.="<p>resposta$codigo";
            }//fim do ultimo campo
            
        }//fim de controle de funcao
       
    }//fim foreach $linhas
    $saida.="<div class='grid_6 alpha' ><br /><br />
    <center><button id='salvar'>Salvar questionário </button></center><br /><br /></div>";
    $saida.="<div class='grid_6 omega' ><br /><br />
    <center><button id='sair'> Sair </button></center><br /><br /></div>";
    
    $saida.="</div></div>"; //container  fecha div's de conteudo
  $saida .="
    <div id='footer' class='container_12 rodape'>
	<div id='' class='grid_12 dejavu6 '>
	    <a href='http://avaliacao.kinghost.net'><p> Sistema de cria&ccedil;&atilde;o de Question&aacute;rios onLine Beta 1.0</p></a>
	</div>
"  ;
    $saida .="</div></form>"; // fecha div principal
   
    $saida .="<div id='mensagem_aviso' class='aviso'>Salvando...</div>";
    echo $saida;

}

function adiciona_formulario($codigo="", $titulo="", $texto="") {
    $titulo=converte_utf8_html($titulo);
    $texto=converte_utf8_html($texto);
    $saida = "<div id='div_titulo' class='div_titulo grid_12'><h1 class='titulo'>$titulo</h1></div><hr />" ;
    $saida .= "<div id='header_mensagem grid_12'> <p class='mensagem'>$texto</p></div>";
    return $saida;
    
}//fim de funcao

function adiciona_secao($codigo="", $titulo="") {
    $titulo=converte_utf8_html($titulo);
    $saida .= "<div id='secao' class='secao grid_12'> <hr /><p class='secao_titulo'>$titulo</p><hr /></div>";
    return $saida;
    
}//fim de funcao

function adiciona_pergunta($codigo="", $titulo="", $tamanho_pergunta=0, $cor='') {
    $titulo=converte_utf8_html($titulo);
    if ($tamanho_pergunta>50){
	$posicao='span-15 colborder';
    }else {
        $posicao='span-15';
    }
    $saida .= "<div id='$codigo' class='grid_12 pergunta'>
    <p id='$codigo pergunta_titulo'>$titulo</p></div>";
   
    return $saida;
       
}//fim de funcao 


function adiciona_resposta( $codigo_objeto="", $codigo_resposta="", $tipo="", $tabela="", $tamanho_pergunta=0, $cor='' ) {
/*
$codigo_objeto= numero da questao
$codigo_resposta= se resposta for combo, check, radio, text, etc...
$tipo= descricao textual do objeto
$tabela= conteudo do  radio, check, combo
$tamanho_pergunta= tamanho em caracteres
$cor= cor da questao
*/
   //echo "$codigo_objeto<; >$codigo_resposta;$tipo==; $tabela o; $tamanho_pergunta==; $cor=''  ";
   // $tabela = converte_utf8_html($tabela);
   if ($tamanho_pergunta>50 ){
    $posicao='span-6 last';
    $pula_linha='';
   }else {
    $posicao='span-15';
    $pula_linha='<br />';
   }
   
   
    $saida .= "<div id='resposta'  class='grid_12'> ";
    if ($codigo_resposta==1 ){
        $niveis=explode(";", $tabela);
	
        foreach($niveis as $nivel) {
            if (strlen($nivel)>0) {	
		$exibe_nivel=converte_utf8_html($nivel);
		$campo = pega_resultado_questao($codigo_objeto);
		$array_campo = explode(',', $campo);
		$array_campo = converte_utf8_html($array_campo);
		//print_r($array_campo);
		//echo "<p>--$array_campo[1]==$nivel--".in_array($array_campo,$nivel);
		if (existe($array_campo,$nivel)) {
		    $saida .="<br /><input type='checkbox' name='$codigo_objeto"."[]' id='$codigo_objeto"."[]' value='$exibe_nivel' checked /> $exibe_nivel <br />";
		}else {
		    $saida .="<br /><input type='checkbox' name='$codigo_objeto"."[]' id='$codigo_objeto"."[]' value='$exibe_nivel' /> $exibe_nivel <br />";
		}
		
		
	    }
        }
         
    }
    //resposta radio
    if ($codigo_resposta==2 ){
        $niveis=explode(";", $tabela);
	
        foreach($niveis as $nivel) {
            if (strlen($nivel)>0) {
	        $exibe_nivel=converte_utf8_html($nivel);
		$campo = pega_resultado_questao($codigo_objeto);
		//echo "<p>--<pre>$campo=$nivel</pre>-->". iconv("UTF8",'ASCII',$campo);
		if ($campo==$nivel ) {
		    $saida .="<input type='radio' name='$codigo_objeto' id='$codigo_objeto' value='$nivel' checked='true' /> $nivel <br /> ";
		}else {
		    $saida .="<input type='radio' name='$codigo_objeto' id='$codigo_objeto' value='$nivel' /> $nivel <br /> ";
		}//fim radio
	    }
        }
         
    }
        //resposta TEXT
    if ($codigo_resposta==3){
       // $niveis=explode(";", $tabela);
       $campo = pega_resultado_questao($codigo_objeto);
        $saida .="<input type='TEXT' name='$codigo_objeto' id='$codigo_objeto' value='$campo' />  ";
    }

            //resposta COMBO

    if ($codigo_resposta==4  ){
        $niveis=explode(";", $tabela);
        $saida .="<select name='$codigo_objeto' id='$codigo_objeto'> ";	
        foreach($niveis as $nivel) {
            if (strlen($nivel)>0) {
		$exibe_nivel=converte_utf8_html($nivel);
		$campo = pega_resultado_questao($codigo_objeto);
		$campo=converte_utf8_html($campo);
//		echo "<p>--<pre>$campo=$nivel</pre>-->". iconv("UTF8",'ASCII',$campo);
		if ($nivel==$campo ) {
		    
		    $saida .="<br /><option value='$exibe_nivel' selected> $exibe_nivel </option> ";
		    
		}else {
		    $saida .="<br /><option value='$exibe_nivel'> $exibe_nivel </option> ";
		}
	    
		
	    }
        }
         $saida .="</select>";
    }
                //resposta MEMO
    if ($codigo_resposta==5  ){
            $campo = pega_resultado_questao($codigo_objeto);
            $saida .="<br /><textarea rows='4' cols='30' name='$codigo_objeto' id='$codigo_objeto' >$campo  </textarea> ";
    }
    //$saida .="</fieldset>";
    $saida .="<br /></div><br />"; //fim item_resposta;
    return $saida;
       
}//fim de funcao

function pega_resultado_questao($codigo='', $nivel=''){
    
    $sql = "select q$codigo from tabelas.usuario_".$_SESSION[codigo]." where email='".$_SESSION[email]."'";
    
    $ret = db_query($sql);
    if ( $ret ) {
	
	$linha=db_fetch_array($ret);
    }
   // echo "<p>".$sql;
    $saida = $resposta=str_replace("&pound;",'', $linha["q$codigo"]);
    $saida = $resposta=str_replace("&iexcl;",'', $saida);
    return  $saida ;
}

function salva_questionario(){
    $acao = explode(";",$_POST[acao]);
    
    $controle_acao=$acao[0];
    $questao=$acao[1];
    $matricula=$acao[2];
    $unidade=$acao[3];
    $cursobase=$acao[4];
    $turno=$acao[5];
    $resposta=$acao[6];
    $codigo = $acao[7];
  // print_r($acao);
  //$reposta=str_replace('ã','u00c3',$resposta);
    //$resposta = htmlentities($resposta);
   // echo $resposta;
   //retira [] do campo questao das checkbox
	$questao = str_replace('[','',$questao);
	$questao = str_replace(']','',$questao);
    if ($controle_acao=='insere'){
	
	$sql = "insert into tabelas.usuario_$codigo (matricula,unidade,cursobase,turno,q$questao)
	values('$matricula','$unidade','$cursobase','$turno','$resposta')  ";
    }else if ($controle_acao=='atualiza') {
	$sql = "update tabelas.usuario_$codigo
	set q$questao='$resposta' 
	 where matricula='$matricula'  ";
    }
    echo $sql;
    $retorno = db_query($sql);
    if ( ! $retorno) {
	$saida="erro";
    }else {
	$saida="ok";
    }
    
    echo $saida;
    
}//fim

function existe($array,$string) {
    $existe=0;
    foreach ($array as $campo) {
	if (trim($campo)==trim($string) ) {
	    $existe=1;
	    break;
	}
    }
    
    return $existe;
}

function sair_questionario() {
echo "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='en' lang='en'>
<head>
<title>Sistema de Avalia&ccedil;&atilde;o Beta</title>";
   echo "<link rel='stylesheet' href='$url_padrao$diretorio/css/questionario/questionario.css' type='text/css' />";
   echo "<script src='$url_padrao$diretorio/js/questionario.js' type='text/javascript'></script>";
  echo "</head>
<body>";
echo "<div id='agradecimento' class='agradecimento'>Obrigado pela sua avaliacao!</div>";
echo "</body></html>";
}

/*
* Esta funcao pega toda a alteracao do usuario no questionario e grava no banco
*/
function grava_valores() {
//echo $_POST[acao];
 $acao = explode(";",$_POST[acao]);
 $questao=$acao[1];
 $resposta=$acao[2];
 $tipo=$acao[3];
 $tabela=$acao[4];
 $email=$acao[5];
    
 if ($acao[0]==0){ // insere
    if ($tipo=='check'){
       $posicao=strpos($questao,"[");
       $questao=substr($questao, 0 , $posicao);
    }
 
    $sql = "insert into tabelas.usuario_$tabela(email, q$questao, alteracao) values('$email','$resposta', now())";
  //  echo $sql;
    $erro =db_query ($sql); 
    if ( ! $erro ){
    //erro
    $erros=array ( '%tabela'=>$tabela, '%email'=>$email, '%questao'=>$questao);
    $mensagem = "Erro na inclusao de dados da avaliacao de nome %tabela, do email %email, na questao %questao ";
     watchdog("ferramenta2.aplica.inc", $mensagem,
              $erros, WATCHDOG_ERROR);
    }
 }else {
  
    if ($tipo=='check'){
       $posicao=strpos($questao,"[");
       $questao=substr($questao, 0 , $posicao);
    }
 
    $sql = "update tabelas.usuario_$tabela set q$questao= '$resposta', alteracao = now() where email='$email'";
    //echo $sql;
     $erro =db_query ($sql); 
    if ( ! $erro ){
    //erro
    $erros=array ( '%tabela'=>$tabela, '%email'=>$email, '%questao'=>$questao);
    $mensagem = "Erro na alteracao de dados da avaliacao de nome %tabela, do email %email, na questao %questao ";
     watchdog("ferramenta2.aplica.inc", $mensagem,
              $erros, WATCHDOG_ERROR);
    }
 // echo $sql;
 }
 
 if (! $erro) {
   echo json_encode("erro");
 }else{
 echo json_encode("ok");
 }
 //print_r($acao);
}
?>

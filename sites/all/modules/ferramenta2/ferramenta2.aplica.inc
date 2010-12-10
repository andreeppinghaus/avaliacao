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
//echo "$codigo - $email";
$_SESSION[codigo]=$codigo;
$_SESSION[email]=$email;

echo "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='en' lang='en'>
<head>
<title>Sistema de Avalia&ccedil;&atilde;o Online Beta</title>";
echo "<link rel='stylesheet' href='$url_padrao$diretorio/css/questionario/questionario.css' type='text/css' />";
echo "</head>
<body>";

   $sql = "select * from ferramenta2.formulario where link='$codigo'";
   // echo $sql;
   
    $ret=db_query($sql);
    
    $resultado=db_fetch_object($ret);
    
    $saida= $resultado->json ;
    $saida =  str_replace('","','||',$saida);
    $saida= explode("||", $saida); //pega cada linha e divide em um array assim=> "identificador": "f", pegando cada linha individualmente
    $saida =  str_replace('":"','||',$saida);
    
    $array_linha =  str_replace('"','',$saida);
    
    //echo "$resultado->json" ;
  // print_r($array_linha);
    //monta o form
//    header('Content-type: application/json; charset=ISO-8859-9');
    
   $saida = "<form action='usuario$codigo' method='POST'>";
    
 //   $saida = "<img src='$url_padrao/sites/default/files/logo_ugf.png' class='top  left' height='100' width='100' alt='logo' />";
 
 //cabecalho principal
    /*$saida .= "
<div id='header' class='container_12'> 
    <div id='header_main' class='grid_12 '>

	<div id='logo' class='grid_3 alpha'>
	</div>

	<div id='header_content' class='grid_9 omega'>
	<p class='aviso'> Sistema de criacao de questionarios</p>
	</div>
    </div>
</div>";
    */
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
    $saida.="<div class='span-2'><br /><br /><input id='salvar' type='button' value='Salvar questionario' /><br /><br /></div>";
    $saida.="</div></div>"; //container  fecha div's de conteudo
  $saida .="              

<div id='footer' class='container_12 rodape'>

<div id='' class='grid_12 dejavu6 '>
<p> Sistema de cria&ccedil;&atilde;o de Question&aacute;rios onLine Beta 0.3
</div>
"  ;
    $saida .="</div></form>"; // fecha div principal
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
		$campo = converte_utf8_especial($campo);
		$array_campo = explode('|', $campo);
		
		//echo "<p>--$array_campo[3]==$nivel--".in_array($array_campo,$nivel);
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
		$saida .="<input type='radio' name='$codigo_objeto' id='$codigo_objeto' value='$nivel' /> $nivel <br /> ";
	    }
        }
         
    }
        //resposta TEXT
    if ($codigo_resposta==3){
       // $niveis=explode(";", $tabela);
       $campo = pega_resultado_questao($codigo);
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
		//$campo=converte_utf8_html($campo);
		//echo "<p>--<pre>$campo=$nivel</pre>-->". iconv("UTF8",'ASCII',$campo);
		//if (strlen($campo)>0)
		 //   echo "<p>".$campo. converte_utf8_especial ($campo)."--|". converte_utf8_especial ($nivel);
		
	//	if ($nivel==converte_utf8_especial($campo) ) {
		if (converte_utf8_especial($nivel)==converte_utf8_especial($campo) ) {
		    
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
    
    $sql = "select q$codigo from tabelas.usuario_".$_SESSION[codigo]." where email='".$_SESSION[registro]."'";
    
    
    $ret = db_query($sql);
    if ( $ret ) {
	
	$linha=db_fetch_array($ret);
    }
//    echo "<p>".$sql;
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

function lixoaplica_questionario($codigo="") {

    /*
    $sql = "select json from tabelas.usuario_$codigo where link=matricula='1'"; //verifica se atualiza ou insere
	
    $ret = db_query($sql);
    if (pg_num_rows($ret)<=0){
        echo "<input id='acao' type='hidden' value='insere'  /> ";
    }else {
        echo "<input id='acao' type='hidden' value='atualiza'  /> ";
    }
	
    	
       //cria  a variavel de caminho do servidor ajax
    $opts = array('absolute' => TRUE);
    $url_padrao = url('avaliacao/salvar', $opts);
    //drupal_add_js(array('ferramenta2' => array("salvar" => $url_padrao)), 'setting');
    echo "<input id='servidor' type='hidden' value=$url_padrao /> ";
    echo "<input id='formulario' type='hidden' value=$codigo /> ";
    
    $diretorio = drupal_get_path('module', 'ferramenta2');
    $opts = array('absolute' => TRUE);
    $url_padrao = url('', $opts);
    */
  /*  drupal_add_css(drupal_get_path('module', 'ferramenta2') . "/js/css/start/jquery-ui-1.8.1.custom.css");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/js/jquery-1.4.2.min.js");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/js/jquery-ui-1.8.1.custom.min.js");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/development-bundle/ui/jquery.ui.core.js");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/development-bundle/ui/jquery.ui.draggable.js");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/development-bundle/ui/jquery.ui.resizable.js");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/inc/jquery.metadata.js");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/jquery.draggableList.js");
  */

    echo '<link rel="stylesheet" href="'.$url_padrao.$diretorio.'/css/blueprint/screen.css" type="text/css" media="screen, projection"/>';
    echo '<link rel="stylesheet" href="'.$url_padrao.$diretorio.'/css/blueprint/print.css" type="text/css" media="print"/>';
    echo '<link rel="stylesheet" href="'.$url_padrao.$diretorio.'/css/blueprint/plugins/fancy-type/screen.css" type="text/css" media="screen, projection"/>';
    
    echo '<link rel="stylesheet" href="'.$url_padrao.$diretorio.'/js/css/start/jquery-ui-1.8.1.custom.css" type="text/css" />';

   // echo '<script src="'.$url_padrao.$diretorio.'/js/jquery-validate/jquery.validate.js" type="text/javascript"></script>';
    echo '<script src="'.$url_padrao.$diretorio.'/js/js/jquery-1.4.2.min.js" type="text/javascript"></script>';
    echo '<script src="'.$url_padrao.$diretorio.'/js/js/jquery-ui-1.8.1.custom.min.js" type="text/javascript"></script>';
    echo '<script src="'.$url_padrao.$diretorio.'"/js/development-bundle/ui/jquery.ui.core.js" type="text/javascript"></script>';
    echo '<script src="'.$url_padrao.$diretorio.'"/js/development-bundle/ui/jquery.ui.core.js" type="text/javascript"></script>';	
    echo '<script src="'.$url_padrao.$diretorio.'"/js/development-bundle/ui/jquery.ui.draggable.js" type="text/javascript"></script>';
    echo '<script src="'.$url_padrao.$diretorio.'"/js/development-bundle/ui/jquery.ui.resizable.js" type="text/javascript"></script>';

    echo '<script src="'.$url_padrao.$diretorio.'/js/controle_avaliacao.js" type="text/javascript"></script>';
    echo '<script src="'.$url_padrao.$diretorio.'/js/validacao_avaliacao_'.$codigo.'.js" type="text/javascript"></script>';

    echo '<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="" class="js" debug="true"><head>';
    echo '<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>';
    echo '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>';
  echo '<style type="text/css">
	    body {  background-color:#aec8f4; }
	    h3 {
		font-size:1.3em;
		line-height:2em;
			
		}
		.gray {color: #a19292;} 
    	</style>';

    echo "</head><br /></br><body>";
    echo '
        <div id="aviso-avaliacao" title="Avaliação Armazenada com sucesso.">
	<h2> Sua avaliação foi Armazenada com sucesso</h2>
	<br /> <h3>Agradecemos a sua  colaboração.</h3>
    	</div>
            
        ';
				
   // echo "<div id='mensagem' class='notice' style='position:relative;margin-top: 3px;float: right;height: 14px;'>ok</div>";
    
    //echo "teste$codigo";
 
}//fim de funcao

?>

<?php
//header ('Content-Type: text/plain; charset=ISO-8859-2');
//escuro

function visualiza() {
    global $user;
   
    session_start();

    $codigo = $_SESSION[codigo];

	$sql = "select matricula from tabelas.usuario_4 where matricula='1'"; //verifica se atualiza ou insere
	//echo $sql;
	$ret = db_query($sql);
	if (pg_num_rows($ret)<=0){
	    echo "<input id='acao' type='hidden' value='insere'  /> ";
	}else {
	    echo "<input id='acao' type='hidden' value='atualiza'  /> ";
	}
	
	//pega daddos de alunos
	echo "<input id='matricula' type='hidden' value=$matricula  /> ";
	echo "<input id='unidade' type='hidden' value=$unidade /> ";
	echo "<input id='cursobase' type='hidden' value=$curso /> ";
	echo "<input id='turno' type='hidden' value=$turno /> ";   

    	
       //cria  a variavel de caminho do servidor ajax
    $opts = array('absolute' => TRUE);
    $url_padrao = url('avaliacao/salvar', $opts);
    //drupal_add_js(array('ferramenta2' => array("salvar" => $url_padrao)), 'setting');
    echo "<input id='servidor' type='hidden' value=$url_padrao /> ";
    echo "<input id='formulario' type='hidden' value=$codigo /> ";
    
    $diretorio = drupal_get_path('module', 'ferramenta2');
    $opts = array('absolute' => TRUE);
    $url_padrao = url('', $opts);
    
       drupal_add_css(drupal_get_path('module', 'ferramenta2') . "/js/css/start/jquery-ui-1.8.1.custom.css");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/js/jquery-1.4.2.min.js");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/js/jquery-ui-1.8.1.custom.min.js");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/development-bundle/ui/jquery.ui.core.js");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/development-bundle/ui/jquery.ui.draggable.js");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/development-bundle/ui/jquery.ui.resizable.js");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/inc/jquery.metadata.js");
    drupal_add_js(drupal_get_path('module', 'ferramenta2') . "/js/jquery.draggableList.js");
    
    echo '<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="" class="js" debug="true"><head>';
    echo '<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>';
    echo '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>';
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
    echo '<style type="text/css">
	    body {  background-color:#aec8f4; }
	    h3 {
		font-size:1.3em;
		line-height:2em;
			
		}
		.gray {color: #a19292;} 
    	</style>';
    echo "</head><br /></br><body>";

				
   // echo "<div id='mensagem' class='notice' style='position:relative;margin-top: 3px;float: right;height: 14px;'>ok</div>";
    
    //echo "teste$codigo";
    $sql = "select json from ferramenta2.formulario where uid=4";
///    echo $sql;
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
    
   $saida .= "<form action='usuario$codigo' method='POST'>";
    
    $saida = "<img src='$url_padrao/sites/default/files/logo_ugf.png' class='top  left' height='100' width='100' alt='logo' />";       
    $saida .= "<div class='container' style='background-color:#d0e4fe'>";

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
            //echo "<br />$ aqui !!!!!controle";
          //  console.log(controle);//firebird
        }
        
        if ($controle=='f') { //pega os valores do formulario
            if ($linha[0]=='titulo') {
                $titulo=$linha[1];
            //    console.log(exibeFormulario.titulo);//firebird
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
            if ($linha[0]=='titulo') {
                $titulo=$linha[1];
            //    console.log(exibeFormulario.titulo);//firebird
            }
            if ($linha[0]=='codigo') {
                $codigo=$linha[1];
            }
            if ($linha[0]=='tipo') {
                $tipo=$linha[1];
            }  
            if ($linha[0]=='tabela') {
                $tabela=$linha[1]; //ultimo campo apos devera imprimir na tela
                $saida .= adiciona_resposta( $codigo, $titulo, $tipo, $tabela, $tamanho_pergunta ,  $cor[$flag_cor]);
            // $saida.="<p>resposta$codigo";
            }//fim do ultimo campo
            
        }//fim de controle de funcao
       
    }//fim foreach $linhas
    $saida.="<div class='span-2'><br /><br /><input id='salvar' type='button' value='Salvar questionario' /><br /><br /></div>";
    $saida.="</form></div>"; //container css
    echo $saida;
}//fim de funcao

function adiciona_formulario($codigo="", $titulo="", $texto="") {
    $titulo=converte_utf8_html($titulo);
    $texto=converte_utf8_html($texto);
    $saida = "<div id='titulo' style='text-align:justify;background-color:#aec8f4;'><h1>$titulo</h1><hr />" ;
    $saida .= "<h3><p>$texto</p></h3></div>";
    return $saida;
    
}//fim de funcao

function adiciona_secao($codigo="", $titulo="") {
    $titulo=converte_utf8_html($titulo);
    $saida .= "<div id=secao class='span-24' 
    style='padding-left: 10px; font-family : tahoma; font-size : 12px; text-align:justify;background-color:#aec8f4;'>
    <hr /><h2>$titulo</h2><hr /></div>";
    return $saida;
    
}//fim de funcao

function adiciona_pergunta($codigo="", $titulo="", $tamanho_pergunta=0, $cor='') {
    $titulo=converte_utf8_html($titulo);
    if ($tamanho_pergunta>50){
	$posicao='span-15 colborder';
    }else {
        $posicao='span-15';
    }
    $saida .= "<div id=$codigo class= $posicao
       style='padding-left: 30px; font-family : tahoma; font-size : 12px; text-align:justify;background-color:$cor;'>
    <h3 id='$codigo'>$titulo</h3></div>";
   
    return $saida;
       
}//fim de funcao 


function adiciona_resposta( $codigo="", $titulo="", $tipo="", $tabela="", $tamanho_pergunta=0, $cor='' ) {
    
   // $tabela = converte_utf8_html($tabela);
   if ($tamanho_pergunta>50 or $tipo=="Resposta tipo COMBO" or $tipo=="Resposta digitada TEXT"){
    $posicao='span-6 last';
    $pula_linha='';
   }else {
    $posicao='span-15';
    $pula_linha='<br />';
   }
   
   //if (trim("$tipo")!=trim("Múltiplas respostas CHECK") ){ 
    $saida .= "<div id='resposta'  class=$posicao
    style='padding-left: 50px; font-family : tahoma; font-size : 12px; text-align:justify;'> ";
   /*}else {
    $saida .= "<div id=$codigo  class=$posicao
    style='padding-left: 50px; font-family : tahoma; font-size : 12px; text-align:justify;background-color:$cor;'> ";
   }*/
  //  $saida .="<fieldset>";//" <legend>$titulo</legend>";
   // echo $tipo;
    //resposta checkbox
    if (trim("$tipo")==trim("Lista com Mu00faltiplas escolhas") ){
        $niveis=explode(";", $tabela);
	
        foreach($niveis as $nivel) {
            if (strlen($nivel)>0) {
		//$nivel=converte_utf8_html($nivel);
		
		$exibe_nivel=converte_utf8_html($nivel);
		$campo = pega_resultado_questao($codigo);
		$campo = converte_utf8_especial($campo);
		$array_campo = explode('|', $campo);
		
		//echo "<p>--$array_campo[3]==$nivel--".in_array($array_campo,$nivel);
		if (existe($array_campo,$nivel)) {
		    $saida .="<br /><input type='checkbox' name='$codigo"."[]' id='$codigo"."[]' value='$exibe_nivel' checked /> $exibe_nivel <br />";
		}else {
		    $saida .="<br /><input type='checkbox' name='$codigo"."[]' id='$codigo"."[]' value='$exibe_nivel' /> $exibe_nivel <br />";
		}
		
		
	    }
        }
         
    }
    //resposta radio
    if (trim("$tipo")==trim("Resposta única RADIO") ){
        $niveis=explode(";", $tabela);
	
        foreach($niveis as $nivel) {
            if (strlen($nivel)>0) {
		$saida .="<input type='radio' name='$codigo' id='$codigo' value='$nivel' /> $nivel <br /> ";
	    }
        }
         
    }
        //resposta TEXT
    if (trim("$tipo")==trim("Resposta digitada TEXT") ){
       // $niveis=explode(";", $tabela);
       $campo = pega_resultado_questao($codigo);
        $saida .="<input type='TEXT' name='$codigo' id='$codigo' value='$campo' />  ";
    }

            //resposta COMBO

    if (trim("$tipo")==trim("Resposta tipo COMBO") ){
        $niveis=explode(";", $tabela);
        $saida .="<select name='$codigo' id='$codigo'> ";	
        foreach($niveis as $nivel) {
            if (strlen($nivel)>0) {
		$exibe_nivel=converte_utf8_html($nivel);
		$campo = pega_resultado_questao($codigo);
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
    if (trim("$tipo")==trim("Resposta aberta objetiva") ){
            $campo = pega_resultado_questao($codigo);
            $saida .="<br /><textarea rows='4' cols='30' name='$codigo' id='$codigo' >$campo  </textarea> ";
    }
    //$saida .="</fieldset>";
    $saida .="<br /></div><br />"; //fim item_resposta;
    return $saida;
       
}//fim de funcao

function pega_resultado_questao($codigo='', $nivel=''){
    
    $sql = "select q$codigo from tabelas.usuario_".$_SESSION[codigo]." where matricula='".$_SESSION[registro]."'";
    
    
    $ret = db_query($sql);
    if ( $ret ) {
	
	$linha=db_fetch_array($ret);
    }
//    echo "<p>".$sql;
    $saida = $resposta=str_replace("&pound;",'', $linha["q$codigo"]);
    $saida = $resposta=str_replace("&iexcl;",'', $saida);
    return  $saida ;
}
/*
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
*/
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
?>

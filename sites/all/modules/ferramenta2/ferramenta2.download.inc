<?php

/*
Programa de aplicacao do questionario
*/
//header ('Content-Type: text/plain; charset=ISO-8859-2');
//escuro

function download_avaliacao() {
    
    $controle = addslashes(arg(2));	
    $codigo = addslashes(arg(3));
    if ($controle==1) {
        instrumento($codigo);
    }else if ($controle==2){
        dados($codigo);
    }else {
    echo "erro";
    }
}

function instrumento($codigo) {

  if (verifica($codigo)=="erro"){
    echo "erro";
    return;
  }
   header("Content-type: application/csv");
   header("Content-Disposition: \"inline; filename=instrumento.txt ");
   
    $resultado=db_fetch_object($ret);
    
    $saida= $resultado->json ;
    $saida =  str_replace('","','||',$saida);
    $saida= explode("||", $saida); //pega cada linha e divide em um array assim=> "identificador": "f", pegando cada linha individualmente
    $saida =  str_replace('":"','||',$saida);
    
    $array_linha =  str_replace('"','',$saida);
    $saida='';
 
    foreach($array_linha as $linhas) {
        $linha = explode("||",$linhas);
        
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
	       $saida .="\n";
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
             $saida.="\t\t\tQ:$codigo_objeto";
            }//fim do ultimo campo
            
        }//fim de controle de funcao
       
    }//fim foreach $linhas
   
    
    echo $saida;

return;
}

function adiciona_formulario($codigo="", $titulo="", $texto="") {
    $titulo=converte_utf8_html($titulo);
    $texto=converte_utf8_html($texto);
    $saida = "$titulo \n" ;
    $saida .= "$texto";
    return $saida;
    
}//fim de funcao

function adiciona_secao($codigo="", $titulo="") {
    $titulo=converte_utf8_html($titulo);
    $saida .= " \n $titulo \n";
    return $saida;
    
}//fim de funcao

function adiciona_pergunta($codigo="", $titulo="", $tamanho_pergunta=0, $cor='') {
    $titulo=converte_utf8_html($titulo);
    $saida .= "\n $titulo\n";
   
    return $saida;
       
}//fim de funcao 

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

function dados($codigo) {

  if (verifica($codigo)=="erro"){
    echo "erro";
    return;
  }

  header("Content-type: application/csv");
  header("Content-Disposition: \"inline; filename=dados.csv");
  $sql = "select * from tabelas.usuario_$codigo--"; //protegendo a avaliacao
  $res=db_query($sql);
  $i = pg_num_fields($res);
  for ($j = 0; $j < $i; $j++) {
      $fieldname = pg_field_name($res, $j);
      $saida .="$fieldname;";
  }
  $saida .="\n";
  
  echo $saida;
  $res=db_query($sql);
  $i = pg_num_fields($res);
  $saida="";
  while ($linha = pg_fetch_array($res)) {
    for ($j = 0; $j < $i; $j++) {
	if (pg_field_type($res, $j)=='varchar') {
	    $saida .="\"$linha[$j]\","; //acrescenta aspas
	}else {
	    $saida .="$linha[$j],"; //acrescenta aspas
	}
       
       
    }
   
    $saida.="\n";
  }
  echo $saida;
}

function verifica($codigo){
 global $user;
 $sql = "select * from ferramenta2.formulario where link='$codigo' and uid=$user->uid"; //protegendo a avaliacao
  // echo $sql;
 $ret=db_query($sql);
 if (pg_num_rows($ret) <=0 ){
    return "Erro";
 }else {
    return "ok";
 }
} //fim verifica
?>

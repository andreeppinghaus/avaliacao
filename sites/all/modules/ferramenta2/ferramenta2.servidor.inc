<?php

/*
Funcao responsavel por responder a moiria das requisicoes ajax feitas pelo sistema.
*/
function servidor () {

global $user;

$acao = $_POST[acao];
$string = $_POST[json];
$json = json_decode($string, true); //controle do json
//print_r($json);
if ($acao=='ExcluiQuestionario'){
    $titulo = $_POST[titulo];
    if (trim($titulo) != 'undefined') {
    $sql = "delete from ferramenta2.formulario where trim(titulo)=trim('$titulo') and uid=$user->uid";
   //echo $sql;
    db_query($sql);
    echo "Questionário excluído";
    }else {
        echo "Título do questionário não existe";
    }
}
if ($acao == 'GravaQuestionario') {
    
    foreach ($json as $registro) { //percorre os registros
         
        if ($registro[identificador]=='f') { //pesquisa se o registro ja existe
          if ( strlen(trim($registro[titulo])) >0 ) {
            $titulo=$registro[titulo];
            //formatando o json
            
            $string = str_replace('{','',$string);
            $string = str_replace('}','',$string); //grava texto puro sem [] e {} 
            $string = substr($string,1);
            $string = substr($string,0,strlen($string)-1);
       
            $string = str_replace('[','',$string);
            $string = str_replace(']','',$string); //grava texto puro sem [] e {}
            //$string = htmlspecialchars ($string);
           //echo $string;
           if (pesquisa_formulario($titulo)) {
           
            $sql = "update ferramenta2.formulario set json='$string' where trim(titulo)=trim('$titulo')  "; //atualiza questionario
            
           }else {
            $sql = "insert into ferramenta2.formulario(uid,titulo,json) values($user->uid, '$titulo', '$string')"; //insere questionario
           }
         // echo $sql;
           if ( db_query($sql) ) {
                $retorno = "Questionário salvo com o nome: $titulo";
           }else {
                $retorno = "Erro ao gravar o questionario, contacte o administrador";
           }
          }else {
            $retorno="O campo título é obrigatório";
          }
        }
        
    }
    
    echo $retorno;
}

//carrega o autocomplete da busca
if ($acao=="AutoFormulario") {
    $saida = array();
    $sql="select distinct titulo from ferramenta2.formulario where uid=$user->uid";
    //echo $sql;
    $rst = db_query($sql);
     if($rst)  {
        if (pg_num_rows($rst)!=0 ) { //verifica se e vazio
             while ( $linha = pg_fetch_array($rst) ) {
              $saida[]=$linha[0];
             }
        }else {
            $saida=0;
        }
     }
     
echo json_encode($saida);
}

//carraga o instrumento na tela
if ($acao=="CarregaInstrumento") {
    $titulo= $_POST[titulo];
    
    $saida = array();
    $sql="select distinct json from ferramenta2.formulario where trim(titulo)=trim('$titulo') and uid=$user->uid";
   //echo $sql;
    $rst = db_query($sql);
     if($rst)  {
        $linha = pg_fetch_object($rst);
        $saida=converte_utf8_html($linha->json);
     }
  //   print_r($saida);
  
    $saida =  str_replace('","','||',$saida);
   $saida= explode("||", $saida); //pega cada linha e divide em um array assim=> "identificador": "f", pegando cada linha individualmente
   $saida =  str_replace('":"','||',$saida);
    $saida =  str_replace('"','',$saida);
  // print_r($saida);
    
    foreach($saida as $linha) { 
        $registro = explode("||",$linha); //pega a linha ("identificador": "f") e divide em um array [0]="identificador" e [1]= "f"
    //   print_r($registro);
        //pode acontecer que o texto contenha ":" entao vou remontar o array
        $x=1;
        $array_restante='';
        $primeiro_array = $registro[0];

            while ( $x<=count($registro) ) {
                $array_restante .= $registro[$x];
                $x++;
             }
       
        $monta_json[]= array($primeiro_array =>$array_restante);
    }
    
     //print_r($monta_json);
   //$saida  = array("identificador"=>"f","titulo"=>"f");
   //print_r($saida);
echo json_encode($monta_json); //retorna texto puro sem {} 
    
}

if ($acao=="VerificaPreTeste") {
    $titulo= $_POST[titulo];
    $sql = "select distinct link, situacao from ferramenta2.formulario where trim(titulo)=trim('$titulo') and uid=$user->uid ";
    //echo $sql;
    $retorno = db_query($sql);
   // print pg_num_rows($retorno);
    $saida["situacao"]=0;
    if (pg_num_rows($retorno)>0) {
        while ($linha = pg_fetch_object($retorno) ){
           if (strlen($linha->link)>0){
                $saida['link'] = "$linha->link";
                $saida['situacao'] = "$linha->situacao";
           }
        }       
   
    }
    
    echo json_encode($saida);
    
}
/*
if ($acao=="EnviaEmail") {
    
    $to=explode(',',$_POST[email]);
    $titulo=$_POST[titulo];
    $message=$_POST[mensagem];
    $link=$_POST[link];
    
    //$to      = 'nobody@example.com';
    $subject = "Voce foi convidado para participar do preenchimento do pre-teste questionario online chamado: $titulo ";
    $message .= "\r\nLink para o pre-teste:$link";
    $headers = 'From: avaliacao.kinghost.net' . "\r\n" .
        'Reply-To: avaliacao.kinghost.net' . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    foreach ($to as &$para) {
        mail($para, $subject, $message, $headers);
      //  echo "$para, $subject, $message, $headers";
    }
    
    //echo "$to, $subject, $message, $headers";
}
*/

if ($acao=='VerificaColeta'){
    $titulo = $_POST[titulo];
   
    if (trim($titulo) != 'undefined') {
        $sql = "select codigo_formulario, link from ferramenta2.formulario where trim(titulo)=trim('$titulo') and uid=$user->uid";
     //echo $sql;
         $ret = db_query($sql);
        if (pg_numrows($ret)>0){
            $coleta = array();
            $formulario = pg_fetch_object($ret); // pega o codigo do formulario + link
            if ($formulario->codigo_formulario >0){
	    
                $sql = "select  codigo_formulario ,
			to_char(datainicio,'dd/mm/YYYY') as datainicio,
			to_char(datafim, 'dd/mm/YYYY') as datafim,
			email_respondentes , mensagem_avaliador
			from ferramenta2.gerencia
			where codigo_formulario=$formulario->codigo_formulario and uid=$user->uid";
		
                $ret = db_query($sql);
                if (pg_num_rows($ret)>0){
                    $gerencia=pg_fetch_object($ret);
                    $coleta = array('codigo'=>$gerencia->codigo_formulario,
                                    "datainicio"=> $gerencia->datainicio,
                                    "datafim"=>$gerencia->datafim,
                                    "email_respondentes"=> $gerencia->email_respondentes,
                                    "mensagem_avaliador"=> $gerencia->mensagem_avaliador );
                }else {
                    $coleta = array("aviso"=>"vazio", "codigo"=>$formulario->codigo_formulario);
                }
            }else {
                $coleta = array("aviso"=>"instrumento inexistente");
            }
            echo json_encode($coleta);
        }//fim numrows
    }//fim  trim(titulo)
 }//fim de verificacoleta
 
 if ($acao=='AtualizaColeta'){
  
    $atualiza = $_POST[atualiza];
    $dados = $_POST[dados];
    $codigo = $_POST[codigo];
    $datainicio=$_POST[datainicio];
    $datafim=$_POST[datafim];
    $email_respondentes=$_POST[email];
    $mensagem_avaliador=$_POST[mensagem];
    
    if (strlen($datainicio)>0){
	if ($dados==0){
	    $sql = "insert into ferramenta2.gerencia(uid, codigo_formulario,datainicio)
		    values($user->uid, $codigo,to_date('$datainicio', 'DD/MM/YYYY') )";
	    
	}else {
	    $sql = "update ferramenta2.gerencia set datainicio=to_date('$datainicio', 'DD/MM/YYYY')
		    where uid=$user->uid and codigo_formulario=$codigo";
	}
    }
    if (strlen($datafim)>0){
	if ($dados==0){
	    $sql = "insert into ferramenta2.gerencia(uid, codigo_formulario,datafim)
		    values($user->uid, $codigo,  to_date('$datafim', 'DD/MM/YYYY') )";
	    
	}else {
	    $sql = "update ferramenta2.gerencia set datafim=to_date('$datafim', 'DD/MM/YYYY')
		    where uid=$user->uid and codigo_formulario=$codigo";
	}
    }
    if (strlen($email_respondentes)>0){
	if ($dados==0){
	    $sql = "insert into ferramenta2.gerencia(uid, codigo_formulario,email_respondentes)
		    values($user->uid, $codigo,'$email_respondentes')";
	    
	}else {
	    $sql = "update ferramenta2.gerencia set email_respondentes='$email_respondentes'
		     where uid=$user->uid and codigo_formulario=$codigo";
	}
    }
    if (strlen($mensagem_avaliador)>0){
	if ($dados==0){
	    $sql = "insert into ferramenta2.gerencia(uid, codigo_formulario, mensagem_avaliador)
		    values($user->uid, $codigo, '$mensagem_avaliador', )";
	    
	}else {
	    $sql = "update ferramenta2.gerencia set mensagem_avaliador='$mensagem_avaliador'
		    where uid=$user->uid and codigo_formulario=$codigo";
	}
    }
    $ret = db_query($sql);
    if (  ! $ret) {
	watchdog('Problemas em AtualizaColeta no arquivo ferramenta2.servidor.inc', "$ret");
	$retorno = array( "erro"=> "1", "atualiza"=>0);
    }else{
	$retorno = array("erro"=>"0", "atualiza"=>1);
    }
    echo json_encode($retorno);
   
 }//fim AtualizaColeta
 
 
 if ($acao=='EnviaColeta'){

    $email=$_POST[email];
    $mensagem=$_POST[mensagem_avaliador];
    $titulo= $_POST[titulo];
    $codigo= $_POST[codigo];
    
     $sql = "select distinct link, situacao from ferramenta2.formulario where trim(titulo)=trim('$titulo') and uid=$user->uid ";
    //echo $sql;
    $retorno = db_query($sql);
   // print pg_num_rows($retorno);
    if (pg_num_rows($retorno)>0) {
        while ($linha = pg_fetch_object($retorno) ){
           if (strlen($linha->link)>0){
                $link = "$linha->link";
           }
        }       
    }
     
    $subject = 'Voce foi convidado para preencher uma avaliacao on-line da Ferramenta de avaliacao online';
    
    $opts = array('absolute' => TRUE);
    $url_padrao = url('', $opts);
    $url_padrao .="/avaliacao/$link";
    
    $lista_email = explode(",", $email);
    
    $respondente = str_replace("'", "", $respondente);//limpa aspas simples dos emails
    $mensagem_sistema="\n\n Copie e cole este link no seu browser";
    $mensagem_sistema.="\n\n\t\t -> $url_padrao/";
    $mensagem.=$mensagem_sistema;
    
    foreach ($lista_email  as &$respondente) {        
        $link_email = md5($respondente);
        if (mail($respondente, $subject, $mensagem.$link_email)) {
            $saida=array("email"=>"ok");
	    //atualiza sistema para producao
	    $sql = "update ferramenta2.formulario set situacao=2 where trim(titulo)=trim('$titulo') and uid=$user->uid ";
	    db_query($sql);
        } else {
            $saida=array("email"=>"erro");
	    watchdog("EmailColeta - ferramenta2.servidor.inc $respondente, $mensagem, $subject");
	    echo "erro";
        }
    } //fim foreach
    echo json_encode($saida);
 }
return;
} //fim de servidor

?>

<?php
include_once("conecta.base.php");
include_once("monta_avaliacao.php");
/*
echo $_POST['pergunta'];
echo $_POST['resposta'];
echo $_POST['tiporesposta'];
echo $_POST['tabela'];
*/

if ($_REQUEST['acao'] == "insertPergunta") {

    $pergunta= isset($_REQUEST["pergunta"]) ?  $_REQUEST["pergunta"]: "";
    $sql = "select nextval('ferramenta.pergunta_codigo_seq') as cod_pergunta";
    $rst = selecionar($sql);
     if($rst["s"])  {
         $ret = $rst["r"]; //pega o retorno da consulta
         $linha = pg_fetch_assoc($ret);
         $saida=$linha["cod_pergunta"];
         $sql = "insert into ferramenta.pergunta(codigo, texto_pergunta) values($saida, '$pergunta')";
         $rst = executar($sql); //retorna codigo para colocar no htm
     } else {
         $saida = "Erro de gravacao pergunta";
     }
echo $saida;
return;
}

if ($_REQUEST['acao'] == "insertResposta") {
   
    $resposta = isset($_REQUEST["resposta"]) ?  $_REQUEST["resposta"]: "";
    $tiporesposta = isset($_REQUEST["tiporesposta"]) ?  $_REQUEST["tiporesposta"]: "";
    $tabela = isset($_REQUEST["tabela"]) ?  $_REQUEST["tabela"]: "";
    $sql = "select nextval('ferramenta.resposta_codigo_seq') as cod_resposta";
    $rst = selecionar($sql);
     if($rst["s"])  {
         $ret = $rst["r"]; //pega o retorno da consulta
         $linha = pg_fetch_assoc($ret);
         $saida=$linha["cod_resposta"];
         $sql = "insert into ferramenta.resposta(codigo, texto_resposta,tipo, tabela) values($saida, '$resposta', $tiporesposta, '$tabela')";
         $rst = executar($sql); //retorna codigo para colocar no htm
     } else {
         $saida = "Erro de gravacao de resposta";
     }
echo $saida;
return;

}

if ($_REQUEST['acao'] == "insertSecao") {
   
    $secao = isset($_REQUEST["secao"]) ?  $_REQUEST["secao"]: "";
    $sql = "select nextval('ferramenta.sessao_codigo_seq') as cod_secao";
    $rst = selecionar($sql);
     if($rst["s"])  {
         $ret = $rst["r"]; //pega o retorno da consulta
         $linha = pg_fetch_assoc($ret);
         $saida=$linha["cod_secao"]; //retorna codigo para colocar no htm
         $sql = "insert into ferramenta.secao(codigo, nome) values($saida, '$secao')";
         $rst = executar($sql);
     } else {
         $saida = "Erro de gravacao de secao";
     }
echo $saida;
return;

}//fimsecao

if ($_REQUEST['acao'] == "insertFormulario") {
   
    $formulario = isset($_REQUEST["formulario"]) ?  $_REQUEST["formulario"]: "";
    $mensagem = isset($_REQUEST["mensagem"]) ?  $_REQUEST["mensagem"]: "";
    $sql = "select nextval('ferramenta.formulario_codigo_seq') as cod_formulario";
    $rst = selecionar($sql);
     if($rst["s"])  {
         $ret = $rst["r"]; //pega o retorno da consulta
         $linha = pg_fetch_assoc($ret);
         $saida=$linha["cod_formulario"]; //retorna codigo para colocar no html
         $sql = "insert into ferramenta.formulario(codigo, titulo, mensagem) values($saida, '$formulario', '$mensagem')";
         $rst = executar($sql);
     } else {
         $saida = "Erro de gravacao de secao";
     }
echo $saida;
return;
}//fimformulario

/*
if ($_REQUEST['acao'] == "Exclui") {
   
    $resposta = isset($_REQUEST["resposta"]) ?  $_REQUEST["resposta"]: "";
    $tiporesposta = isset($_REQUEST["tiporesposta"]) ?  $_REQUEST["tiporesposta"]: "";
    $tabela = isset($_REQUEST["tabela"]) ?  $_REQUEST["tabela"]: "";
    $sql = "select nextval('ferramenta.resposta_codigo_seq') as cod_resposta";
    $rst = selecionar($sql);
     if($rst["s"])  {
         $ret = $rst["r"]; //pega o retorno da consulta
         $linha = pg_fetch_assoc($ret);
         $saida=$linha["cod_resposta"];
         $sql = "insert into ferramenta.resposta(codigo, texto_resposta,tipo, tabela) values($saida, '$pergunta', $tiporesposta, '$tabela')";
         $rst = executar($sql);
         if ($rst["s"]) {
             $saida=$rst;
         }
     } else {
         $saida = $rst;
     }

}
*/

if ($_REQUEST['acao'] == "InsereItemFormulario") {
    
    $codformulario =  isset($_REQUEST['codformulario']) ? $_REQUEST['codformulario']: 0;
    $codsecao = isset($_REQUEST['codsecao']) ? $_REQUEST['codsecao']: 0;
    $ordem = isset($_REQUEST['ordem']) ?  $_REQUEST['ordem']: 0;

    //exclui item_formulario para incluir novo
    $sql="delete from ferramenta.item_formulario where codformulario=$codformulario";
    $rst = executar($sql);

//         echo $sql;
    $sql = "insert into ferramenta.item_formulario(codformulario, codsecao, ordem) values($codformulario, $codsecao, $ordem)";
//         echo $sql;
        $rst = executar($sql);
         if ($rst["s"]) {
             $saida="ok";
         } else {
         $saida = "Erro de gravacao de formulario";
         }

echo $saida;
return;
}

//ok
if ($_REQUEST['acao'] == "InsereItemSecao") {
    $codsecao = isset($_REQUEST["codsecao"]) ?  $_REQUEST["codsecao"]: "";
    $codpergunta = isset($_REQUEST["codpergunta"]) ?  $_REQUEST["codpergunta"]: "";
    $ordem = isset($_REQUEST["ordem"]) ?  $_REQUEST["ordem"]: 0;

//pega questao
    $sql = "select q.codigo from ferramenta.questao q, ferramenta.pergunta p where q.codpergunta=p.codigo and p.codigo=$codpergunta";
    $rst = selecionar($sql);
     if($rst["s"])  {
         $ret = $rst["r"]; //pega o retorno da consulta
         $linha = pg_fetch_array($ret);
         $questao=$linha[0];

        $sql="delete from ferramenta.item_secao where codsecao=$codsecao";
//         echo $sql;
        $rst = executar($sql);
         //insere em item_secao
         $sql = "insert into ferramenta.item_secao(codquestao,codsecao, ordem ) values($questao, $codsecao, $ordem )";
//         echo $sql;
         $rst = executar($sql);
         echo $rst["s"];
         if ($rst["s"]) {
             $saida="ok";
         }
     } else {
         $saida = "Erro de gravacao de item de secao";
     }

echo $saida;
return;
} //fimsecao


//ok
if ($_REQUEST['acao'] == "InsereItemQuestao") {
    $codsecao = isset($_REQUEST["codsecao"]) ?  $_REQUEST["codsecao"]: "";
    $codpergunta = isset($_REQUEST["codpergunta"]) ?  $_REQUEST["codpergunta"]: "";
    $codresposta = isset($_REQUEST["codresposta"]) ?  $_REQUEST["codresposta"]: "";
    $posicao = isset($_REQUEST["posicao"]) ?  $_REQUEST["posicao"]: 0;
    $ordem = isset($_REQUEST["ordem"]) ?  $_REQUEST["ordem"]: 0;

//pega questao
    $sql = "select q.codigo from ferramenta.questao q, ferramenta.pergunta p where q.codpergunta=p.codigo and p.codigo=$codpergunta";
    $rst = selecionar($sql);
     if($rst["s"])  {
         $ret = $rst["r"]; //pega o retorno da consulta
         $linha = pg_fetch_assoc($ret);
         $questao=$linha["codigo"];

        $sql="delete from ferramenta.item_questao where codquestao=$questao";
//         echo $sql;
        $rst = executar($sql);
         //insere em item_secao
         $sql = "insert into ferramenta.item_questao(codquestao,codresposta, ordem_resposta ) values($questao, $codresposta, $ordem )";
  //       echo $sql;

         $rst = executar($sql);
         if ($rst["s"]) {
             $saida="ok";
         }
         $sql = "update ferramenta.questao set posicao_resposta = $posicao where codigo=$questao";
//        echo $sql;
         $rst = executar($sql);
         if ($rst["s"]) {
             $saida="ok";
         }
     } else {
         $saida = "Erro de gravacao de item questao";
     }

echo $saida;
return;

} //fimquestao

//carrega a lista de formularios para a edicao
if ($_REQUEST['acao'] == "AutoFormulario") {
$saida = array();
    $sql="select distinct titulo from ferramenta.formulario";
    $rst = selecionar($sql);
     if($rst["s"])  {
         $ret = $rst["r"]; //pega o retorno da consulta
         while ( $linha = pg_fetch_array($ret) ) {
          $saida[]=$linha[0];
         }
     }
echo json_encode($saida);
return;
} //fim busca

//carrega a lista de formularios para a edicao
if ($_REQUEST['acao'] == "AtualizaFormulario") {

    $codigo = isset($_REQUEST["codigoformulario"]) ?  $_REQUEST["codigoformulario"]: "";
    $titulo = isset($_REQUEST["titulo"]) ?  $_REQUEST["titulo"]: "";
    $mensagem = isset($_REQUEST["mensagem"]) ?  $_REQUEST["mensagem"]: "";
    
    if ($codigo =="") {
    $saida="erro de codigo de formulario";
    }else{
        if ( strlen($mensagem) > 0  ){
            $sql="update ferramenta.formulario set mensagem='$mensagem' where codigo=$codigo";
        } else if ( strlen($titulo) > 0 ){
            $sql="update ferramenta.formulario set titulo='$titulo' where codigo=$codigo";
        }
        $rst = executar($sql);
         if($rst["s"])  { //ok
             $saida = "ok";
         }else {
             $saida = "Erro de atualizacao de formulario";
         }
     }
echo $saida;
return;
} //fim atualiza

//carrega a lista de formularios para a edicao
if ($_REQUEST['acao'] == "AtualizaSecao") {

    $codigo = isset($_REQUEST["codigo"]) ?  $_REQUEST["codigo"]: "";
    $conteudo = isset($_REQUEST["conteudo"]) ?  $_REQUEST["conteudo"]: "";
    
    if ($codigo =="") {
    $saida="erro de codigo de secao";
    }else{
        if ( strlen($conteudo) > 0  ){
            $sql="update ferramenta.secao set nome='$conteudo' where codigo=$codigo";
        }
        $rst = executar($sql);
         if($rst["s"])  { //ok
             $saida = "ok";
         }else {
             $saida = "Erro de atualizacao de secao";
         }
     }
echo $saida;
return;
} //fim atualiza

//carrega a lista de formularios para a edicao
if ($_REQUEST['acao'] == "AtualizaPergunta") {

    $codigo = isset($_REQUEST["codigo"]) ?  $_REQUEST["codigo"]: "";
    $conteudo = isset($_REQUEST["conteudo"]) ?  $_REQUEST["conteudo"]: "";
    
    if ($codigo =="") {
    $saida="erro de codigo de pergunta";
    }else{
        if ( strlen($conteudo) > 0  ){
            $sql="update ferramenta.pergunta set texto_pergunta='$conteudo' where codigo=$codigo";
        }
        $rst = executar($sql);
         if($rst["s"])  { //ok
             $saida = "ok";
         }else {
             $saida = "Erro de atualizacao de pergunta";
         }
     }
echo $saida;
return;
} //fim atualiza

//carrega a lista de formularios para a edicao
if ($_REQUEST['acao'] == "AtualizaResposta") {

    $codigo = isset($_REQUEST["codigo"]) ?  $_REQUEST["codigo"]: "";
    $texto_resposta = isset($_REQUEST["texto"]) ?  $_REQUEST["texto"]: "";
    $tipo = isset($_REQUEST["tipo"]) ?  $_REQUEST["tipo"]: "";
    $tabela = isset($_REQUEST["tabela"]) ?  $_REQUEST["tabela"]: "";
    
    if ($codigo =="") {
    $saida="erro de codigo de resposta";
    }else{
        if ( strlen($texto_resposta) > 0  ){
            $sql="update ferramenta.resposta set texto_resposta='$texto_resposta' where codigo=$codigo";
        } else if ( strlen($tipo) > 0 ){
            $sql="update ferramenta.resposta set tipo='$tipo' where codigo=$codigo";
        } else if ( strlen($tabela) > 0 ){
            $sql="update ferramenta.resposta set tabela='$tabela' where codigo=$codigo";
        }
        $rst = executar($sql);
         if($rst["s"])  { //ok
             $saida = "ok";
         }else {
             $saida = "Erro de atualizacao de formulario";
         }
     }
echo $saida;
return;
} //fim atualiza


//pega o instrumento escolhido pelo usuario para edicao no html
if ($_REQUEST['acao'] == "CarregaInstrumento") {
    $titulo = isset($_REQUEST["titulo"]) ?  $_REQUEST["titulo"]: "";
      
    $sql="select distinct se.codigo as cod_secao, se.nome as texto_secao, q.codigo as cod_questao, p.codigo as cod_pergunta,
    p.texto_pergunta as texto_pergunta, r.codigo as cod_resposta ,r.texto_resposta as texto_resposta, i.ordem_resposta ,
    r.tipo as tipo_resposta, r.tabela as tabela_resposta, itf.ordem as ordem_temformulario, its.ordem as ordem_itemsecao,
    itf.codformulario, f.titulo, f.mensagem from ferramenta.questao q, ferramenta.pergunta p, ferramenta.item_questao i,
    ferramenta.resposta r, ferramenta.item_secao its, ferramenta.secao se, ferramenta.item_formulario itf, ferramenta.formulario f
    where q.codigo=i.codquestao and q.codpergunta=p.codigo and i.codresposta=r.codigo and q.codigo=its.codquestao and
    its.codsecao=se.codigo and se.codigo=itf.codsecao and itf.codformulario=f.codigo and trim(f.titulo)=trim($titulo)
    order by itf.ordem, its.ordem,i.ordem_resposta";
  // echo $sql;
    $rst = selecionar($sql);
    if (!$rst["s"]) {
        $sql = "";
    }
     if($rst["s"])  {
         $ret = $rst["r"]; //pega o retorno da consulta
         $saida = exibe_formulario($ret);
     }else {
         $saida="erro";
     }

echo $saida;
return;

} //fim busca


//exclui formulario da base
if ($_REQUEST['acao'] == "ExcluiFormulario") {

    $codigo = isset($_REQUEST["codigo"]) ?  $_REQUEST["codigo"]: "";
    
    if ($codigo =="") {
    $saida="erro de codigo de formulario";
    }else{
            $sql="delete from ferramenta.item_formulario where codformulario=$codigo";
            $rst = executar($sql);
            $sql="delete from ferramenta.formulario where codigo=$codigo";
            $rst = executar($sql);
             if($rst["s"])  { //ok
                 $saida = "ok";
             }else {
                 $saida = "Erro de exclusao de formulario";
             }
     }
echo $saida;
return;
} //fim atualiza

//exclui secao, item_secao da base
if ($_REQUEST['acao'] == "ExcluiSecao") {

    $codigo = isset($_REQUEST["codigo"]) ?  $_REQUEST["codigo"]: "";
    
    if ($codigo =="") {
    $saida="erro de codigo de secao";
    }else{
            $sql="delete from ferramenta.item_secao where codsecao=$codigo";
            $rst = executar($sql);
            $sql="delete from ferramenta.secao where codigo=$codigo";
            $rst = executar($sql);
             if($rst["s"])  { //ok
                 $saida = "ok";
             }else {
                 $saida = "Erro de exclusao de secao";
             }
     }
echo $saida;
return;
} //fim atualiza


//exclui pergunta, item_questao, questao da base
if ($_REQUEST['acao'] == "ExcluiPergunta") {

    $codigo = isset($_REQUEST["codigo"]) ?  $_REQUEST["codigo"]: "";
    
    if ($codigo =="") {
    $saida="erro de codigo de secao";
    }else{
            $sql="select codigo from ferramenta.questao where codpergunta=$codigo";
            $rst = selecionar($sql);
           if($rst["s"])  {
                $ret = $rst["r"]; //pega o retorno da consulta
                $linha = pg_fetch_assoc($ret);
                $questao=$linha["codigo"];
                $sql="delete from ferramenta.item_questao where codquestao=$questao";
                $rst = executar($sql);
                $sql="delete from ferramenta.questao where codigo=$questao";
                $rst = executar($sql);
                $sql="delete from ferramenta.pergunta where codigo=$codigo";
                $rst = executar($sql);
           }

             if($rst["s"])  { //ok
                 $saida = "ok";
             }else {
                 $saida = "Erro de exclusao de pergunta";
             }
     }
echo $saida;
return;
} //fim atualiza

//exclui resposta da base
if ($_REQUEST['acao'] == "ExcluiResposta") {

    $codigo = isset($_REQUEST["codigo"]) ?  $_REQUEST["codigo"]: "";
    
    if ($codigo =="") {
    $saida="erro de codigo de resposta";
    }else{
            $sql="delete from ferramenta.resposta where codigo=$codigo";
            $rst = executar($sql);
             if($rst["s"])  { //ok
                 $saida = "ok";
             }else {
                 $saida = "Erro de exclusao de secao";
             }
     }
echo $saida;
return;
}

//------------ fim 
exit;

function existe($sql) {
    $existe=1;

    $rst = selecionar($sql);
     $ret = $rst["r"]; //pega o retorno da consulta

if (pg_num_rows($ret) >0) {
    $existe=0;
}
return $existe;
}

?>

/**
 * @author andre
 */
// cria variaveis globais para armazenar o numero no computador
var cod_formulario = 0;
var cod_secao      = 0;
var ordem_secao    = 0;
var ordem_questao  = 0;
var cod_pergunta   = 0;
var cod_resposta   = 0;
var resultado_consulta;
//variavel para gurdar o conteudo anterior para evitar um flood de update
var conteudo_original;

$(function(){

//armazena o link do modulo ferramenta
var servidor= $("#servidor").attr("value");


//ordem dos objetos no banco
var ordem_secao=1, ordem_pergunta=1, ordem_resposta=1;

//esconde a mensagem
        $("#mensagem").hide();

        $("#dialog-pergunta").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            buttons: {
            'Adiciona': function() {
                    var pergunta_texto = $("#pergunta_texto");
                    identificador++;
                    var nivel = "<div id=f" + identificador + " style=\"padding-left :" + nivel_pergunta + "px; font-family : tahoma; font-size : 12px;\" >";
                    if (pergunta_texto.length < 40) {
                        // linha input type=text
                        $("#linhas").append("<li>"+ nivel + 
                            "<input type=checkbox id='escolhe-check" + identificador + "' value='" + identificador + "' />" +
                            "<input type=text id='linha-pergunta" + identificador + "' size='60'  value='" + pergunta_texto.val() + "' />" +
                            "Pergunta</div></li>");
                    }
                    else {
                        // linha input type=memo
                        $("#linhas").append("<li id=li" + identificador + ">" + nivel + 
                                "<input type=checkbox id='escolhe-check" + identificador + "' value='" + identificador + "' /> " +
                                "<br><textarea id='linha-pergunta" + identificador + "'>" + pergunta_texto.val() + " </textarea>" +
                                "Pergunta</div></li>");
                    }

                    $.ajax({
                                 type: "POST",
                                 url: servidor + "/js/servidor.php",
                                 data: "acao=insertPergunta&pergunta=" + pergunta_texto.val(),
                                 success: function(cod_pergunta){
                                 //exibe mensagem
                                       $("#aviso").remove();
                                       $("#valor").append("<div id=aviso>Pergunta salva</div>");
                                       $("#mensagem").fadeIn('slow');
                                //insere o numero da pergunta no html
//                                       cod_pergunta=459;
                                       $("#recuo"+identificador).append("<input type=hidden id=cod_pergunta" + identificador + " value="+cod_pergunta+" />" );
//                                   alert( "Data Saved: " + cod_pergunta );
                                }
                             });

                    $(document).ready(function(){
                        //linhas em arvore dragsort
                        $("#linhas").dragsort({
//                                            dragEnd: function() {grava_elementos(); }
                                                                });
                        })//fim document
                    $(this).dialog('close');

                },
            'Cancela': function() {
                $(this).dialog('close'); 
                }
            }

            });

        $('#adiciona-pergunta').button().click(function() {
        $('#dialog-pergunta').dialog('open');
        });

        $("#dialog-resposta").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            buttons: {
            'Adiciona': function() {
                    var resposta_texto = $("#resposta_texto");
                    var tipo_resposta = $("#seleciona_resposta");
                    var tabela = $("#tabela");
                    
                    identificador++;
                    var nivel = "<div id=recuo" + identificador + " style=\"padding-left :" + (nivel_pergunta+20) + "px; font-family : tahoma; font-size : 12px;\" >";
                        // linha input type=text
                        $("#linhas").append("<li id=li" + identificador + ">" + nivel + 
                                            "<input type=checkbox id='escolhe-check" + identificador + "' value='" + identificador + "' />" +
                                            "<input type=text id='linha-resposta" + identificador + "' size='60'  value='" + resposta_texto.val() + "'/>"+
                                            "Resposta " +
                                            "<p> Tipo:" +
                                            "<select id=seleciona_resposta" + identificador +" >" + 
                                            "<option value=0>Sem resposta</option>" +
                                            "<option value=1>M&uacute;ltiplas respostas CHECK</option>" +
                                            "<option value=2>Resposta &uacute;nica RADIO</option>" +
                                            "<option value=3>Resposta digitada TEXT</option>" +
                                            "<option value=4>Resposta tipo combo</option>" +
                                            "<option value=5>Resposta MEMO</option>" +
                                            "</select>" +
                                           "<p> Tabela:" +
                   "<input type=text id='tabela-resposta" + identificador + "' size='20'  value='" + tabela.val() + "' /> </p> " +
                   " </div></li>");
    // colocando a opcao selecionada no select
                        $("#seleciona_resposta"+identificador).attr("value",tipo_resposta.val() );


                    $.ajax({
                                 type: "POST",
                                 url: servidor + "/js/servidor.php",
                                 data: "acao=insertResposta&resposta=" + resposta_texto.val() + "&tiporesposta=" +
                                        tipo_resposta.val() + "&tabela=" + tabela.val(),
                                 success: function(cod_resposta){
                                       $("#aviso").remove();

                                       $("#valor").append("<div id=aviso>Resposta salva</div>");
                                       $("#mensagem").fadeIn('slow');
                                //insere o numero da pergunta no html
//cod_resposta=143;
                                       $("#recuo"+identificador).append("<input type=hidden id=cod_resposta" + identificador + " value="+cod_resposta+" />" );
//                                     alert( "Data Saved: " + msg );
                                }
                             });

                    $(document).ready(function(){
                        //linhas em arvore dragsort
                        $("#linhas").dragsort({
//                                            dragEnd: function() { grava_elementos(); }
                                                                });
                        })//fim document
                    $(this).dialog('close');

                },
            'Cancela': function() {
                $(this).dialog('close'); 
                }
            }

            });

        $('#adiciona-resposta').button().click(function() {
        $('#dialog-resposta').dialog('open');
        });

        $("#dialog-secao").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            buttons: {
            'Adiciona': function() {
                    var secao_texto = $("#secao_texto");
                    identificador++;
                    var nivel = "<div id=s" + identificador + " style=\"padding-left :10px; font-family : tahoma; font-size : 12px;\" >";
                    if (secao_texto.length < 40) {
                        // linha input type=text
                        $("#linhas").append("<li>" + nivel + 
                            "<input type=checkbox id='escolhe-check" + identificador + "' value='" + identificador + "' />" +
                            "<input type=text id='linha-secao" + identificador + "' size='60'  value='" + secao_texto.val() + "' />" +
                            "Secao</div></li>");
                    }
                    else {
                        // linha input type=memo
                        $("#linhas").append("<li id=li" + identificador + ">" + nivel + 
                                "<input type=checkbox id='escolhe-check" + identificador + "' value='" + identificador + "' /> " +
                                "<br><textarea id='linha-secao" + identificador + "'>" + secao_texto.val() + " </textarea>" +
                                "Secao</div></li>");
                    }

                    $.ajax({
                                 type: "POST",
                                 url: servidor + "/js/servidor.php",
                                 data: "acao=insertSecao&secao=" + secao_texto.val(),
                                 success: function(cod_secao){
                                 //exibe mensagem
                                       $("#aviso").remove();
                                       $("#valor").append("<div id=aviso>Secao salva</div>");
                                       $("#mensagem").fadeIn('slow');
                                //insere o numero da pergunta no html
//cod_secao=79
                                       $("#recuo"+identificador).append("<input type=hidden id=cod_secao" + identificador + " value="+cod_secao+" />" );
//                                   alert( "Data Saved: " + cod_pergunta );
                                }
                             });

                    $(document).ready(function(){
                        //linhas em arvore dragsort
                        $("#linhas").dragsort({
//                                            dragEnd: function() { grava_elementos(); }
                                                                });
                        })//fim document
                    $(this).dialog('close');

                },
            'Cancela': function() {
                $(this).dialog('close'); 
                }
            }

            });

        $('#adiciona-secao').button().click(function() {
        $('#dialog-secao').dialog('open');
        });

        $("#dialog-formulario").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            buttons: {
            'Adiciona': function() {
                    var formulario_texto = $("#formulario_texto");
                    var formulario_mensagem = $("#formulario_mensagem");
                    identificador++;
                    var nivel = "<div id=f" + identificador + " style=\"padding-left :0px; font-family : tahoma; font-size : 12px;\" >";
                        // linha input type=memo
                        $("#linhas").append("<li>" + nivel +
                                "seta"+
                                "<input type=checkbox id='escolhe-check" + identificador + "' value=" + identificador + " /> " +
                                "<br><textarea rows='5' cols='70' id='linha-formulario" + identificador + "'>" + formulario_texto.val() + " </textarea>" +
                                "<br><textarea rows='5' cols='70' id='formulario-mensagem" + identificador + "'>" + formulario_mensagem.val() + 
                                " </textarea>" +
                                "Formulario</div></li>");
/*
 //grava no banco
                    $.ajax({
                                 type: "POST",
                                 url: servidor + "/js/servidor.php",
                                 data: "acao=insertFormulario&formulario=" + formulario_texto.val()+"&mensagem="+formulario_mensagem.val(),
                                 success: function(cod_formulario){
                                 //exibe mensagem
                                       $("#aviso").remove();
                                       $("#valor").append("<div id=aviso>Formulario salvo</div>");
                                       $("#mensagem").fadeIn('slow');
                                //insere o numero da pergunta no html
  //                                     cod_formulario=21;
                                       $("#recuo"+identificador).append("<input type=hidden id=cod_formulario"+ identificador +" value="+cod_formulario+" />" );
//                                   alert( "Data Saved: " + cod_pergunta );
                                }
                             });
*/
                    $(document).ready(function(){
                        //linhas em arvore dragsort
                        $("#linhas").dragsort({
//                                            dragEnd: function() { grava_elementos(); }
                                                                });
                        })//fim document
                    $(this).dialog('close');

                },
            'Cancela': function() {
                $(this).dialog('close'); 
                }
            }

            });

        $('#adiciona-formulario').button().click(function() {
        //$('#dialog-formulario').dialog('open');
       
        });

    var identificador = 0; //variavel de indice para cada objeto
    var nivel_pergunta = 1;
    
    // Chamada para a mensagem de aviso de checkbox vazio 
    $("#aviso_marcarcheck").dialog({
        bgiframe: true,
        modal: true,
        autoOpen: false,
        position: 'left',
        buttons: {
            Ok: function(){
                $(this).dialog('close');
            }
        }
    });
    
    // quando clica no questionario pega a pergunta e edita ela no painel de controle.
    $("input").live("click", function(){
        var check = $(this).attr("id");
        var indice = $(this).attr("value"); //pega o valor do indice
        //	alert(indice);
        var texto = $("#linha-pergunta" + indice).attr("value");//pega o valor da linha
        //alert(texto);
        $("#pergunta").attr("value", texto);
        
    });
    
    //remove uma pergunta com o checbox marcado
    $("#excluir").button().click(function(event){
//        var val = [];
        var verifica_check = 0;
        $(':checkbox:checked').each(function(i){
            verifica_check = 1;
            
        });
        if (verifica_check == 0) {
            $("#aviso_marcarcheck").dialog('open');
			return;
        }
        var r = confirm("Deseja EXCLUIR o(s) Item(s) Selecionados ?");
        if (r == true) {
            $(':checkbox:checked').each(function(i){
                verifica_check = 1;
                var valor = $(this).val();
                //aqui basta colocar as regras de exclusao de campos de formulario, item_formulario, sessao, etc
                var codigo = $("#cod_formulario" + valor).attr("value");
                if (codigo>0) {
                    acao="acao=ExcluiFormulario&codigo="+codigo;
                    grava_item(acao);
                }
                codigo = $("#cod_secao" + valor).attr("value");
                if (codigo>0) {
                    acao="acao=ExcluiSecao&codigo="+codigo;
                    grava_item(acao);
                }
                codigo = $("#cod_pergunta" + valor).attr("value");
                if (codigo>0) {
                    acao="acao=ExcluiPergunta&codigo="+codigo;
                    grava_item(acao);
                }
                codigo = $("#cod_resposta" + valor).attr("value");
                if (codigo>0) {
                acao="acao=ExcluiResposta&codigo="+codigo;
                    grava_item(acao);
                }
                $("#li" + valor).remove();
            });
        }
        
    });
   

    //exibe
    //grava os elementos de N para N
    //
    $("#salvar").button().click(function(event){ //botao salvar
            grava_elementos();
//            alert(cod_formulario );
            if ( cod_formulario==0 || cod_pergunta==0 || cod_secao==0 || cod_resposta==0 ) {
                $("#aviso").remove();
                $("#valor").append("<div id=aviso>O instrumento deve possuir pelo menos 1 formulario, uma secao, uma pergunta e uma resposta.</div>");
                $("#mensagem").fadeIn('slow');
                }
                
        });
   function grava_elementos(){
                 $("#linhas li").each(function() {
                     //pega o valor de check
                     var indice =  $(this).children("div").children("input").attr("value")  ;

                   //pega o conteudo do text input
                    var elemento = $(this).children('div').find('input:first').nextAll('input,textarea').attr('id')  ; 

                //pega formulario
                        if (elemento.search("linha-formulario") == 0 ) {
                            cod_formulario = parseInt($("#cod_formulario"+indice).attr("value") );
                            elemento[0]=1;
                        }
                //pega sessao e grava na tabela de itens   
                        if (elemento.search("linha-secao") == 0 ) {
                            elemento[1]=1;
                            
                            cod_secao = $("#cod_secao"+indice).attr("value");
                            var acao='acao=InsereItemFormulario&codformulario='+cod_formulario+'&codsecao='+ cod_secao + '&ordem='+ordem_secao;
                            grava_item(acao);
                            ordem_secao++; 
                        }
                //pega sessao, pergunta e grava na tabela de itens   
                        if (elemento.search("linha-pergunta") == 0 ) {
                            elemento[2]=1;
                            cod_pergunta = $("#cod_pergunta"+indice).attr("value");
                            var acao='acao=InsereItemSecao&codsecao='+cod_secao+'&codpergunta='+ cod_pergunta+'&ordem='+ordem_pergunta;
                            grava_item(acao);
                            ordem_pergunta++;
                        }

            //pega resposta, sessao, pergunta e grava na tabela de itens
                        if (elemento.search("linha-resposta") == 0 ) {
                            elemento[3]=1;
                             posicao = $("#recuo" + indice).css("padding-left"); //pega o valor do css padding retorno = 1px para a posicao 1 
                             ultima_posicao = posicao.length;
                             posicao = Number(posicao.substring((ultima_posicao - 2), 0));
                            cod_resposta = $("#cod_resposta"+indice).attr("value");
                var acao="acao=InsereItemQuestao&codsecao="+cod_secao+"&codpergunta="+ cod_pergunta + "&codresposta="+cod_resposta+"&posicao="+posicao+
                          "&ordem="+ordem_resposta;
                            grava_item(acao);
                            ordem_resposta++;
                        }


                     }); //fim de each de li

    }; //fim grava elementos

    //funcao para gravar os objetos (item_secao, item_questao, item_formulario) na tabela
    //Tambem utilizada para atualizar todos os campos do instrumento
    function grava_item(acao) {
                    $.ajax({
                                 type: "POST",
                                 url: servidor + "/js/servidor.php",
                                 data: acao,
                                 success: function(retorno){
                                 //exibe mensagem
                                      // $("#aviso").remove();
                                       if (retorno=="ok") {
                                           $("#valor").append("<div id=aviso>Salvo</div>");
                                       }else {
                                           $("#valor").append("<div id=aviso>"+retorno+"</div>");
                                       }
                                       $("#mensagem").fadeIn('slow');
                                //insere o numero da pergunta no html
//                                     $("#recuo"+identificador).append("<input type=hidden id=cod_formulario"+ identificador +" value='"+cod_formulario+"' />" );
//                                   alert( "Data Saved: " + cod_pergunta );
                                }
                             });
    }//fim grava_item

    //monta o autosearch de tagsa

    $.ajax({
         type: "POST",
         dataType: "json",//necessario este parametro para retorno do json
         url: servidor + "/js/servidor.php", 
         data:'acao=AutoFormulario' ,
         success: function(retorno){
             $("#tags").autocomplete({
                    source: retorno //preenche com os dados da tabela
                });

           }
     }); //fim autosearch

    $('#tags').keypress(function(event) {
        if (event.keyCode == '13') {
              event.preventDefault();
                var titulo=$("#tags").attr("value") ;
                titulo = escape(titulo);
                var acao =  "acao=CarregaInstrumento&titulo='"+titulo+"'"; //pega o instrumento todo
                var aviso = "Formulario Carregado";
                pega_consulta(acao, aviso);
          }
                          
      }); //fim keypress

    $("#tags").autocomplete({

        select: function(event, ui) {  //quando selecionar o que fazer ?
        var titulo=$("#tags").attr("value") ;
        titulo = escape(titulo);
        var acao =  "acao=CarregaInstrumento&titulo='"+titulo+"'"; //pega o instrumento todo
        var aviso = "Formulario Carregado";
        pega_consulta(acao, aviso);

        }
        }); //fim autocomplete

    //monta o autosearch de dialogs
function carrega_campos(tag, acao) {

    $.ajax({
         type: "POST",
         dataType: "json",//necessario este parametro para retorno do json
         url: servidor + "/js/servidor.php", 
         data:'acao=AutoFormulario' ,
         success: function(retorno){
             $("#"+tag).autocomplete({
                    source: retorno //preenche com os dados da tabela
                });

           }
     }); //fim autosearch

    $('#'+tag).keypress(function(event) {
        if (event.keyCode == '13') {
              event.preventDefault();
                var titulo=$("#"+tags).attr("value") ;
               // titulo=escape(titulo);
                var acao =  "acao=CarregaInstrumento&titulo='"+titulo+"'"; //pega o instrumento todo
                var aviso = "Formulario Carregado";
                pega_consulta(acao, aviso);
          }
                          
      }); //fim keypress

    $("#tags").autocomplete({

        select: function(event, ui) {  //quando selecionar o que fazer ?
        var titulo=$("#tags").attr("value") ;
        //titulo=escape(titulo);      
        var acao =  "acao=CarregaInstrumento&titulo='"+titulo+"'"; //pega o instrumento todo
        var aviso = "Formulario Carregado";
        pega_consulta(acao, aviso);

        }
    }); //fim autocomplete

}//fim de carrega campos
      // pega o formulario completo e escreve na div #linhas
    function pega_consulta(acao, aviso) {
                    $.ajax({
                                 type: "POST",
                                 url: servidor + "/js/servidor.php",
                                 data: acao,
                                 success: function(retorno){
                                 //exibe mensagem
                                 
                                     if (retorno=="erro") {
                                       $("#valor").empty();
                                       $("#valor").append("<div id=aviso> Instrumento inexistente</div>");
                                       $("#mensagem").fadeIn('slow');
                                       $("#linhas").empty();
                                     }else {
                                       $("#valor").empty();
                                       $("#valor").append("<div id=aviso>"+aviso+"</div>");
                                       $("#mensagem").fadeIn('slow');
                                       $("#linhas").empty();

                                       $("#linhas").append(retorno);
                                       //atribui metodos aos campos novos
                                       metodos();
                                       }
                                   }
                             });
    }//fim pega_consulta


                    //Marca todos os checkbox
    $("#marcar-todas").click(function(event){
        $("input").attr("checked", "checked");
    });
    
    //Desmarca todos os checkbox 
    $("#desmarcar-todas").click(function(event){
        $("input").removeAttr("checked");
        
    });
    
    
    //Aumenta o recuo do checkbox neessario salvar no banco
    $("#aumentar-recuo").click(function(event){
        var val = [];
        var posicao = 0; //variavel que recalcula a posicao do css style padding-left
        var ultima_posicao = 0;//pega o valor total da string
        var verifica_check = 0; //flag de controle para verificar se tem checkbox
        $(':checkbox:checked').each(function(i){ //procura todos os checbox marcados 
            verifica_check = 1;
            val[i] = $(this).val();//pega o valor de cada chekbox marcado
           //     alert( val[i]);
           // 	return;
            posicao = $("#recuo" + val[i]).css("padding-left"); //pega o valor do css padding retorno = 1px para a posicao 1
            //	alert(posicao); //mostra o conteudo da variavel pading
            ultima_posicao = posicao.length;//pega o tamanho total da string
            //alert(ultima_posicao); //mostra o valor total da string
            // pega do tamanho total da string -2 ( retirando o px) ate a posicao zero
            posicao = Number(posicao.substring((ultima_posicao - 2), 0));
            // alert(posicao); //exibe
            posicao = posicao + 20; //acrescenta +20 na posicao 
            //alert(posicao); //mostra a ultima POSICAO
            $("#recuo" + val[i]).css("padding-left", posicao + "px");//altera o css com o valor novo
        });

// verifica se anterior e uma pergunta

        if (verifica_check == 0) {
            $("#aviso_marcarcheck").dialog('open');
        }
        
    });
    
    //Aumenta o recuo do checkbox neessario salvar no banco
    $("#diminuir-recuo").click(function(event){
        var val = [];
        var posicao = 0; //variavel que recalcula a posicao do css style padding-left
        var ultima_posicao = 0;//pega o valor total da string
        var verifica_check = 0; //flag de controle para verificar se tem checkbox
        $(':checkbox:checked').each(function(i){ //procura todos os checbox marcados 
            verifica_check = 1;
            val[i] = $(this).val();//pega o valor de cada chekbox marcado
            posicao = $("#recuo" + val[i]).css("padding-left"); //pega o valor do css padding retorno = 1px para a posicao 1
            //  alert(posicao); //mostra o conteudo da variavel pading
            ultima_posicao = posicao.length;//pega o tamanho total da string
            //alert(ultima_posicao); //mostra o valor total da string
            // pega do tamanho total da string -2 ( retirando o px) ate a posicao zero
            posicao = Number(posicao.substring((ultima_posicao - 2), 0));
            // alert(posicao); //exibe
            posicao = posicao - 20; //acrescenta -20 na posicao 
            //alert(posicao);//mostra a ultima POSICAO
            $("#recuo" + val[i]).css("padding-left", posicao + "px");//altera o css com o valor novo
        });
        if (verifica_check == 0) {
            $("#aviso_marcarcheck").dialog('open');
        }
        
        
    });
    
    
    //alterar uma pergunta com o checbox marcado
    // Pode ter reclamacoes pois esta alterando todas as marcadas.
    
    $("#alterar-pergunta").click(function(event){
        var val = [];
        var verifica_check = 0;
        $(':checkbox:checked').each(function(i){
            verifica_check = 1; //usado somente no final
            val[i] = $(this).val();
            $("#escolhe-check" + val[i]).remove();
            $("#linha-pergunta" + val[i]).remove();
            $("#recuo" + val[i] + " > br").remove();
            // alert(val[i])      ;
            // return;
            var pergunta = new Pergunta();
            var texto = pergunta.getPergunta();
            //alert(texto);
            // return;
            
            if (pergunta.getPergunta().length < 40) {
            
                // linha input type=text
                $("#recuo" + val[i]).append("<input type=checkbox id='escolhe-check" + val[i] + "' value=" + val[i] + ">");
                $("#recuo" + val[i]).append("<input type=text id='linha-pergunta" + val[i] + "' size='60' value='" + texto + "' >");
                if (verifica_check == 0) {
                    $("#aviso_marcarcheck").dialog('open');
                }
            }
            else {
            
                // linha input type=memo
                $("#recuo" + val[i]).append("<input type=checkbox id='escolhe-check" + val[i] + "' value=" + val[i] + ">");
                $("#recuo" + val[i]).append("<br>");
                $("#recuo" + val[i]).append("<textarea id='linha-pergunta" + val[i] + "'>" + texto + " </textarea>");
            }
            
        });
        if (verifica_check == 0) {
            $("#aviso_marcarcheck").dialog('open');
        }
        
    });
   
    //funcao para atualizacao dos campos e dragsort 

    function metodos() {
        $(document).ready(function(){
                //linhas em arvore dragsort
                $("#linhas").dragsort({
//                dragEnd: function() { grava_elementos(); }
                    });
                //-------------------------------------------formulario
                //cria uma regra de atualizacao de campo
                $("textarea[id*='linha-formulario']").focus( function() {  //pega o valor original
                    conteudo_original  = $(this).attr('value');
                    }) ; //fim atualiza

                $("textarea[id*='linha-formulario']").blur( function() { 
                    var indice    = $(this).prev().prev().attr('value'); //pega check
                    var conteudo  = $(this).attr('value');
                    var codigo = $("#cod_formulario"+indice).attr("value");
                    if (conteudo_original != conteudo) { //verifica se o campo foi modificado
                         var acao = "acao=AtualizaFormulario&codigoformulario="+codigo+"&titulo="+conteudo;
                         grava_item(acao); //atualiza campos individualmente
//                         alert("acao=AtualizaFormulario&codigoformulario="+codigo+"&conteudo="+conteudo);
                         }
                    }) ; //fim atualiza

                //cria uma regra de atualizacao de campo
                $("textarea[id*='formulario-mensagem']").focus( function() {  //pega o valor original
                    conteudo_original  = $(this).attr('value');
                    }) ; //fim atualiza

                $("textarea[id*='formulario-mensagem']").blur( function() { 
                    var indice    = $(this).prev().prev().prev().prev().attr('value'); //pega check 4 objetos anteriores
                    var conteudo  = $(this).attr('value');
                    var codigo = $("#cod_formulario"+indice).attr("value");
                    if (conteudo_original != conteudo) { //verifica se o campo foi modificado
                        var acao = "acao=AtualizaFormulario&codigoformulario="+codigo+"&mensagem="+conteudo;
                         grava_item(acao); //atualiza campos individualmente
//                         alert("acao=AtualizaFormulario&codigoformulario="+codigo+"&conteudo="+conteudo);
                         }
                    }) ; //fim atualiza
                //-------------------------------------------secao
                //cria uma regra de atualizacao de campo
                $("input[id*='linha-secao']").focus( function() {  //pega o valor original
                    conteudo_original  = $(this).attr('value');
                    }) ; //fim atualiza

                $("input[id*='linha-secao']").blur( function() { 
                    var indice    = $(this).prev().attr('value'); //pega check
                    var conteudo  = $(this).attr('value');
                    var codigo = $("#cod_secao"+indice).attr("value");
                    if (conteudo_original != conteudo) { //verifica se o campo foi modificado
                         var acao="acao=AtualizaSecao&codigo="+codigo+"&conteudo="+conteudo; 
//                         alert(acao);
                         grava_item(acao); //atualiza campos individualmente
                         }
                    }) ; //fim atualiza
                //-------------------------------------------pergunta
                //cria uma regra de atualizacao de campo
                $("input[id*='linha-pergunta']").focus( function() {  //pega o valor original
                    conteudo_original  = $(this).attr('value');
                    }) ; //fim atualiza
                $("input[id*='linha-pergunta']").blur( function() { 
                    var indice    = $(this).prev().attr('value'); //pega check
                    var conteudo  = $(this).attr('value');
                    var codigo = $("#cod_pergunta"+indice).attr("value");
                    if (conteudo_original != conteudo) { //verifica se o campo foi modificado
                         var acao="acao=AtualizaPergunta&codigo="+codigo+"&conteudo="+conteudo; 
                         grava_item(acao); //atualiza campos individualmente
                   // alert("acao=AtualizaPergunta&codigo="+codigo+"&conteudo="+conteudo);
                    }
                    }) ; //fim atualiza
                //-------------------------------------------resposta
                //cria uma regra de atualizacao de campo
                $("input[id*='linha-resposta']").focus( function() {  //pega o valor original
                    conteudo_original  = $(this).attr('value');
                    }) ; //fim atualiza
                $("input[id*='linha-resposta']").blur( function() { 
                    var indice    = $(this).prev().attr('value'); //pega check
                    var conteudo  = $(this).attr('value');
                    var codigo = $("#cod_resposta"+indice).attr("value");
                    if (conteudo_original != conteudo) { //verifica se o campo foi modificado
                         var acao="acao=AtualizaResposta&codigo="+codigo+"&texto="+conteudo;
//                         alert(acao);
                         grava_item(acao); //atualiza campos individualmente
                    // alert("acao=AtualizaResposta&codigo="+codigo+"&conteudo="+conteudo);
                    }
                    }) ; //fim atualiza

                //cria uma regra de atualizacao de campo
                $("select").change( function() {  //pega o valor original
                         var conteudo  = $("select option:selected").val();
                         var indice = $("input[id*='linha-resposta']").prev().attr("value");//pega ocheck anterior
                         var codigo = $("#cod_resposta"+indice).attr("value");
                         var acao="acao=AtualizaResposta&codigo="+codigo+"&tipo="+conteudo;
//                        alert(acao);
                         grava_item(acao); //atualiza campos individualmente
                    // alert("acao=AtualizaResposta&codigo="+codigo+"&conteudo="+conteudo);
                    }) ; //fim atualiza

                //cria uma regra de atualizacao de campo
                $("input[id*='tabela-resposta']").focus( function() {  //pega o valor original
                        conteudo_original  = $(this).attr('value');
                    }) ; //fim atualiza
                $("input[id*='tabela-resposta']").blur( function() { 
                        var conteudo =  $(this).attr('value');
                        var indice =$("input").index(this) ; //pega o indice do input em relacao ao DOM
                        indice++; //pega o proximo input
                        var codigo = $("input").eq(indice).attr("value"); //pega o proximo input
                    if (conteudo_original != conteudo) { //verifica se o campo foi modificado
                         var acao="acao=AtualizaResposta&codigo="+codigo+"&tabela="+conteudo;
//                         alert(acao);
                         grava_item(acao); //atualiza campos individualmente
                    }
                    }) ; //fim atualiza



                });//document ready
    } //fim metodos


});//fim


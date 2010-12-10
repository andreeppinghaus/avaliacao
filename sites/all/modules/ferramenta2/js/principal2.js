/**
 * @author andre
 */
// cria variaveis globais para armazenar o numero no computador

var identificador=0; //variavel que cria um novo numero identificador para o objeto
var controle; //controle da exibicao do questionario
var ultimo_identificador=new Array();

function trim(str) {
		return str.replace(/^\s+|\s+$/g,"");
	}
        
$(function(){
                
 // Tabs
$('#tabs').tabs();

//Coloca as letras em branco das caixas que possuem o tag <a href>
$("div#monta_box").children('a').css("color", "#fff");

//controla as caixas de css deixando como cinza as que forem clicadas
var cores;
$("div#monta_box").mouseover(function(){ //resolve a movimentacao da caixa
     cores=$(this).css("background");
     var objeto=$(this).attr('id');
    $(this).css("background", "gray");
     
    // $(this).children().css("background", "gray");
     /*$('b.r3').css("background", "gray");
     $('b.r2').css("background", "gray");
     $('b.r1').css("background", "gray");
     */
     
});

$("div#monta_box").mouseout(function(){ //resolve a movimentacao da caixa
     $(this).css("background", cores);
    //  $(this).children().css("background", cores);
});

                
$("#linhas").mouseover(function(){ //resolve a movimentacao da caixa
     $("#controle").dialog({ position: 'right' });
});



$("#controle").dialog({ position: 'right' });
  $("#controle").dialog("close");
  $("#excluir-formulario").hide();


//carga do autoearch
$.ajax({
         type: "POST",
         dataType: "json",//necessario este parametro para retorno do json
         url: Drupal.settings.ferramenta2.servidor, 
         data:'acao=AutoFormulario' ,
         success: function(retorno){
                if (retorno !=0 ) {
                   //Existe titulo preenche o autosearch
                    $("#tags").autocomplete({
                        source: retorno //preenche com os dados da tabela
                    });
                }else {
                    //vazio esconde busca de titulo
                    $("#busca").hide();
                    $("#controle").dialog("close");
                    $("#excluir-formulario").hide();
                    
                }
         }
}); //fim autosearch

//carrega instrumento

$('#tags').keypress(function(event) {
        if (event.keyCode == '13') {
              event.preventDefault();
               busca_instrumento();
            
          } //fim if
}); //fim keypress

$('#buscar').button().click(function(event) {
        
    busca_instrumento();
        
}); //fim 


function sortNumber(a, b)
{
return a - b;
}

function busca_instrumento() {
     var titulo=$("#tags").attr("value") ;
     if (titulo.length<=0){
                alert("Digite um título para carregar o questionário.")
     }
               $("#linhas").empty();
                var acao =  "acao=CarregaInstrumento&titulo="+titulo+""; //pega o instrumento todo
                 $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: Drupal.settings.ferramenta2.servidor,
                    data: acao,
                    success: function(retorno){
                       // alert(retorno);
                      // console.log(retorno);
                        $.each(retorno, function(index, value) {
                            $.each(value, function(registro, conteudo) {
                             //  alert(registro + ': ' + conteudo);
                                monta_formulario_carregado(registro, conteudo);
                                //Drupal.settings.ferramenta2.
                            }); //fim de value
                        }); //fim de retorno
                      
                        //alert(ultimo_identificador);
                        ultimo_identificador.sort(sortNumber);
                        //alert(ultimo_identificador);
                        identificador=ultimo_identificador[(ultimo_identificador.length)-1]; //pega o maior elemento do array
                        identificador; //atualiza o identificador para o ultimo
                        //alert(identificador);
                        //console.log(ultimo_identificador, identificador,ultimo_identificador.length);
                         $("#controle").dialog("open");
                    } //fim de sucesso
                });//fim de ajax
}
    
//Cria as funcoes de objeto para o formulario
function Formulario(codigo, titulo, texto){
    this.identificador = "f";
    this.codigo = codigo;
    this.titulo = titulo;
    this.texto = texto;
}
var exibeFormulario = new Formulario(); //monta objeto para resgatar o formulario do banco

function Secao(codigo, titulo){
    this.identificador = "s";
    this.codigo = codigo;
    this.titulo = titulo;
}
var exibeSecao = new Secao(); //monta objeto para resgatar o formulario do banco

function Pergunta(codigo, titulo){
    this.identificador = "p";
    this.codigo = codigo;
    this.titulo = titulo;
}
var exibePergunta = new Pergunta(); //monta objeto para resgatar o formulario do banco

function Resposta(codigo_objeto, codigo_resposta, tipo,  tabela){
    this.identificador = "r";
    this.codigo_objeto = codigo_objeto;
    this.codigo_resposta=codigo_resposta;
    this.tipo = tipo;
    
    this.tabela = tabela;
}
var exibeResposta = new Resposta(); //monta objeto para resgatar o formulario do banco

//controla o drag and drop das linhas sem plugin.
    $("#linhas").sortable({
      handle : '.handle',
      update : function () {
		  var order = $('#linhas').sortable('serialize');
  		//$("#info").load("process-sortable.php?"+order);
      }
      });

    //botao para exibir o questinario
    $("#salvar").button().click(function(){
             
        exibe_elementos(); //recebe os elementos arrumados para armazenar no banco
        
       //alert(JSON.stringify(objetoQuestionario)); //exibe json apartir do objeto
       
        $("#busca").show();
        $("#excluir-formulario").show();
    });
    
    $("button").click(function() {
       //  $( "#salvar" ).button({ disabled: false }); //habilita o botao salvar apos uma alteracao no botoes
    });
    
    function exibe_elementos() 
    {
        /*
         Exibe os elementos no html no formato json
        */
        var objetoQuestionario= new Array(); //objeto que armazenara o questionario
        var verifica_titulo=0;
        $("#linhas>li").each(function(index) {
            //pega o objeto filho de <li>
            var objeto=$(this).children("div").attr("id");
            
            if(objeto.substring(0,1)=="f") { //pega conteudo do formulario
                var pega_conteudo= $(this).children("div").attr("id"); //pega id da secao
                var codformulario=objeto.substring(1);//pega o codigo da secao
               var titulo=$("#"+pega_conteudo).children("textarea#titulo").attr("value");
               var texto=$("#"+pega_conteudo).children("textarea#texto").attr("value");
               //var form1=new Object;
              // form1 = { 'formulario' : [ { 'identificador':'f', 'codigo':codformulario,'titulo':titulo, 'texto':texto }  ] };
            //  console.log("formulario"+codformulario+"titulo"+titulo);
                objetoQuestionario.push( new Formulario(codformulario,titulo,texto ) );
               // objetoQuestionario.push( "identificador|f","codigo|"+codformulario,"titulo|"+titulo,"texto|"+texto  );
                verifica_titulo=1; 
                              
             //  alert(titulo+'/'+texto);
             
            }
            
            var objeto=$(this).children("div").attr("id"); //pode ser secao s.,pergunta p., resposta r.
            
            if(objeto.substring(0,1)=="s") { //pega o primeiro bit do id e verifica se e secao
                var titulo=$("#"+objeto).children("input#titulo").attr("value"); //pega o titulo da secao              
                var codsecao=objeto.substring(1);//pega o codigo da secao
               // alert(titulo+"/"+codsecao); //pega texto da secao
               // var secao1=new Object;
               // var secao1={ 'secao' : [ { 'identificador':'s', 'codigo':codsecao,'titulo':titulo }  ] };
              // console.log("secao"+codsecao+"titulo"+titulo);
               objetoQuestionario.push(new Secao(codsecao,titulo ) );
               //objetoQuestionario.push( "identificador|s","codigo|"+codsecao,"titulo|"+titulo );
              
            }

            if(objeto.substring(0,1)=="p") { //pega o primeiro bit do id e verifica se e pergunta
                var titulo=$("#"+objeto).children("input#titulo").attr("value"); //pega o titulo da secao              
                var codpergunta=objeto.substring(1);//pega o codigo da secao
              //  alert(titulo+"/"+codpergunta); //pega texto da secao
              //var pergunta1=new Object;
              //pergunta1={ 'secao' : [ { 'identificador':'p', 'codigo':codpergunta,'titulo':titulo }  ] };
             // console.log("pergunta"+codpergunta+"titulo"+titulo);
             objetoQuestionario.push(new Pergunta(codpergunta,titulo ));
             //objetoQuestionario.push( "identificador|p","codigo|"+codpergunta,"titulo|"+titulo );
            }
            
            if(objeto.substring(0,1)=="r") { //pega o primeiro bit do id e verifica se e resposta
                var codigo_objeto=objeto.substring(1);//pega o codigo da resposta
                var id_resposta=$("#"+objeto).children("input#titulo").attr("id");
                var tipo=$("#tipo"+codigo_objeto+" option:selected").text();
                var tabela=$("#tabela"+codigo_objeto).attr("value");
                var codigo_resposta = $("#tipo"+codigo_objeto+" option:selected").val();
                //var resposta1=new Object;
                //resposta1={ 'resposta' : [ { 'identificador':'r', 'codigo':codresposta,'titulo':titulo, 'tipo':tipo, 'tabela':tabela }  ] };
                                
             //  alert(titulo+"/"+tipo+"/"+tabela+"/"+codresposta); //pega texto da secao
             //console.log("resposta"+codresposta+"titulo"+titulo+"tipo"+tipo+"tabela"+tabela);
               objetoQuestionario.push(new Resposta(codigo_objeto, codigo_resposta, tipo, tabela ));
              //objetoQuestionario.push( "identificador|r","codigo|"+codresposta,"titulo|"+titulo, "tipo|"+tipo,"tabela|"+tabela );
            }
        }); //fim li.each
        var jsonQuestionario = JSON.stringify(objetoQuestionario);
      //  alert(jsonQuestionario);
        if (verifica_titulo==0) {
             alert("O título do questionário é obrigatório");
        } else {
                var acao = "acao=GravaQuestionario&json="+jsonQuestionario;
                envia_servidor(acao);
        }
        
        
    }//fim de funcao
    /*
     Caixas de dialogos Ativas
    */
    $("#dialog-pergunta").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            buttons: {
            'Adiciona': function() {
                    exibePergunta.titulo = $("#pergunta_texto").val();
                    identificador++;
                    adiciona_pergunta( identificador, exibePergunta.titulo);
                    $("#pergunta_texto").attr("value", '');
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
            height: 500,
            width: 550,
            modal: true,
            buttons: {
            'Adiciona': function() {
                   // exibeResposta.titulo = $("#resposta_texto").val();
                    var conteudo = $("#seleciona_resposta").attr("value");
                    
                 //    alert("=="+conteudo);
                     //exibeResposta.tipo=conteudo;
                     exibeResposta.codigo=conteudo;
                    //alert(conteudo);
//                    console.log(exibeResposta.tipo);
                    exibeResposta.tabela = $("#tabela").val();
                    identificador++;                    
                   adiciona_resposta(identificador, exibeResposta.titulo, exibeResposta.tipo, exibeResposta.tabela );
                // colocando a opcao selecionada no 
                    
                   
                    $(this).dialog('close');

                },
            'Cancela': function() {
                $(this).dialog('close'); 
                }
            }

            });

        $('#adiciona-resposta').button().click(function() {
        //         $('#dialog-formulario').dialog( "option", "width", 560 );
                $('#dialog-resposta').dialog('open');
        });

       //controla a mensagem do campo resposta
      $("#seleciona_resposta").change(function(){
     
      });

  //exibeResposta.codigo=conteudo;
         //alert(exibeResposta.codigo);
         
        $("#dialog-secao").dialog({
            autoOpen: false,
            height: 350,
            width: 350,
            modal: true,
            buttons: {
            'Adiciona': function() {
                   exibeSecao.titulo= $("#secao_texto").val();
                    identificador++;
                    adiciona_secao(identificador , exibeSecao.titulo);
                    $("#secao_texto").attr("value", '');
                    
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
            height: 350,
            width: 450,
            modal: true,
            buttons: {
            'Adiciona': function() {
                
                    exibeFormulario.titulo = $("#formulario_texto").val();
                    exibeFormulario.texto= $("#formulario_mensagem").val();
                    identificador++;
                    adiciona_formulario( identificador, exibeFormulario.titulo, exibeFormulario.texto);
                    exibe_elementos();//salva o formulario
                    $(this).dialog('close');

                },
            'Cancela': function() {
                $(this).dialog('close'); 
                }
            }

            });

        $('#adiciona-formulario').button().click(function() {
                $('#linhas').empty();
                $('#tags').attr('value', '');
                $("#controle").dialog({ position: 'right' }); //mostra controles do gerenciador
                $('#dialog-formulario').dialog( "option", "width", 560 );
                $('#dialog-formulario').dialog('open');
       
        });    
        
        $("#excluir-formulario").button().click(function(){ //exclui o questionario atual
            var r = confirm("Deseja EXCLUIR o questionário atual ? (esta opção não pode ser desfeita)");
            if (r == true) {
                  
                   var titulo=$("#titulo").attr("value") ;
                  // alert(jQuery.trim(titulo));
                   if (titulo !='') {
                   var acao = "acao=ExcluiQuestionario&titulo="+titulo;
                   envia_servidor(acao);
                   $('#linhas').empty();
                   $('#tags').attr('value', '');
                   $("#controle").dialog({ position: 'right' });             
                   }
                   
                          
                }
         }); //fim de exluir questionario
            //remove uma pergunta com o checbox marcado
    $("#excluir").button().click(function(event){
//        var val = [];
        var verifica_check = 0;
        $(':checkbox:checked').each(function(i){
            verifica_check = 1;
            
        });
        if (verifica_check == 0) {
            $("#aviso_marcarcheck").dialog('open');
            alert("Marque pelo menos 1 item para excluir.");
			return;
        }
        var r = confirm("Deseja EXCLUIR o(s) Item(s) Selecionados ?");
        if (r == true) {
            $(':checkbox:checked').each(function(i){
                verifica_check = 1;
                var valor = $(this).val();
                $("#li" + valor).remove(); //remove <li id=li1,2,3,4,5 <identificador unico>
            });
        }
        
    });//fim excluir
    
    function envia_servidor(acao) {
       // alert(acao);
        $.ajax({
            type: "POST",
            url: Drupal.settings.ferramenta2.servidor,
            data: acao,
            success: function(retorno){
                alert( retorno ); 
                //                                   alert( "Data Saved: " + cod_pergunta );
            }
        });
    }
    
    function monta_formulario_carregado(registro, conteudo) {
        //para cada interacao do each eu pego um campo, ao final exibo o campo.
        //alert(registro + ': ' + conteudo);
        //---------------------------------------------------------------------FORMULARIO
        if (registro=='identificador' && conteudo=='f') {
            controle ='f';
          //  console.log(controle);//firebird
        }
        if (controle=='f') { //pega os valores do formulario
            if (registro=='titulo') {
                exibeFormulario.titulo=conteudo;
            //    console.log(exibeFormulario.titulo);//firebird
            }
            if (registro=='codigo') {
                exibeFormulario.codigo=conteudo;
            }           
            if (registro=='texto') {
                exibeFormulario.texto=conteudo; //ultimo campo apos devera imprimir na tela
                
                adiciona_formulario( exibeFormulario.codigo, exibeFormulario.titulo, exibeFormulario.texto);
                $("#li"+exibeFormulario.codigo).focus();
            }//fim do ultimo campo
            
        }//fim de controle de funcao
        //------------------------------------------------------------------------- SECAO
        if (registro=='identificador' && conteudo=='s') {
            controle ='s';
            //console.log(controle);//firebird
        }
        if (controle=='s') { //pega os valores do formulario
            
            //console.log(registro);//firebird
            
            if (registro=='codigo') {
                exibeSecao.codigo=conteudo;                    
            }
            
            if (registro=='titulo') {
                exibeSecao.titulo=conteudo;
                adiciona_secao(exibeSecao.codigo,exibeSecao.titulo);
                $("#li"+exibeSecao.codigo).focus();
            }
            //fim do ultimo campo
            
        }//fim de controle de funcao
    //------------------------------------------------------------------------- PERGUNTA
        if (registro=='identificador' && conteudo=='p') {
            controle ='p';
          //  console.log(controle);//firebird
        }
        if (controle=='p') { //pega os valores do formulario
            
            if (registro=='codigo') {
                exibePergunta.codigo=conteudo;        
            }
            if (registro=='titulo') {
                exibePergunta.titulo=conteudo;
            //    console.log(exibeFormulario.titulo);//firebird
                adiciona_pergunta(exibePergunta.codigo,exibePergunta.titulo);
                $("#li"+exibePergunta.codigo).focus();
            }//fim do ultimo campo
            
        }//fim de controle
        //------------------------------------------------------------------------- RESPOSTA
        
        if (registro=='identificador' && conteudo=='r') {
            controle ='r';
          //  console.log(controle);//firebird
        }
        if (controle=='r') { //pega os valores do formulario
            if (registro=='titulo') {
                exibeResposta.titulo=conteudo;
            //    console.log(exibeFormulario.titulo);//firebird
            }
            if (registro=='codigo_objeto') {
                
                exibeResposta.codigo_objeto=conteudo;
                //console.log(exibeResposta.codigo_objeto);
            }
            if (registro=='codigo_resposta') {
                
                exibeResposta.codigo_resposta=conteudo;
                //console.log(exibeResposta.codigo_objeto);
            }
            
            
            if (registro=='tipo') {
      //        alert(exibeResposta.codigo);
                if (exibeResposta.codigo_resposta==1) {
                     exibeResposta.tipo="Lista com m&uacute;ltiplas escolhas";
                }
                if (exibeResposta.codigo_resposta==2) {
                     exibeResposta.tipo="Lista com resposta &uacute;nica";
                }
                if (exibeResposta.codigo_resposta==3) {
                     exibeResposta.tipo="Resposta aberta objetiva";
                }
                if (exibeResposta.codigo_resposta==4) {
                     exibeResposta.tipo="Escala de níveis";
                }
                if (exibeResposta.codigo_resposta==5) {
                     exibeResposta.tipo="Resposta aberta detalhada";
                }
                
               
                 
            }  
            if (registro=='tabela') {
                exibeResposta.tabela=conteudo; //ultimo campo apos devera imprimir na tela
                adiciona_resposta( exibeResposta.codigo_objeto, exibeResposta.codigo_resposta, exibeResposta.tipo, exibeResposta.tabela );
                $("#li"+exibeResposta.codigo_objeto).focus();
             //   adiciona_formulario(exibeFormulario.codigo, exibeFormulario.titulo, exibeFormulario.texto);
            }//fim do ultimo campo

            //guarda os codigo em um array para pegar o ultimo
            if (registro=='codigo_objeto') {
                ultimo_identificador.push(conteudo);
            }
        }//fim de controle de funcao
      
            
    }//fim funcao

//funcao para montar o questionario na tela
    function adiciona_formulario( codigo, titulo, texto) {
        var nivel = "<div id=f" + codigo + " style=\"padding-left :0px; font-family : tahoma; font-size : 12px;\" >";
        // linha input type=memo
        $("#linhas").append("<li id=li" + codigo + ">" + nivel +
                            "<img src='"+Drupal.settings.ferramenta2.url+"sites/default/files/arrow.png' alt='move' width='16' height='16' class='handle' />"+
                            "<input type=checkbox id='escolhe-check" + codigo + "' value=" + codigo + " /> " +
                            "<br /><textarea rows='5' cols='60' id='titulo'>" + titulo + " </textarea>" +
                            "<br><textarea rows='5' cols='60' id='texto'>" + texto+ 
                            " </textarea>" +
                            "</div></li>");
    
    } //fim adiciona  formulario
    function adiciona_secao( codigo, titulo) {
//         console.log(codigo, titulo);//firebird
        var nivel = "<div id=s" + codigo + " style=\"padding-left :20px; font-family : tahoma; font-size : 12px;\" >";
        //if (titulo.length < 40) {
            // linha input type=text
            $("#linhas").append("<li id=li" + codigo + ">" + nivel +
                                "<img src='"+Drupal.settings.ferramenta2.url+"sites/default/files/arrow.png' alt='move' width='16' height='16' class='handle' />"+
                                "<input type=checkbox id='escolhe-check" + codigo + "' value='" + codigo + "' />" +
                                "<input type=text id='titulo' size='60'  value='" + titulo + "' />" +
                                "</div></li>");
        /*} else {
                // linha input type=memo
                $("#linhas").append("<li id=li" + codigo + ">" + nivel +
                                    "<input type=checkbox id='escolhe-check" + codigo + "' value='" + codigo + "' /> " +
                                    "<br><textarea id='titulo'>" + titulo + " </textarea>" +
                                    "Secao</div></li>");
        }//fim if
    */
    } //fim de adiciona secao
    
    function adiciona_pergunta( codigo, titulo) {
        var nivel = "<div id=p" + codigo + " style=\"padding-left :60px; font-family : tahoma; font-size : 12px;\" >";
       // if (titulo.length < 40) {
            // linha input type=text
            $("#linhas").append("<li id=li" + codigo + ">" + nivel +
                                "<img src='"+Drupal.settings.ferramenta2.url+"sites/default/files/arrow.png' alt='move' width='16' height='16' class='handle' />"+
                                "<input type=checkbox id='escolhe-check" + codigo + "' value='" + codigo + "' />" +
                                "<input type=text id='titulo' size='50'  value='" + titulo+ "' />" +
                                "</div></li>");
        /*} else {
                // linha input type=memo
                $("#linhas").append("<li id=li" + codigo + ">" + nivel +
                                    "<input type=checkbox id='escolhe-check" + codigo + "' value='" + codigo + "' /> " +
                                    "<br><textarea id='titulo" + codigo + "' rows='3' cols='30'>" + titulo + " </textarea>" +
                                    "Pergunta</div></li>");
       }
    */
    } //fim de adiciona pergunta
    
    function adiciona_resposta(codigo_objeto, codigo_resposta, tipo, tabela ) { //titulo  nao usado no momento
        var nivel = "<div id=r" + codigo_objeto + " style=\"padding-left :100px; font-family : tahoma; font-size : 12px;\" >";
       //alert(codigo);
       
       //controle do select
      // alert(exibeResposta.codigo);
       $opcao="";
          if (exibeResposta.codigo_resposta==0) {
                     $opcao += "<option value='0' selected='selected'>Sem resposta</option>";
           }else {
                   $opcao += "<option value='0'>Sem resposta</option>";
           }
           if (exibeResposta.codigo_resposta==1) {
                     $opcao += "<option value='1' selected='selected'>Lista com m&uacute;ltiplas escolhas</option>";
           }else {
                   $opcao += "<option value='1'>Lista com m&uacute;ltiplas escolhas</option>";
           }
           if (exibeResposta.codigo_resposta==2) {
                     $opcao += "<option value='2' selected='selected'>Lista com resposta &uacute;nica</option>";
           }else {
                   $opcao += "<option value='2'>Lista com resposta &uacute;nica</option>";
           }
           if (exibeResposta.codigo_resposta==3) {
                     $opcao += "<option value='3' selected='selected'>Resposta aberta objetiva</option>";
           }else {
                   $opcao += "<option value='3'>Resposta aberta objetiva</option>";
           }
           if (exibeResposta.codigo_resposta==4) {
                     $opcao += "<option value='4' selected='selected'>Escala de níveis</option>";
           }else {
                   $opcao += "<option value='4'>Escala de níveis</option>";
           }
           if (exibeResposta.codigo_resposta==5) {
                     $opcao += "<option value='5' selected='selected'>Resposta aberta detalhada</option>";
           }else {
                   $opcao += "<option value='5'>Resposta aberta detalhada</option>";
           }
       
        $("#linhas").append("<li id=li" + codigo_objeto + ">" + nivel +
                            "<img src='"+Drupal.settings.ferramenta2.url+"sites/default/files/arrow.png' alt='move' width='16' height='16' class='handle' />"+
                            "<input type=checkbox id='escolhe-check" + codigo_objeto + "' value='" + codigo_resposta + "' />" +
                         //   "<input type=text id='titulo' size='40'  value='" + titulo + "'/>"+
                        //    "Resposta " +
                            "Tipo:" +
                            "<select id='tipo" + codigo_objeto + "' >"+
                            $opcao +
                            "</select>" +
                            "<p> Conteúdo:" +
                            "<textarea rows='3' cols='30' id='tabela" + codigo_objeto + "' >" + tabela + "</textarea> </p> " +
                            " </div></li>");
        
        $("#tipo"+codigo_objeto).attr("selected","selected");
        
     //  console.log(tipo);
    }//fim de adiciona resposta
    
    
});//fim jquery

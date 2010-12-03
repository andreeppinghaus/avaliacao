/*
 LGPL V.3
 Autor: Andre Eppinghaus
 Este programa controla a gravacao da avaliacao em questao
*/
$(function(){
       
   // $("#mensagem").hide();
    //variaveis globais
    var matricula = $("#matricula").attr("value");
    var unidade = $("#unidade").attr("value");
    var curso = $("#cursobase").attr("value");
    var turno = $("#turno").attr("value");
    var formulario = $("#formulario").attr("value");
    
    var resposta = 0;
    //controla a entrada de texto
    
    $("input[type=text]").focus(function() {
           $(this).select();
    });
    
     //pega a mudanca do select para verificar se foi alterado
    $("select").change(function() {  //pega o valor original
        var acao = $("#acao").attr("value"); //para atualizar ou inserir
        var questao = $(this).attr("id");
        var resposta =  $(this).val();
      
        var envia = "acao="+acao+";"+questao+";"+matricula+";"+unidade+";"+curso+";"+turno+";"+resposta+";"+formulario;
        grava_item(envia); //atualiza campos individualmente
        $("#acao").attr("value", "atualiza");
        //regras_estaticas();
       // alert(envia);
      
    }) ; //fim atualiza
    
    //grava a saida do texto
    $("input[type=text]").blur( function() {  //pega o valor original
        $(this).attr("class", "focus");
        var acao = $("#acao").attr("value"); //para atualizar ou inserir
        var questao = $(this).attr("id");
//        verifica_questao(this);
        var resposta = $(this).val();
//        alert(resposta.length);
        $("#erro").hide("slow");
        if (resposta.length > 0 ) {
            var envia = "acao="+acao+";"+questao+";"+matricula+";"+unidade+";"+curso+";"+turno+";"+resposta+";"+formulario;
           // alert(envia);
            grava_item(envia); //atualiza campos individualmente
            $("#acao").attr("value", "atualiza");
        
        } else {
            //alert("teste");
          //  $("input.focus:last").focus();  
          //  $("#erro").show("slow");
        }
      
    }) ; //fim atualiza
    
    $("input[type=checkbox]").click( function() {  //pega o valor original
        $(this).attr("class", "focus");
        var acao = $("#acao").attr("value"); //para atualizar ou inserir
        var questao = $(this).attr("id");
        var resposta='';
        $("#erro").hide("slow");
        //percorre o check pegando os dados
        $("input:checked").each(function(){
            resposta += $(this).attr("value")+"|";
            
        });
        //alert(resposta);
        
            var envia = "acao="+acao+";"+questao+";"+matricula+";"+unidade+";"+curso+";"+turno+";"+resposta+";"+formulario;
           // alert(envia);
            grava_item(envia); //atualiza campos individualmente
            $("#acao").attr("value", "atualiza");
     
      
    }) ; //fim atualiza
     
     $("input[type=radio]").click( function() {  //pega o valor original
        $(this).attr("class", "focus");
        var acao = $("#acao").attr("value"); //para atualizar ou inserir
        var questao = $(this).attr("id");
        var resposta = $(this).val();
        $("#erro").hide("slow");
        
            var envia = "acao="+acao+";"+questao+";"+matricula+";"+unidade+";"+curso+";"+turno+";"+resposta;
        //    alert(envia);
            //grava_item(envia); //atualiza campos individualmente
            $("#acao").attr("value", "atualiza");
     
      
    }) ; //fim atualiza
     
    $("textarea").blur( function() {  //pega o valor original
        $(this).attr("class", "focus");
        var acao = $("#acao").attr("value"); //para atualizar ou inserir
        var questao = $(this).attr("id");
        var resposta = $(this).val();
        $("#erro").hide("slow");
        if (resposta.length > 0 ) {
            var envia = "acao="+acao+";"+questao+";"+matricula+";"+unidade+";"+curso+";"+turno+";"+resposta+";"+formulario;
        //    alert(envia);
            grava_item(envia); //atualiza campos individualmente
            $("#acao").attr("value", "atualiza");
        
        } else {
            $("input.focus:last").focus();  
            $("#erro").show("slow");
        }
      
    }) ; //fim atualiza
    
        $("#aviso-avaliacao").dialog({
            autoOpen: false,
            height: 400,
            width: 650,
            modal: true,
            buttons: {
            'Voltar para a Avaliação': function() {
                 $(this).dialog('close');   
                },
            'Sair': function() {
                
                window.location.href='/';
                }
            }

    });
        $('#salvar').button().click(function() {
       $('#aviso-avaliacao').dialog('open');
       /*
       alert(" Sua avaliação foi armazenada com sucesso!\n"+
	"Agradecemos a sua  colaboração.\n"+
	"Comissão Própria de Avaliação - UGF\n"+
	"/Coordenação Técnica de Avaliação ");
       window.location.href='/';*/
       
    });
        //funcao para gravar os objetos (item_secao, item_questao, item_formulario) na tabela
    //Tambem utilizada para atualizar todos os campos do instrumento
function grava_item(acao) {
    var codificacao=document.charset;
    var servidor=$("#servidor").attr("value");
    $.ajax({
        type: "POST",
        url: servidor,
        data: acao+"&codificacao="+codificacao,
        success: function(retorno){
            //exibe mensagem
             
            if (retorno=="ok") {
                $("#acao").attr("value","atualiza");
             //   alert("acerto: "+retorno);
               $("#mensagem").hide();
               $("#mensagem").show('slow');
              $("#mensagem").hide('slow');
                
                
            }else {
              
              // alert ( "erro: "+retorno);
              // $("#salvo").hide();
            }
             
        }
        });
}//fim grava_item

   
});//fum de funcao  principal
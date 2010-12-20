/**
 * @author andre
 Sistema de controle de questionario
 */
// cria variaveis globais

  
$(function(){

var resposta='0';
 $("#mensagem_aviso").hide();
    //funcao para gravar os objetos (item_secao, item_questao, item_formulario) na tabela
    //Tambem utilizada para atualizar todos os campos do instrumento

function grava_item(acao) {
    var codificacao=document.charset;
    var url_padrao = $("#padrao").attr("value");
    $.ajax({
        type: "POST",
        dataType: "json",//necessario this parametro para retorno do json
        url: url_padrao+"servidor_avaliacao",
        data: acao+"&codificacao="+codificacao,
        success: function(retorno){
            //exibe mensagem
          
            if (retorno=="ok") {
                acao = 1;
               //  alert(retorno);
                $("#acao").attr("value","1");//atualiza
                aviso_salvo();
               // console.log(acao);
                             
            }else {
              // $("#salvo").hide();
            }
             
        }
        });
}//fim grava_item

$('select').change(function(event) {
   var questao = $(this).attr("id");
    var resposta =  $(this).val();
    var controle1=$("#controle1").attr("value");
    var controle2=$("#controle2").attr("value");
    var acao = $("#acao").attr("value"); //para atualizar ou inserir
         
    if (resposta.length > 0 ) {
       var envia = "acao="+acao+";"+questao+";"+resposta+";"+"select"+";"+controle1+";"+controle2; 
       grava_item(envia); //atualiza campos individualmente  
    }   
}); //fim

 $("input[type=text]").focus(function() {
                     $(this).select();
    });
    
    
  $("input[type=checkbox]").click( function() {  //pega o valor original
      /*
       Esta funcao esta gravando 0 para todas as opcoes
      */
    
      var controle = $(this).attr("id");
      var acao = $("#acao").attr("value"); //para atualizar ou inserir
      $(this+":checked").each(function(){
         var questao = $(this).attr("id");
         if (controle==questao)  { //grava somente o check que foi clicado, caso contrario grava todos os check's            
            resposta =  resposta+","+$(this).val();            
         } 
     });
     var controle1=$("#controle1").attr("value");
     var controle2=$("#controle2").attr("value");
     
     var envia = "acao="+acao+";"+controle+";"+resposta+";"+"check"+";"+controle1+";"+controle2;
     //alert("codquestao"+controle+"resposta"+resposta);
     
     grava_item(envia); //atualiza campos individualmente
     
     resposta = 0;
      
   }) ; //fim atualiza
 
 $("input[type=text]").blur( function() {  //pega o valor original
    $(this).attr("class", "focus");
    var questao = $(this).attr("id");
    var resposta =  $(this).val();
    var controle1=$("#controle1").attr("value");
    var controle2=$("#controle2").attr("value");
    var acao = $("#acao").attr("value"); //para atualizar ou inserir
         
    if (resposta.length > 0 ) {
       var envia = "acao="+acao+";"+questao+";"+resposta+";"+"select"+";"+controle1+";"+controle2; 
       grava_item(envia); //atualiza campos individualmente  
    }  
 }) ; //fim atualiza
 
 $("input[type=radio]").click( function() {  //pega o valor original
    $(this).attr("class", "focus");
    var questao = $(this).attr("id");
    var resposta =  $(this).val();
    var controle1=$("#controle1").attr("value");
    var controle2=$("#controle2").attr("value");
    var acao = $("#acao").attr("value"); //para atualizar ou inserir
         
    if (resposta.length > 0 ) {
       var envia = "acao="+acao+";"+questao+";"+resposta+";"+"select"+";"+controle1+";"+controle2; 
       grava_item(envia); //atualiza campos individualmente  
    }   
  }) ; //fim atualiza
 
 $("textarea").blur( function() {  //pega o valor original
    $(this).attr("class", "focus");
    var questao = $(this).attr("id");
    var resposta =  $(this).val();
    var controle1=$("#controle1").attr("value");
    var controle2=$("#controle2").attr("value");
    var acao = $("#acao").attr("value"); //para atualizar ou inserir
         
    if (resposta.length > 0 ) {
       var envia = "acao="+acao+";"+questao+";"+resposta+";"+"select"+";"+controle1+";"+controle2; 
       grava_item(envia); //atualiza campos individualmente  
    } 
 }) ; //fim atualiza
 
 function aviso_salvo() {
    $("#mensagem_aviso").fadeIn("slow");
    $("#mensagem_aviso").fadeOut("slow");   
 }


});//fim jquery
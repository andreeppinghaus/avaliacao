/**
 * @author andre
 */
// cria variaveis globais

var atualiza=0;

$(function(){
   $( "#tabs" ).bind( "tabsselect", function(event, ui) {
         
              if (ui.index==3) { //e a segunda tab
              

                verifica_coleta();
              }
   });
    $( "#datainicial" ).datepicker();
    $( "#datafinal" ).datepicker();

    function verifica_coleta() 	 {
  
        var titulo =  $("#titulo").attr("value") ; //pega do titulo do instrumento e nao da busca
        var html;
        var acao = "acao=VerificaColeta&titulo="+titulo;
        $.ajax({
           type: "POST",
           dataType: "json",
           url: Drupal.settings.ferramenta2.servidor,
           data: acao,
           success: function(retorno){
                if (retorno['aviso']!='vazio') { //campos preenchidos update
                    html = "<form><fieldset>";
                    html += "<legend>Criando uma nova coleta</legend>";
                    html += "<p><label for=data_inicial>Data de início:</label>";
                    html += "<input type='text' id='datainicial' value='"+retorno['datainicial']+"' /></p>";
                    html += "<p><label for=data_final>Data de término:</label>";
                    html += "<input type='text' id='datafinal' value='"+retorno['datafinal']+"' /></p>";
                    html += "<p><label for=email>Email dos respondentes:</label>";
                    html += "<textarea id='email'>"+retorno['email_respondentes']+" </textarea></p>";
                    html += "<p><label for=mensagem>Mensagem do avaliador:</label>";
                    html += "<textarea id='mensagem_avaliador'>"+retorno['mensagem_avaliador']+"</textarea></p>";
                    html += "<p><input type='submit' value='Iniciar coleta' /></p>";
                    html += "</fieldset></form>";
                    $("#coleta").append(html);
                    atualiza=1; //insere
                }else {
                    html = "<form><fieldset>";
                    html += "<legend>Criando uma nova coleta</legend>";
                    html += "<p><label for=data_inicial>Data de início:</label>";
                    html += "<input type='text' id='datainicial'  /></p>";
                    html += "<p><label for=data_final>Data de término:</label>";
                    html += "<input type='text' id='datafinal' /></p>";
                    html += "<p><label for=email>Email dos respondentes:</label>";
                    html += "<textarea id='email'> </textarea></p>";
                    html += "<p><label for=mensagem>Mensagem do avaliador:</label>";
                    html += "<textarea id='mensagem_avaliador'> </textarea></p>";
                    html += "<p><input type='submit' value='Iniciar coleta' /></p>";
                    html += "</fieldset></form>";
                    $("#coleta").append(html);
                    atualiza=0; //campos limpos insert
                }
            } //fim de sucesso
        });//fim de ajax
    }
    
    /*
        Controle de insert e update dos campos
    */
    $("#datainicial").live('blur' ,function() {  //pega o valor original
        $(this).attr("class", "focus");
        var datainicial=$("#datainicial").attr("value");
        if (datainicial.length > 0 ) {
           var envia = "acao=AtualizaColeta&dados="+atualiza+"&datainicial="+datainicial;
           //alert(envia);
           atualiza_coleta(envia); //atualiza campos individualmente
           
        }  
    }) ; //fim data inicial
  
    $("#datafinal").live('blur' ,function() {  //pega o valor original
       $(this).attr("class", "focus");
       
       var datafinal=$("#datafinal").attr("value");
     
       if (datafinal.length > 0 ) {
          var envia = "acao=AtualizaColeta&dados="+atualiza+"&datafinal="+datafinal;
          //alert(envia);
          atualiza_coleta(envia); //atualiza campos individualmente
          
       }  
    }) ; //fim data inicial
    
    
    $("#email").live('blur' ,function() {  //pega o valor original
        $(this).attr("class", "focus");
        
        var email=$("#email").attr("value");
         
        if (email.length > 0 ) {
           var envia = "acao=AtualizaColeta&dados="+atualiza+"&email="+email;
           //alert(envia);
           atualiza_coleta(envia); //atualiza campos individualmente
           
        }  
    }) ; //fim data inicial
    
     $("#mensagem_avaliador").live('blur' ,function() {  //pega o valor original
        $(this).attr("class", "focus");
        var mensagem=$("#mensagem_avaliador").attr("value");
        if (mensagem.length > 0 ) {
           var envia = "acao=AtualizaColeta&dados="+atualiza+"&mensagem="+mensagem;
           //alert(envia);
           atualiza_coleta(envia); //atualiza campos individualmente
           
        }  
    }) ; //fim data inicial
      
   /*
    Atualiza coleta a cada saida de campo, grava na tabela gerencia
    */
     function atualiza_coleta(acao) {
     alert(acao);
     return;
        $.ajax({
           type: "POST",
           dataType: "json",
           url: Drupal.settings.ferramenta2.servidor,
           data: acao,
           success: function(retorno){
        
            } //fim de sucesso
        });//fim de ajax
    }

});//fim jquery
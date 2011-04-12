/**
 * @author andre
 */
// cria variaveis globais


$(function(){
   var link=''; //link para o preteste
   $( "#tabs" ).bind( "tabsselect", function(event, ui) {
         
              if (ui.index==2) { //e a segunda tab
              pega_dados();//chma a funcao para montar o html
              }
   });
   


function pega_dados() {
/*
Esta funcao monta elementos da tela de construcao do javascript e monta
um html dentro da div preteste
*/
 var titulo =  $("#titulo").attr("value") ;
 var html='';
 $("#mensagem_preteste").empty();
 $("#pre_teste").empty();
 
 if (titulo === undefined) {
     aviso("<h3 class='error'>Carregue antes um questionário. Buscando por TÍTULO.</h3>");    
 }else {
       var verifica = verifica_preteste("acao=VerificaPreTeste&titulo="+titulo); //verifica se ja existe um preteste
       html += '<fieldset><legend>Gerando um novo Pré-Teste</legend><p>Título: '+ titulo+'</p>';
       html += '<label for="email_pre"> Digite um email para testar o novo pré-teste:';
       html += '<p><textarea id="email_pre" class="text ui-widget-content ui-corner-all"> </textarea> </p>';
     //   html += '<fieldset><label for="convite"> Digite aqui o seu convite para que o avaliado preencha este questionário online:</label>';
     //  html += '<p><textarea id="convite" class="text ui-widget-content ui-corner-all"> </textarea> </p></fieldset>';
       
       html += "<p><button id='gerar' type='button'>Enviar email's e GERA um novo pré-teste</button></p>";
       html += '</fieldset>' ;
       //html += "<button id='aplicar' type='button'>inicia Avaliação</button>";  
       $("#pre_teste").append(html);
       botao_gerar();
       
  }
}//fim funcao

function verifica_preteste(acao) {
       // alert(acao);
        $.ajax({
            type: "POST",
            dataType: "json",//necessario este parametro para retorno do json
            url: Drupal.settings.ferramenta2.servidor,
            data: acao,
            success: function(retorno){
               //  $("#pre_teste").empty();
                var html=''; //para escrever o html de  saida
                 if (retorno['situacao']==1){
                   link = retorno['link'];
                   $("#pre_teste").append(html);
                   html +="<fieldset> ";
                   html +="<legend>Este questionário já possui um  pré-teste:</legend> ";
                   html += "<p><a href="+Drupal.settings.ferramenta2.avaliacao+"/"+retorno['link']+"/"+Drupal.settings.ferramenta2.email+"><button id='testar'>Testar o questionario</button></a></p>";
                    html +="</fieldset> ";
                }else if(retorno['situacao']==2)  {
                   html +="<p>Avaliação sendo aplicada</p>";
                }//fim if
               $("#pre_teste").append(html);
                $("#testar").button();
                
           }//fim success
        });
        return;
 }//fim funcao
 
 
 function botao_gerar() {
  $('#gerar').button();
  
  $('#gerar').click( function(event) {
  
 var titulo =  $("#titulo").attr("value") ; //pega do titulo do instrumento e nao da busca
 var  email = $("#email_pre").attr("value"); //pega os emails separados por ;
 var html;

  // $("#linhas").empty();
 var acao =  "titulo='"+titulo+"'&email='"+email+"'"; //pega o instrumento todo situacao=1 ==pre-teste
 
 $.ajax({
           type: "POST",
           dataType: "json",
           url: Drupal.settings.ferramenta2.gerar,
           data: acao,
           success: function(retorno){
              // $("#pre_teste").empty();
                var html=''; //para escrever o html de  saida
                 if (retorno['situacao']==1){
                   link = retorno['link'];
                   $("#pre_teste").append(html);
                   html +="<fieldset><legend>Este questionário já possui um  pré-teste:</legend> ";
                   html += "<a href="+Drupal.settings.ferramenta2.avaliacao+"/"+retorno['link']+"/"+Drupal.settings.ferramenta2.email+"><buttonid='testar'>Testar o questionario</button></a></p>";
                   html +="</fieldset>";
                }else if(retorno['situacao']==2)  {
                   html +="<p>Avaliação sendo aplicada</p>";
                }else {
                     if (retorno['email']=="ok") {
                         aviso("Emails enviados com sucesso.");
                     }else {
                         aviso("Ocorreu um erro ao enviar o(s) email(s). O administrador ja foi avisado.");
                     }
               }
                
               $("#pre_teste").append(html);
               $("#testar").button();
          } //fim de sucesso
 });//fim de ajax

        
}); //fim
 }//fim botao_gerar
 
 function validateEmail(field) {
    var regex=/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i;
    return (regex.test(field)) ? true : false;
}

function validateMultipleEmailsCommaSeparated(value) {
    var result = value.split(",");
    for(var i = 0;i < result.length;i++)
    if(!validateEmail(result[i])) 
            return false;               
    return true;
}

 function aviso(mensagem_aviso, controle) {
   $( "#mensagem_preteste" ).dialog({
			
			modal: true,
                        buttons: {
				Ok: function() {
					$( this ).dialog( "close" );
                                        if (controle>=0){
                                            $( "#tabs" ).tabs( "select",0);
                                        }
				}
			}
		});
            $("#mensagem_preteste").empty();
            $("#mensagem_preteste").append(mensagem_aviso);
 }
 
});//fim jquery
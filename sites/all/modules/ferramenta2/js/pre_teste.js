/**
 * @author andre
 */
// cria variaveis globais para armazenar o numero no computador



$(function(){
       
   //$('#tabs').tabs('select',1);
   $( "#tabs" ).bind( "tabsselect", function(event, ui) {
            
              if (ui.index==2) { //e a segunda tab
              pega_dados();
              }
   });
   
     
   
$('#gerar').button().live ('click', function(event) {
/* aqui o paramentro live server para que o jquery possa reconhecer elementos
no DOM criados apos o carregamento da página
*/
/*Gera o pre-teste, criando uma tabela com nome do usuario+numero formulario
  */
        
 var titulo =  $("#titulo").attr("value") ; //pega do titulo do instrumento e nao da busca
 var  email = $("#email").attr("value"); //pega os emails separados por ;
 var html;
              // $("#linhas").empty();
                var acao =  "titulo='"+titulo+"'&email='"+email+"'"; //pega o instrumento todo
                 $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: Drupal.settings.ferramenta2.gerar,
                    data: acao,
                    success: function(retorno){
                        //alert(retorno);
                      $.each(retorno, function(index, value) {
                        if (index==0){
                            html += "<p>"+value+"</p>";
                         }
                        if (index==1){
                            html +="<p><a href="+Drupal.settings.ferramenta2.avaliacao+"/"+value+">Link para testar o questionario</a>";
                        }
                     });//fim each
                   
                     $("#mensagem_pre").append(html);
                      
                   } //fim de sucesso
                });//fim de ajax
        
}); //fim
    
    
});//fim jquery

function pega_dados() {
/*
Esta funcao monta elementos da tela de construcao do javascript e monta
um html dentro da div 
*/
var titulo =  $("#titulo").attr("value") ;
var html='';

$("#pre_teste").empty();

if (titulo == undefined) {
  $("#pre_teste").append("<h2 class='error'>Carregue antes um questionário.</h2>");
}else {
  html += '<form> <p>Título: '+ titulo+'</p>';
  html += '<fieldset><label for="email"> Digite email para pre-teste:</label>';
  html += '<p><textarea id="email" class="text ui-widget-content ui-corner-all"> </textarea> </p></fieldset>';
  html += "<button id='gerar' type='button'>Gerar pré-teste</button>";
  html += '</form>' ;
  $("#pre_teste").append(html);
  
}


}
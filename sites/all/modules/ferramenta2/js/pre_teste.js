/**
 * @author andre
 */
// cria variaveis globais


$(function(){

var link=''; //link para o preteste
       
   //$('#tabs').tabs('select',1);
   $( "#tabs" ).bind( "tabsselect", function(event, ui) {
         
              if (ui.index==2) { //e a segunda tab
              pega_dados();
              }
   });
   
$('#gerar').button().live('click', function(event) {
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
              exibe_mensagem(retorno);                      
          } //fim de sucesso
 });//fim de ajax

 acao = "acao=EnviaEmail&titulo="+titulo+"&email="+email+"&link="+Drupal.settings.ferramenta2.avaliacao+"/"+link; //pega o instrumento todo
 $.ajax({
           type: "POST",
           dataType: "json",
           url: Drupal.settings.ferramenta2.servidor,
           data: acao,
           success: function(retorno){
              //exibe_mensagem(retorno);                      
          } //fim de sucesso
 });//fim de ajax
        
}); //fim

function pega_dados() {
/*
Esta funcao monta elementos da tela de construcao do javascript e monta
um html dentro da div preteste
*/
 var titulo =  $("#titulo").attr("value") ;
 var html='';
 $("#mensagem_preteste").empty();
 $("#pre_teste").empty();
 
var verifica = verifica_preteste("acao=VerificaPreTeste&titulo="+titulo); //verifica se ja existe um preteste
 if (titulo === undefined) {
     $("#pre_teste").append("<h2 class='error'>Carregue antes um questionário.</h2>");
 }else {
       html += '<form> <p>Título: '+ titulo+'</p>';
       html += '<fieldset><label for="email"> Digite um email para o pré-teste:</label>';
       html += '<p><textarea id="email" class="text ui-widget-content ui-corner-all"> </textarea> </p></fieldset>';
     //   html += '<fieldset><label for="convite"> Digite aqui o seu convite para que o avaliado preencha este questionário online:</label>';
     //  html += '<p><textarea id="convite" class="text ui-widget-content ui-corner-all"> </textarea> </p></fieldset>';
       
       html += '</form>' ;
       html += "<button id='gerar' type='button'>Gerar novo pré-teste</button>";
       //html += "<button id='aplicar' type='button'>inicia Avaliação</button>";  
       $("#pre_teste").append(html);     
  }
}//fim funcao

function exibe_mensagem(retorno) {
  $("#mensagem_preteste").empty();
  var html=''; //para escrever o html de  saida
  if (retorno['situacao']==1){
      link = retorno['link'];
      $("#mensagem_preteste").append(html);
      html +="<p>Este questionário já possui um  pré-teste:</p> ";
      html += "<p><a href="+Drupal.settings.ferramenta2.avaliacao+"/"+retorno['link']+"/"+Drupal.settings.ferramenta2.email+">Testar o questionario</a></p>";
  }else if(retorno['situacao']==2)  {
      html +="<p>Avaliação sendo aplicada</p>";
   }//fim if
   $("#mensagem_preteste").append(html);  
}

function verifica_preteste(acao) {
       // alert(acao);
        $.ajax({
            type: "POST",
            dataType: "json",//necessario este parametro para retorno do json
            url: Drupal.settings.ferramenta2.servidor,
            data: acao,
            success: function(retorno){
                exibe_mensagem(retorno);              
            }//fim success
        });
 }//fim funcao
    
});//fim jquery
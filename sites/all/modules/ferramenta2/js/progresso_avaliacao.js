/**
 * @author andre
 */
// cria variaveis globais


$(function(){
   var link=''; //link para o preteste
   
   $( "#tabs" ).bind( "tabsselect", function(event, ui) {
         
              if (ui.index==4) { //e a segunda tab
              pega_dados();//chma a funcao para montar o html
              }
   });
   


function pega_dados() {
/*
Esta funcao monta elementos da tela de construcao do javascript e monta
um html dentro da div progresso
*/

 var html='';
 $("#mensagem_progresso").empty();
 $("#progresso").empty();
 var html = pega_progresso("acao=ConsultaAvaliacoes"); //verifica se ja existe um preteste
 
      // botao_gerar();
       
}//fim funcao

function pega_progresso(acao) {
       // alert(acao);
        $.ajax({
            type: "POST",
            dataType: "json",//necessario este parametro para retorno do json
            url: Drupal.settings.ferramenta2.servidor,
            data: acao,
            success: function(retorno){
            if (retorno!=0) {
              var html=''; //para escrever o html de  saida
                html='<table border="1" summary="Tabela de exibicao das avaliacoes em progresso" >';
                html+='<caption><b>Avaliações em Progresso</b></caption>';
                html+='<thead><tr>';
                html+='<th>Titulo</th> <th> Periodo </ht> <th>Tot. Emails</th> <th>Efetivados</th> ';
                html+='<th>Download</th>';
                html+='</tr></thead><tbody>';
                $.each(retorno, function(index, conteudo) {
                html += '<tr><td>'+conteudo['titulo']+'</td><td> <p><b>Início:</b> '+conteudo['datainicio'];
                html +='</p><p><b>Fim:</b> '+conteudo['datafim']+'</b></p></td><td><center>'+conteudo['total_convidados'];
                html +='</center></td><td><center>'+conteudo['total_respondentes']+'</center></td>';
                html +='<td>';
                html +='<p><button id="DownloadInstrumento" value="'+conteudo['link']+'" > Instrumento</button></p>';
                html +='<p><button id="DownloadDados" value="'+conteudo['link']+'" > Respostas</button></p>';
                html +='</td></tr> ';
                });              
                 html+='</tbody></table>';               
               $("#progresso").append(html);
            }else {
            $("#progresso").append("Não existem avaliações em produção");
            }
           }//fim success
        });
        return ;
 }//fim funcao
 
 
 function botao_gerar() {
  $('#gerar').button();
  
  $('#gerar').click( function(event) {
  
 var titulo =  $("#titulo").attr("value") ; //pega do titulo do instrumento e nao da busca
 var  email = $("#email_pre").attr("value"); //pega os emails separados por ;
 var html;

  // $("#linhas").empty();
 var acao =  "titulo='"+titulo+"'&email='"+email+"'"; //pega o instrumento todo situacao=1 ==pre-teste
 
 

        
}); //fim
 }//fim botao_gerar
 
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
 
 $("#FecharAvaliacao").live('click',function(){
 // Ainda em contrucao, vou colocar 4 para avaliacao finalizada antes do tempo
 // Vou colocar 3 para avaliacao finalizada no tempo
 });
 
 $("#DownloadInstrumento").live('click',function(){
    var acao=$(this).attr("value");
    window.location = Drupal.settings.ferramenta2.url+'avaliacao/download/1/'+acao;
 });
 
  $("#DownloadDados").live('click',function(){
    var acao=$(this).attr("value");
    window.location = Drupal.settings.ferramenta2.url+'avaliacao/download/2/'+acao;    
 });
 
});//fim jquery
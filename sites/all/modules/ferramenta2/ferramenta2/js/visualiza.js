/**
 * @author andre
 */
// cria variaveis globais para armazenar o numero no computador



$(function(){
   //$('#tabs').tabs('select',1);
   $( "#tabs" ).bind( "tabsselect", function(event, ui) {
                          
              if (ui.index==1) { //e a segunda tab
              monta_elementos();
              }
   });
   
     
   $("#visualizar").button().click(function(){ //este botao  esta no momento da criacao do questionario
      $( "#tabs" ).tabs( "select",1 );
     return false;      
   });
   
   $("#voltar").button().click(function(){ //alterna entre o questionario e o visualizar
      $( "#tabs" ).tabs( "select",0 );
     return false;
      
   });
    
});//fim jquery

function monta_elementos() {
/*
Esta funcao monta elementos da tela de construcao do javascript e monta
um html dentro da div 
*/
$("#monta_html").empty();

var verifica_titulo=0;
var palavras, i, html;
    
    $("#linhas>li").each(function(index) {
            //pega o objeto filho de <li>
            var objeto=$(this).children("div").attr("id");
            
            if(objeto.substring(0,1)=="f") { //pega conteudo do formulario
                var pega_conteudo= $(this).children("div").attr("id"); //pega id da secao
                var codformulario=objeto.substring(1);//pega o codigo da secao
               var titulo=$("#"+pega_conteudo).children("textarea#titulo").attr("value");
               var texto=$("#"+pega_conteudo).children("textarea#texto").attr("value");
               $("#monta_html").append("<div id='titulo'><h1 class='titulo'>"+titulo+"</h1>");
               $("#monta_html").append("<hr /><h3 class='mensagem_titulo'>"+texto+"</h3></div>");
               verifica_titulo=1;              
            }
            
            var objeto=$(this).children("div").attr("id"); //pode ser secao s.,pergunta p., resposta r.
            
            if(objeto.substring(0,1)=="s") { //pega o primeiro bit do id e verifica se e secao
                var titulo=$("#"+objeto).children("input#titulo").attr("value"); //pega o titulo da secao              
                var codsecao=objeto.substring(1);//pega o codigo da secao
              $("#monta_html").append("<div id=secao style='secao' >");
              $("#monta_html").append("<hr /><p class='nobile3'>"+titulo+"<hr /></div>");
            }

            if(objeto.substring(0,1)=="p") { //pega o primeiro bit do id e verifica se e pergunta
                var titulo=$("#"+objeto).children("input#titulo").attr("value"); //pega o titulo da secao              
                var codpergunta=objeto.substring(1);//pega o codigo da secao
                 $("#monta_html").append("<div id='pergunta' >");
                 $("#monta_html").append("<h3 id='pergunta' class='lilly1'>"+titulo+"</h3></div>");
            }
            
            if(objeto.substring(0,1)=="r") { //pega o primeiro bit do id e verifica se e resposta
                var titulo=$("#"+objeto).children("input#titulo").attr("value"); //pega o titulo da resposta              
                var cod_objeto=objeto.substring(1);//pega o codigo da resposta
                var id_resposta=$("#"+objeto).children("input#titulo").attr("id");
                var tipo=$("#tipo"+cod_objeto+" option:selected").text();
                var tabela=$("#tabela"+cod_objeto).attr("value");
                var codresposta = $("#tipo"+cod_objeto+" option:selected").val();
               
              //  $("#monta_html").append("teste");
             // alert(codresposta);
                if (codresposta==0){
                    $("#monta_html").append("sem resposta");
                }
                if (codresposta==1){
                    var palavras= tabela.split(";");
                    for (i=0; i< palavras.length; i++)  {
                     $("#monta_html").append("<p class='nobile2'><input type='checkbox' value='"+palavras[i]+"' />"+palavras[i]+"</p>");   
                     }
                     
                     
                    
                }
                if (codresposta==2){;
              
                   var palavras= tabela.split(";");
                  
                   
                   for (i=0; i< palavras.length; i++)  {
                        $("#monta_html").append("<p class='nobile2'><input type='radio' name='opcao' value='"+palavras[i]+"' />"+palavras[i]+"</p>");
                     }
                }
                if (codresposta==3){
                    
                 $("#monta_html").append("<p><input type='text' /> </p>");
                    
                }
                if (codresposta==4){
                  var palavras= tabela.split(";");
                  html ="<select>";
                   
                   for (i=0; i< palavras.length; i++)  {
                        
                            html +="<option>"+palavras[i]+"</option>";
                        
                     }
                     html +="</select>";
                   $("#monta_html").append(html);
                    
                }
                if (codresposta==5){
                    $("#monta_html").append("<p> <textarea> </textarea></p>");
                }
                
            }
        }); //fim li.each
    
 if (verifica_titulo==0){ //titulo ainda continuar vazio retorna para a tela principal
                  $( "#mensagem_vizualiza" ).dialog({
			
			modal: true,
                        buttons: {
				Ok: function() {
					$( this ).dialog( "close" );
                                        $( "#tabs" ).tabs( "select",0);
				}
			}
		});
            $("#mensagem_vizualiza").empty();
            $("#mensagem_vizualiza").append("<h3 class='error'>Carregue antes um questionário. Buscando por TÍTULO.</h3>");
            return;
    }
    
}
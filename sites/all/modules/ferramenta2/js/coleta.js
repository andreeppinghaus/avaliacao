/**
 * @author andre
 */
// cria variaveis globais

var atualiza=0, retorno=0;

$(function(){
$( "#mensagem_coleta:ui-dialog" ).dialog( "destroy" );

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

   $( "#tabs" ).bind( "tabsselect", function(event, ui) {
         
              if (ui.index==3) { //e a segunda tab
              

                verifica_coleta();
              }
   });
  

    function verifica_coleta() 	 {
         $("#mensagem_coleta").empty();
        var titulo =  $("#titulo").attr("value") ; //pega do titulo do instrumento e nao da busca
        var html;
        if (titulo === undefined) {
                $( "#mensagem_coleta" ).dialog({
			
			modal: true,
                        buttons: {
				Ok: function() {
					$( this ).dialog( "close" );
                                       // window.location = "/ferramenta2/criacao/";
                                         $( "#tabs" ).tabs( "select",0);
				}
			}
		});
            $("#mensagem_coleta").empty();
            $("#mensagem_coleta").append("<h3 class='error'>Carregue antes um questionário. Buscando por TÍTULO.</h3>");
           
        
           
        }else {
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
                        html += "<input type='text' id='datainicio' value='"+retorno['datainicio']+"' /></p>";
                       html += "<p><label for=data_final>Data de término:</label>";
                       html += "<input type='text' id='datafim' value='"+retorno['datafim']+"' /></p>";
                       html += "<p><label for=email>Email dos respondentes:</label>";
                       html += "<textarea id='email' rows='7'>"+retorno['email_respondentes']+" </textarea></p>";
                       html += "<p><label for=mensagem>Mensagem do avaliador:</label>";
                       html += "<textarea id='mensagem_avaliador' rows='7'>"+retorno['mensagem_avaliador']+"</textarea></p>";
                       html += "<input type='hidden' value='"+retorno['codigo']+"' id='codigo_formulario' /></p>";
                       html += "<input type='hidden' value='1' id='atualiza' /></p>";
                       html += "<p style='right: static'><button id='reenviar'>Reenviar emails </button></p>";
                       html += "</fieldset></form>";
                       $("#coleta").append(html);
                       atualiza=1; //atualiza
                       }else {
                       html = "<form><fieldset>";
                       html += "<legend>Alterando a coleta de dados</legend>";
                       html += "<p><label for=data_inicial>Data de início:</label>";
                       html += "<input type='text' id='datainicio'  /></p>";
                       html += "<p><label for=data_final>Data de término:</label>";
                       html += "<input type='text' id='datafim' /></p>";
                       html += "<p><label for=email>Email dos respondentes:</label>";
                       html += "<textarea id='email' rows='7'>separados por vírgula </textarea></p>";
                       html += "<p><label for=mensagem>Mensagem do avaliador:</label>";
                       html += "<textarea id='mensagem_avaliador' rows='7'></textarea></p>";
                       html += "<span> Mensagem que será enviada no email</span>";
                       html += "<input type='hidden' value='"+retorno['codigo']+"' id='codigo_formulario' /></p>";
                       html += "<input type='hidden' value='0' id='atualiza' /></p>";
                       html += "<p><button id='enviar'>Enviar emails </button></p>";
                       html += "</fieldset></form>";
                       $("#coleta").append(html);
                       atualiza=0; //campos limpos insert
                   }
                                     
                   $('#datainicio').datepicker({
                        dateFormat:  'dd/mm/yy',
                        onSelect: function(dateText,inst) {
   
                         //$("#datainicio").live('blur' ,function() {  //pega o valor original
                            $(this).attr("class", "focus");
                            var datainicio=$(this).attr("value");
                            var codigo=$("#codigo_formulario").attr("value");
                            atualiza=$("#atualiza").attr("value");
                            alert(datainicio);
                            if (datainicio.length > 0 ) {
                                var envia = "acao=AtualizaColeta&dados="+atualiza+"&datainicio="+datainicio+"&codigo="+codigo;
                                atualiza_coleta(envia); //atualiza campos individualmente   
                            }  
                        }//fim select
                   }) ; //fim data inicial
                    
                    $("#datafim").datepicker({
                        dateFormat:  'dd/mm/yy',
                        onSelect: function(dateText,inst) {
                            $(this).attr("class", "focus");
                            var datafim=$("#datafim").attr("value");
                            var codigo=$("#codigo_formulario").attr("value");
                            atualiza=$("#atualiza").attr("value");
                            if (datafim.length > 0 ) {
                                var envia = "acao=AtualizaColeta&dados="+atualiza+"&datafim="+datafim+"&codigo="+codigo;
                                //alert(envia);
                                atualiza_coleta(envia); //atualiza campos individualmente
                            }
                        }//fim select
                    }) ; //fim data final
                   
                   //cria botoes de envio e reenvio 
                    $("#enviar").button();
                    $("#reenviar").button();
                   
                    $("#enviar").click(function(){
                        var email = $("#email").attr("value");
                        if (email.length <= 0) {
                            aviso("<h3 class='error'>Escreva pelo menos um email para envio.</h3>");
                            return;
                        }else {
                            
                        }//fim if
                    });
                    
               } //fim de sucesso
            });//fim de ajax
        }//fim de else sem titulo
    }
    
    /*
        Controle de insert e update dos campos
    */
   

    
    
    $("#email").live('blur' ,function() {  //pega o valor original
        $(this).attr("class", "focus");
        
        var email=$("#email").attr("value");
        var codigo=$("#codigo_formulario").attr("value");
        atualiza=$("#atualiza").attr("value");
         
        if (email.length > 0 && validateMultipleEmailsCommaSeparated(email) ) {
            $("#mensagem_coleta").empty();
           var envia = "acao=AtualizaColeta&dados="+atualiza+"&email="+email+"&codigo="+codigo;
           //alert(envia);
           atualiza_coleta(envia); //atualiza campos individualmente
        } else {
        
	
		$( "#mensagem_coleta" ).dialog({
			height: 200,
			modal: true,
                        buttons: {
				Ok: function() {
					$( this ).dialog( "close" );
				}
			}
		});
            $("#mensagem_coleta").empty();
            $("#mensagem_coleta").append("Email inválido, por favor verifique sua lista." );
            $("#email").focus();
        
        }
    }) ; //fim data inicial
    
     $("#mensagem_avaliador").live('blur' ,function() {  //pega o valor original
        $(this).attr("class", "focus");
        var mensagem=$("#mensagem_avaliador").attr("value");
        var codigo=$("#codigo_formulario").attr("value");
        atualiza=$("#atualiza").attr("value");
        if (mensagem.length > 0 ) {
           var envia = "acao=AtualizaColeta&dados="+atualiza+"&mensagem="+mensagem+"&codigo="+codigo;
           //alert(envia);
           atualiza_coleta(envia); //atualiza campos individualmente
           
        }  
    }) ; //fim data inicial
      
   /*
    Atualiza coleta a cada saida de campo, grava na tabela gerencia
    */
     function atualiza_coleta(acao) {    
        $.ajax({
           type: "POST",
           dataType: "json",
           url: Drupal.settings.ferramenta2.servidor,
           data: acao,
           success: function(resposta){
                $("#atualiza").attr("value",resposta['atualiza'] );
            
            } //fim de sucesso
        });//fim de ajax
    }

    function aviso(mensagem_aviso) {
        $( "#mensagem_coleta" ).dialog({
                 		
            modal: true,
            buttons: {
                Ok: function() {
                    $( this ).dialog( "close" );
                    $( "#tabs" ).tabs( "select",0);
                }
            }
        });
        $("#mensagem_coleta").empty();
        $("#mensagem_coleta").append(mensagem_aviso);
    }
});//fim jquery
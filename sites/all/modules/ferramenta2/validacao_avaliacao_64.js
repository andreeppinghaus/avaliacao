/*
 LGPL V.3
 Autor: Andre Eppinghaus
 Este programa controla a gravacao da avaliacao em questao
*/

$(function(){

//zera as questoes    
/*     $("h3[id][id='127']").addClass("gray");
     $("#128").attr("disabled", "disabled");
      $("#125").attr("disabled", "disabled");
     $("h3[id][id='126']").addClass("gray");
*/
    controla_questao();

function controla_questao() {
    
        questao= $("#169 option:selected").text();
       //alert(questao);
       if (questao.search("Sim") >=0){ //pesquisa a palavra se existir maior que zero
        
         $("h3[id][id='171']").removeClass("gray");
         $("#171").removeAttr("disabled");
         $("#171").focus();
        
         
          //alert("aqui1")     ;
       } else if (questao.search("Nao") >=0){
        
         $("h3[id][id='171']").addClass("gray");
         $("#171").attr("disabled", "disabled");
         
        // alert("aqui2")     ;
       }else {
       // alert("aqui3")     ;
         $("h3[id][id='171']").addClass("gray");
         $("#171").attr("disabled", "disabled");
       }//fim if
}

     
    $("#169").change(function() {
        controla_questao();
    });//fim change
    
    
    
         function IsNumeric(input) {
        return (input - 0) == input && input.length > 0;
    }
    
    Array.prototype.exists = function(o) {
for(var i = 0; i < this.length; i++)
   if(this[i] === o)
     return true;
return false;
}
verifica_questao(136) ;
verifica_questao(138) ;
verifica_questao(140) ;
verifica_questao(142) ;
verifica_questao(144) ;

var array_questao = new Array();

 function verifica_questao(numero) {
    
    $("input[type=text][id="+numero+"]").blur(function() {
          
       var texto=$(this).attr("value");
        //var questoes = new Array()
       //alert(texto);
      
        if (! IsNumeric(texto)) {
            alert("Somente numeros de 1 a 5.");
            $(this).focus();
        }else if (texto<1) {
                    alert("Somente numeros maiores que 1.");
                    $(this).focus();    
        }  else if (texto >5) {
                    alert("Somente numeros menores que 5.");
                    $(this).focus();    
        }else {
            /*
            if (array_questao.exists(texto) ) {
                alert("Número já digitado="+texto);
                 $(this).focus(); 
            }else {
                array_questao.push(texto);    
            }*/
            
           
        }
        
   
   });
 }//fim funcao verifica

});

/*
 LGPL V.3
 Autor: Andre Eppinghaus
 Este programa controla a gravacao da avaliacao em questao
*/

$(function(){

    controla_questao();

function controla_questao() {
    
    //questao parte II - 3
           var questao= $("#124 option:selected").text();
//    alert(questao.search("Rio de Janeiro")+"--"+questao);
       if (questao.search("Rio de Janeiro") >=0){ //pesquisa a palavra se existir maior que zero
         $("h3[id][id='127']").addClass("gray");
         $("h3[id][id='126']").removeClass("gray");
         $("#125").removeAttr("disabled");
         $("#125").focus();
         $("#128").attr("disabled", "disabled");
         
          //alert("aqui1")     ;
       } else if (questao.search("Outro Município") >=00 ){
        
         $("h3[id][id='126']").addClass("gray");
         $("h3[id][id='127']").removeClass("gray");
         $("#128").removeAttr("disabled");
         $("#128").focus();
         $("#125").attr("disabled", "disabled");
         
        // alert("aqui2")     ;
       }else {
       // alert("aqui3")     ;
             $("h3[id][id='127']").addClass("gray");
             $("#128").attr("disabled", "disabled");
             $("h3[id][id='126']").addClass("gray");
             $("#125").attr("disabled", "disabled");        
       }//fim if
      
      // parte II - 4 
       questao= $("#130 option:selected").text();
       //alert(questao+questao.search("Sim"));
       if (questao.search("Sim") >=0){ //pesquisa a palavra se existir maior que zero
        
         $("h3[id][id='131']").removeClass("gray");
         $("#132").removeAttr("disabled");
         $("#132").focus();
        
         
          //alert("aqui1")     ;
       } else if (questao.search("Nao") >=0){
        
         $("h3[id][id='131']").addClass("gray");
         $("#132").attr("disabled", "disabled");
         
        // alert("aqui2")     ;
       }else {
       // alert("aqui3")     ;
         $("h3[id][id='131']").addClass("gray");
         $("#132").attr("disabled", "disabled");
       }//fim if
             // parte II - 12 
       questao= $("#152 option:selected").text();
       //alert(questao);
       if (questao.search("Sim") >=0){ //pesquisa a palavra se existir maior que zero
        
         $("h3[id][id='153']").removeClass("gray");
         $("#154").removeAttr("disabled");
         $("#154").focus();
        
         
          //alert("aqui1")     ;
       } else if (questao.search("Nao") >=0){
        
         $("h3[id][id='153']").addClass("gray");
         $("#154").attr("disabled", "disabled");
         
        // alert("aqui2")     ;
       }else {
       // alert("aqui3")     ;
         $("h3[id][id='153']").addClass("gray");
         $("#154").attr("disabled", "disabled");
       }//fim if
}

     
    $("#124").change(function() {
        controla_questao();
    });//fim change
    $("#130").change(function() {
        controla_questao();
    });//fim change
    $("#152").change(function() {
        controla_questao();
    });//fim change
    
    
     
   
        function IsNumeric(input) {
        return (input - 0) == input && input.length > 0;
    }

verifica_questao(114) ;
verifica_questao(155) ;
verifica_questao(156) ;
verifica_questao(157) ;
verifica_questao(158) ;


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
        }              
   
   });//fim funcao verifica
}
   
   
       
    
});

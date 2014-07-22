$("#choices").hide()
$("#navegacao_topo a.drop").click(function(){
    if ($("#choices").is(":visible")) {
        $("#choices").hide()
    }else{
        var choices = $(this).attr("title").split(",")
        choices_parsed = ""
        for (var i = 0; i < choices.length; i++) {
            choices_parsed += "<div id='choice_"+choices[i]+"' class='"+((choices[i].indexOf("#") == -1)?"choices":"submenu")+"'>"+choices[i].replace(/_/g," ").replace(/#/g,"")+"</div>"
        }
        $("#choices").html(choices_parsed).css("left",$(this).position().left + "px").width($(this).outerWidth()).show().css("cursor", "pointer")
    }
})

function menu_de_navegacao(){
    $(".choices").die("click")
    $(".choices").live("click",function(){
        $("#choices").hide()
        escolha = $(this).attr("id")
        if (/(Biomas2012)/.test(escolha)) {
        window.location.href = "../../html/biomas2012"
        } else if (/(Coligações)/.test(escolha)) {
            window.location.href="../../html/coligacoes"
        } else if (/(Cotas)/.test(escolha)) {
            window.location.href="../../html/cotas"
        } else if (/(Eleições_2012)/.test(escolha)) {
            window.location.href="../../html/eleicoes2012"
        } else if (/(Fuvest_2013)/.test(escolha)) {
            window.location.href="../../html/fuvest2013"
        } else if (/(IDEB)/.test(escolha)) {
            window.location.href="../../html/ideb"
        } else if (/(Intenção_de_Voto)/.test(escolha)) {
            window.location.href="../../html/intencaodevoto"
        } else if (/(Lista_ENEM_2011)/.test(escolha)) {
            window.location.href="../../html/listaenem2011"
        } else if (/(Que_SP_vc_quer?)/.test(escolha)) {
            window.location.href="../../html/quespvcquer"
        } else if (/(Religiões)/.test(escolha)) {
            window.location.href="../../html/religiao"
        } else if (/(São_Paulo_que_balança)/.test(escolha)) {
            window.location.href="../../html/saopauloquebalanca"

        } else if (/(Câmara|Senado)/.test(escolha)) {
            nova_casa = /Câmara/.test(escolha)?"câmara":"senado"
            if (nova_casa != casa) {
                $("#loading").show()
                casa = nova_casa
                rebuild();
                $("#listar_casa").text(escolha.substr(7).replace(/_/g," "))
                escolha = escolha.replace("â","a")
                $(".click").toggleClass("click")
                main(governo, legislatura, escolha.substr(10))
                $("#loading").hide()
            }
        } else if (/(Lula_1|Lula_2|Dilma)/.test(escolha)) {
            novo_governo = /Dilma/.test(escolha)?"dilma":"lula"
            if (novo_governo == "dilma") {
                nova_legislatura = 1
            } else {
                nova_legislatura = /Lula_1/.test(escolha)?"1":"2"
            }
            if (novo_governo != governo || nova_legislatura != legislatura) {
                $("#loading").show()
                governo = novo_governo
                legislatura = nova_legislatura
                rebuild()
                $("#listar_governo").text(escolha.substr(7).replace(/_/g," "))
                $(".click").toggleClass("click")
                main(governo, legislatura, casa.replace("â","a"))
                $("#loading").hide()
            }
        } else {
            $("#loading").show()
            visualizacao = escolha.substr(7)
            $("#listar_tipos").text(visualizacao.replace(/_/g," "))
            mudar_visualizacao();
            $("#loading").hide()
        };
    }).css("cursor", "pointer")
}

function disable_search(el){
    $(el).css("display","none");
}

function enable_search(){
    $("#search").css("display","inline-block");
    $("#search").focus();
}



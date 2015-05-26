//pega os parametros que vieram na URL para saber onde começar o gráfico
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = decodeURIComponent(value);
    });
    return vars;
}

function carregaLula2(){
    $.ajax({
        url: jsonURLBase + "lula2_camara.json",
        async: true,
        type: 'GET',
        dataType: 'json',
        success: function(data, saida){
            DadosGerais['lula']['câmara'][2] = data //global data {politicos,votacoes,votos}
            //window.ReadyJson['lula']['câmara'][2] = true //download finalizado
	          status_lula_2_camara = true
        },
        error: function() {
	        status_lula_2_camara = true
        }
    })
}

function carregaLula1(){
    $.ajax({
        url: jsonURLBase + "lula1_camara.json",
        async: true,
        type: 'GET',
        dataType: 'json',
        success: function(data, saida){
            DadosGerais['lula']['câmara'][1] = data //global data {politicos,votacoes,votos}
	          status_lula_1_camara = true
            carregaLula2()
        },
        error: function() {
	          status_lula_1_camara = true
            carregaLula2()
        }
    })
}

function carregaDilma1Camara(){
    $.ajax({
        url: jsonURLBase + "dilma1_camara.json",
        async: true,
        type: 'GET',
        dataType: 'json',
        success: function(data,saida){
	        DadosGerais['dilma']['câmara'][1] = data //global data {politicos,votacoes,votos}
            //window.ReadyJson['dilma']['câmara'][1] = true //download finalizado
	        status_dilma_1_camara = true
        },
        error: function() {
            //window.ReadyJson['dilma']['câmara'][1] = true //download finalizado
	        status_dilma_1_camara = true
        }
    })
}

function carregaDilma1Senado(){
    $.ajax({
        url: jsonURLBase + "dilma1_senado.json",
        async: true,
        type: 'GET',
        dataType: 'json',
        success: function(data,saida){
            DadosGerais['dilma']['senado'][1] = data //global data {politicos,votacoes,votos}
            //window.ReadyJson['dilma']['senado'][1] = true //download finalizado
	        status_dilma_1_senado = true
          carregaLula1()
        },
        error: function() {
          carregaLula1()
            //window.ReadyJson['dilma']['senado'][1] = true //download finalizado
	        status_dilma_1_senado = true
        }
    })
}
function carregaDilma2Camara(){
    $.ajax({
        url: jsonURLBase + "dilma2_camara.json",
        async: true,
        type: 'GET',
        dataType: 'json',
        success: function(data,saida){
            DadosGerais['dilma']['câmara'][2] = data //global data {politicos,votacoes,votos}
            //window.ReadyJson['dilma']['câmara'][1] = true //download finalizado
            status_dilma_2_camara = true
        },
        error: function() {
            //window.ReadyJson['dilma']['câmara'][1] = true //download finalizado
            status_dilma_2_camara = true
        }
    })
}

function carregaDilma2Senado(){
    $.ajax({
        url: jsonURLBase + "dilma2_senado.json",
        async: true,
        type: 'GET',
        dataType: 'json',
        success: function(data,saida){
            DadosGerais['dilma']['senado'][2] = data //global data {politicos,votacoes,votos}
            //window.ReadyJson['dilma']['senado'][1] = true //download finalizado
            status_dilma_2_senado = true
            carregaDilma1Camara()
            carregaDilma1Senado()
        },
        error: function() {
            carregaDilma1Camara()
            carregaDilma1Senado()
            //window.ReadyJson['dilma']['senado'][1] = true //download finalizado
            status_dilma_12senado = true
        }
    })
}

//Carrega Dilma 2 - Câmara - Primeira visualização do projeto
$.ajax({
    url: jsonURLBase + "dilma2_camara.json",
    async: false,
    type: 'GET',
    dataType: 'json',
    success: function(data,saida){
        $("#loading").hide()
        window.DadosGerais['dilma']['câmara'][2] = data //global data {politicos,votacoes,votos}
        d = window.DadosGerais['dilma']['câmara'][2]
        if (!d) { alert ('Dados não disponíves ou inacessíveis para este governo.')}
        $("#loading_first").hide()
        //window.ReadyJson['lula']['câmara'][1] = true //download finalizado
	      status_dilma_2_camara = true
    },
    error: function() { alert('Dados não disponíveis ou inacessíveis, tenta novamente mais tarde'); }
})

//Carrega outros mandatos
carregaDilma2Senado()

//função que inicializa o aplicativo
$(document).ready(function(){
    //valores default
    governo = "Dilma";
    casa = "Camara";
    legislatura = 2;
    visualizacao = "por_bancadas_partidárias";

    //lemos variaveis na URL
    variaveis_URL = getUrlVars();

    //aqui sao as variaveis que vamos checar se existem na URL
    var lista_variaveis = [
        "governo",
        "casa",
        "legislatura",
        "visualizacao"
    ]

    lista_variaveis.forEach(function (d) {

        if (d in variaveis_URL) {

            //eval(d = variaveis_URL(d))
        }
    })

    main(governo, legislatura, casa);
    hist_prepare();
    //draw_hist_graph();
});


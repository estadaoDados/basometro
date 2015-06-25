//pega os parametros que vieram na URL para saber onde começar o gráfico
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[#&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = decodeURIComponent(value);
    });
    return vars;
}

function carrega_lula_2_camara(){
    $.ajax({
        url: jsonURLBase + "lula2_camara.json",
        async: true,
        type: 'GET',
        dataType: 'json',
        success: function(data, saida){
            DadosGerais['lula']['camara'][2] = data //global data {politicos,votacoes,votos}
            //se for o primeiro a baixar os dados, chama a função main
            status_lula_2_camara = true;
            if (primeira_iteracao) {
                main(governo, legislatura, casa);
                baixa_resto();
            }
        },
        error: function() {
	        status_lula_2_camara = true
        }
    })
}

function carrega_lula_1_camara(){
    $.ajax({
        url: jsonURLBase + "lula1_camara.json",
        async: true,
        type: 'GET',
        dataType: 'json',
        success: function(data, saida){
            DadosGerais['lula']['camara'][1] = data //global data {politicos,votacoes,votos}
            //se for o primeiro a baixar os dados, chama a função main
            status_lula_1_camara = true;
            if (primeira_iteracao) {
                main(governo, legislatura, casa);
                baixa_resto();
            }
        },
        error: function() {
	          status_lula_1_camara = true
        }
    })
}

function carrega_dilma_1_camara(){
    $.ajax({
        url: jsonURLBase + "dilma1_camara.json",
        async: true,
        type: 'GET',
        dataType: 'json',
        success: function(data,saida){
	        DadosGerais['dilma']['camara'][1] = data //global data {politicos,votacoes,votos}
            //se for o primeiro a baixar os dados, chama a função main
            status_dilma_1_camara = true;
            if (primeira_iteracao) {
                main(governo, legislatura, casa);
                baixa_resto();
            }
        },
        error: function() {
	        status_dilma_1_camara = true
        }
    })
}

function carrega_dilma_1_senado(){
    $.ajax({
        url: jsonURLBase + "dilma1_senado.json",
        async: true,
        type: 'GET',
        dataType: 'json',
        success: function(data,saida){
            DadosGerais['dilma']['senado'][1] = data //global data {politicos,votacoes,votos}
            //se for o primeiro a baixar os dados, chama a função main
            status_dilma_1_senado = true;
            if (primeira_iteracao) {
                main(governo, legislatura, casa);
                baixa_resto();
            }
        },
        error: function() {
	        status_dilma_1_senado = true
        }
    })
}

function carrega_dilma_2_senado(){
    $.ajax({
        url: jsonURLBase + "dilma2_senado.json",
        async: true,
        type: 'GET',
        dataType: 'json',
        success: function(data,saida){
            DadosGerais['dilma']['senado'][2] = data //global data {politicos,votacoes,votos}
            //se for o primeiro a baixar os dados, chama a função main
            status_dilma_2_senado = true;
            if (primeira_iteracao) {
                main(governo, legislatura, casa);
                baixa_resto();
            }
        },
        error: function() {
            status_dilma_2_senado = true;
        }
    })
}

function carrega_dilma_2_camara() {
    $.ajax({
        url: jsonURLBase + "dilma2_camara.json",
        async: false,
        type: 'GET',
        dataType: 'json',
        success: function (data, saida) {
            $("#loading").hide()
            window.DadosGerais['dilma']['camara'][2] = data //global data {politicos,votacoes,votos}
            d = window.DadosGerais['dilma']['camara'][2]
            if (!d) {
                alert('Dados não disponíves ou inacessíveis para este governo.')
            }
            $("#loading_first").hide()
            //se for o primeiro a baixar os dados, chama a função main
            status_dilma_2_camara = true;
            if (primeira_iteracao) {
                main(governo, legislatura, casa);
                baixa_resto();
            }
        },
        error: function () {
            alert('Dados não disponíveis ou inacessíveis, tenta novamente mais tarde');
        }
    })
}

//função para baixar os outros dados que não são os primeiros carregados
function baixa_resto() {
    for (var governo in DadosGerais) {
        for (var casa in DadosGerais[governo]) {
            for (var legislatura in DadosGerais[governo][casa]) {
                var variavel = "status_"+governo+"_"+legislatura+"_"+casa;
                var funcao = "carrega_"+governo+"_"+legislatura+"_"+casa;
                if (window[variavel] == false) {
                    window[funcao]();

                }
            }
        }
    }
}


//função que carrega os dados, de acordo com as variáveis de início
function carrega_dados(){
    var funcao = "carrega_"+governo+"_"+legislatura+"_"+casa;
    window[funcao]();
}

//função que inicializa o aplicativo
$(document).ready(function(){
    //valores default
    governo = "dilma";
    casa = "camara";
    legislatura = 2;
    visualizacao = "bancadas";

    //lemos variaveis na URL
    variaveis_URL = getUrlVars();

    //agora usamos as varia'eis listadas em lista_variaveis para checar se ela foi informada no hash
    //se foi, mudamos seu valor
    lista_variaveis.forEach(function (d) {
        if (d in variaveis_URL) {
            //uma regra diferente para partidos, já que no nosso código ele é um dict chamado lista_partidos
            if (d == "partidos") {
                var partidos = variaveis_URL[d].split(",");
                partidos.forEach(function (p) {
                    filtros_partido[p] = true;
                    filtrar_partido = true;
                })
            } else {
                window[d] = variaveis_URL[d];
            }
        }
    })

    carrega_dados();
    muda_menus();
    hist_prepare();
    muda_hash();
    //draw_hist_graph();
});


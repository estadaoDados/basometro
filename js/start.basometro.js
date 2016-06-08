var primeiro = true

//pega os parametros que vieram na URL para saber onde começar o gráfico //TODO
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[#&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = decodeURIComponent(value);
    });
    return vars;
}

function carrega(quem,quando,onde){
    $.ajax({
        url: jsonURLBase + quem + quando + "_"+ onde + ".json",
        async: true,
        type: 'GET',
        dataType: 'json',
        success: function(data, saida){
            DadosGerais[quem][onde][quando] = data //global data {politicos,votacoes,votos}
            window["status_"+quem+"_"+quando+"_"+onde] = true;
            //se for o primeiro
            if (primeiro) {
                $("#loading_first").hide();
                 d = window.DadosGerais[quem][onde][quando]
                if (!d) {
                    alert('Dados não disponíveis ou inacessíveis, tenta novamente mais tarde.')
                }
                primeiro = false;
            }
            //aqui baixa as ementas atualizadas do Google Docs e lá chama a função main
            baixa_ementas(quem,onde,quando);
        },
        error: function() {
            window["status_"+quem+"_"+quando+"_"+onde] = true;
        }
    })
}

//função para baixar os outros dados que não são os primeiros carregados
function baixa_resto() {
    for (var governo in DadosGerais) {
        for (var casa in DadosGerais[governo]) {
            for (var legislatura in DadosGerais[governo][casa]) {
                var variavel = "status_"+governo+"_"+legislatura+"_"+casa;
                if (window[variavel] == false) {
                    carrega(governo,legislatura,casa);

                }
            }
        }
    }
}


//função para ler as planilhas do Google Docs
var le_planilha = function(d) {
    var cells = d.feed.entry; // d são os dados recebidos do Google...
    var numCells = cells.length;
    var cellId, cellPos , conteudo;
    var celulas = {}
    var titulos = {};

    for(var i=0; i < numCells; i++) {

        // lê na string do id a coluna e linha
        cellId = cells[i].id.$t.split('/');
        cellPos = cellId[cellId.length - 1].split('C');
        cellPos[0] = cellPos[0].replace('R', '');
        conteudo = cells[i].content.$t

        if (cellPos[0] == "1") {
            titulos[cellPos[1]] = conteudo

        } else {
            if (!(cellPos[0] in celulas)) {
                celulas[cellPos[0]] = {}
            }
            celulas[cellPos[0]][titulos[cellPos[1]]] = conteudo
        }
    }
    return celulas
}

//função que baixa planilha do google e lê usando a função acima
function baixa_ementas(gov,casa,legis) {
    try {
        $.getJSON(url_base + ordem_planilhas[gov][casa][legis] + url_final, function (dados) {
        var ementas = le_planilha(dados)
        for (var key in ementas) {
            if (ementas[key]) {
                var id = ementas[key]["ID_VOTACAO"]
                if (d["votacoes"][id]) {
                    d["votacoes"][id]["LINGUAGEM_COMUM"] = ementas[key]["LINGUAGEM_COMUM"]
                }
            }
        };

        //se for a primeira iteração, chama o main
        if (primeira_iteracao) {
            main(governo, legislatura, casa);
            baixa_resto();
        }
    })

    }
    catch(err) {}
}

//função que inicializa o aplicativo
$(document).ready(function(){
    //lemos variaveis na URL //TODO
    variaveis_URL = getUrlVars();

    //agora usamos as varia'eis listadas em lista_variaveis para checar se ela foi informada no hash
    //se foi, mudamos seu valor
    /*lista_variaveis.forEach(function (d) {
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
    })*/

    carrega(governo,legislatura,casa);
    muda_menus();
    hist_prepare();
    muda_hash();
    //draw_hist_graph();
});


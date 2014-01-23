function carregaLula2(){
    $.ajax({
        url: jsonURLBase + "lula_2_camara.json",
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
        url: jsonURLBase + "lula_1_camara.json",
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

function carregaDilmaCamara(){
    $.ajax({
        url: jsonURLBase + "dilma_1_camara.json",
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

function carregaDilmaSenado(){
    $.ajax({
        url: jsonURLBase + "dilma_1_senado.json",
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

//Carrega Dilma 1 - Câmara - Primeira visualização do projeto
$.ajax({
    url: jsonURLBase + "dilma_1_camara.json",
    async: false,
    type: 'GET',
    dataType: 'json',
    success: function(data,saida){
        $("#loading").hide()
        window.DadosGerais['dilma']['câmara'][1] = data //global data {politicos,votacoes,votos}
        d = window.DadosGerais['dilma']['câmara'][1]
        if (!d) { alert ('Dados não disponíves ou inacessíveis para este governo.')}
        $("#loading_first").hide()
        //window.ReadyJson['lula']['câmara'][1] = true //download finalizado
	      status_dilma_1_camara = true
    },
    error: function() { alert('Dados não disponíveis ou inacessíveis, tenta novamente mais tarde'); }
})

//Carrega outros mandatos
carregaDilmaSenado()

$(document).ready(main("Dilma", 1, "Camara"))

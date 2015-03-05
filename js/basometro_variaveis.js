var status_dilma_2_camara = false;
var status_dilma_2_senado = false;
var status_dilma_1_camara = false;
var status_dilma_1_senado = false;
var status_lula_1_camara = false;
var status_lula_1_senado = true;
var status_lula_2_camara = false;
var status_lula_2_senado = true;
var jsonURLBase = "dados/"

window.cores = {
    "PT"       :["#a00200",1],
    "PST"      :["#a51001",2],
    "PL"       :["#aa1d01",3],
    "PTC"      :["#b02b01",4],
    "PCdoB"    :["#b53901",5],
    "PP"       :["#ba4601",6],
    "PPB"       :["#ba4601",6],
    "PRB"      :["#bf5301",7],
    "PSL"      :["#c46102",8],
    "PPL"      :["#ca6f03",9],
    "PSB"      :["#cf7d03",10],
    "PMDB"     :["#d48b03",11],
    "PROS"     :["#d99803",12],
    "PRTB"     :["#dea604",13],
    "PTB"      :["#e4b304",14],
    "PRP"      :["#e9c104",15],
    "PDT"      :["#eece04",16],
    "PHS"      :["#f3dc05",17],
    "PR"       :["#f4e509",18],
    "PSC"      :["#eae116",19],
    "PMR"      :["#dfdd24",20],
    "PTdoB"    :["#d5d931",21],
    "PV"       :["#cad63e",22],
    "PMN"      :["#c0d24b",23],
    "PSD"      :["#b6ce58",24],
    "PEN"      :["#abc966",25],
    "SDD"      :["#a1c673",26],
    "PSOL"     :["#97c281",27],
    "PPS"      :["#8cbe8e",28],
    "DEM"      :["#82ba9b",29],
    "PFL_DEM"  :["#77b6a8",30],
    "PSDB"     :["#6db3b6",31],
    "PRONA"    :["#62afc3",32],
    "PAN"      :["#58abd0",33],
    "PSDC"     :["#4da7de",34],
    // "ZZZ"   :["#43a3eb",35],
    "S.Part."   :["#999999",35]
}

window.DadosGerais={
  "dilma":{"câmara": {1: {}, 2:{}}, "senado": {1: {}, 2:{}}},
  "lula":{"câmara": {1:{}, 2:{}}, "senado": {1:{},2:{}}}
}

window.ReadyJson={
  "dilma":{"camara": {1: false, 2: false }, "senado": {1: false, 2:false}},
  "lula":{"camara": {1: false, 2: false}, "senado": {1: true, 2: true}}
}

window.histData = {};

var primeira_iteracao = true;
var meses = [,,,,,,"jul",,,,,];//intermediarios na legenda
var altura = 450, largura = 765; // do canvas
var ios = /(iPad|iPhone)/i.test(navigator.userAgent)
var complemento_camara = "http://www2.camara.gov.br/deputados/pesquisa/ws_layouts_deputados_fotoBiograf?id="
var inicio = false,
    fim = false,
    d,//dados e grupo que contem os pontos
    g,
    casa = "câmara",
    governo = "Dilma",
    legislatura = "2",
    first_time = true,
    datas_sorted = [],
    votacoes = [],
    votacoes_totais,
    antigas_votacoes_totais,
    participantes = [],
    votacoes_ids = [],
    participantes = {},
    votantes = {},
    votantes_sorted = [],
    partidos = [],
    votos = [],
    passos = 7,
    filtros = {},
    filtros_votacoes = [],
    filtrar_votacoes = false,
    porcentagem,
    enter_frame = 0,
    tip_path,
    item_selected = false,
    media_por_votacao = {},
    media_da_votacao = {},
    politicos_hints = [],
    votacoes_hints = [],
    visualizacao = "por_bancadas_partidárias",
    is_fim = false,
    inicio_left = 0,
    play_interval,
    tocando = false,
    primeiro_toque = true,
      bolinha_camara = 3, // do canvas
    bolinha_senado = 5; // do canvas

var partidos_clicados = [];



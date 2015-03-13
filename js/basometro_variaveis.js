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
    "PT"       :["#a00200",20],
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
    "PTN"     :["#f4e509",19],
    "PSC"      :["#eae116",20],
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
    "S.Part."   :["#999999",36]
}


window.paleta = {
    0:'#A11217',
    1:'#BE003E',
    2:'#BC005C',
    3:'#BA007C',
    4:'#98007F',
    5:'#7B057E',
    6:'#5E196F',
    7:'#45187D',
    8:'#3A3A8B',
    9:'#00408F',
    10:'#00528B',
    11:'#0066A4',
    12:'#007CC0',
    13:'#009BDB',
    14:'#0096B2',
    15:'#009493',
    16:'#008270',
    17:'#009045',
    18:'#00602D',
    19: '#5F8930',
    20:'#7BAC39',
    21:'#A3BD31',
    22:'#CAD226',
    23:'#FEEE00',
    24:'#E9BC00',
    25:'#B6720A',
    26:'#9A740F',
    27: '#634600'
}

window.ordem_partido = {
    lula: {
        1:['PST','PMN','PT','PSL','PSB','PCdoB','PL','PSC','PTC','PTB','PP','PMDB','PMR','PPS','PDT','PV','PPB','PSOL','PRP','PSDB','DEM','PRONA','PRB'],
        2:['PMN','PT','PSB','PRB','PCdoB','PHS','PTdoB','PR','PAN','PSC','PTC','PTB','PP','PMDB','PPS','PDT','PRTB','PV','PPB','PSOL','PRP','PSDB','DEM']
    },
    dilma: {
        1: ['PT','PMN','PCdoB','PSL','PHS','PRB','PRP','PROS','PSDC','PTdoB','PDT','PR','PP','PSB','PMDB','PTB','PSC','PRTB','PV','PTC','PSD','PEN','SDD','PSOL','PPS','DEM','PSDB'],
        2: ['PTC','PT','PCdoB','PSL','PRB','PRTB','PP','PHS','PMDB','PTB','PRP','PSB','PROS','PTN','PDT','PR','PTdoB','PV','PSC','PMN','PSD','PEN','PSDC','SDD','PSOL','PPS','DEM','PSDB']
    }
}

window.dic_partidos = {
    PT: 'Partido dos Trabalhadores',
    PST: 'Partido Social Trabalhista',
    PL: 'Partido Liberal',
    PTC: 'Partido Trabalhista Cristão',
    PCdoB: 'Partido Comunista do Brasil',
    PP: 'Partido Progressista',
    PRB: 'Partido Republicano Brasileiro',
    PSL: 'Partido Social Liberal',
    PPL: 'Partido Pátria Livre',
    PSB: 'Partido Socialista Brasileiro',
    PMDB: 'Partido do Movimento Democrático Brasileiro',
    PROS: 'Partido Republicano da Ordem Social',
    PRTB: 'Partido Renovador Trabalhista Brasileiro',
    PTB: 'Partido Trabalhista Brasileiro',
    PRP: 'Partido Republicano Progressista',
    PDT: 'Partido Democrático Trabalhista',
    PHS: 'Partido Humanista da Solidariedade',
    PR: 'Partido da República',
    PTN: 'Partido Trabalhista Nacional',
    PSC: 'Partido Social Cristão',
    PMR: 'Partido Municipalista Renovador',
    PTdoB: 'Partido Trabalhista do Brasil',
    PV: 'Partido Verde',
    PMN: 'Partido da Mobilização Nacional',
    PSD: 'Partido Social Democrático',
    PEN: 'Partido Ecológico Nacional',
    SDD: 'Partido Solidariedade',
    PSOL: 'Partido Socialismo e Liberdade',
    PPS: 'Partido Popular Socialista',
    DEM: 'Democratas',
    PFL_DEM: 'Partido da Frente Liberal',
    PSDB: 'Partido da Social Democracia Brasileira',
    PRONA: 'Partido da Reedificação da Ordem Nacional',
    PAN: 'Partido dos Aposentados da Nação',
    PPB: 'Partido Progressista Brasileiro',
    PSDC:'Partido Social Democrático Cristão',
    "S.Part.": "Sem Partido"
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
var primeira_alca = true;
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
    destaque_hover = false,
    bolinha_camara = 3, // do canvas
    bolinha_senado = 5, // do canvas
    cores = {}

var partidos_clicados = [];



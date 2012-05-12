var cores = {"PT":["#a00001",0],"PTC":["#ac1b01",1],"PRTB":["#be4700",2],"PCdoB":["#d57800",3],"PSB":["#e9a900",4],"PP":["#f8d100",5],"PSL":["#fff600",6],"PMDB":["#f8e804",7],"PTB":["#e7d20c",8],"PRB":["#cfb014",9],"PSD":["#b48d1c",10],"PSC":["#9c7222",11],"PTdoB":["#816022",12],"PRP":["#7a6f1f",13],"PMN":["#6a7f16",14],"PDT":["#5c9411",15],"PHS":["#51a911",16],"PR":["#4bbc11",17],"PV":["#4cd22e",18],"PPS":["#6cecab",19],"PSOL":["#74e7f6",20],"DEM":["#53b4eb",21],"PSDB":["#246ec2",22],"S.Part.":["#999",23]};
var meses = [,,"mar",,,"jun",,,"set"];//intermediarios na legenda
var d, g;//dados e grupo que contem os pontos
var altura = 450, largura = 765; // do canvas
var ios = /(iPad|iPhone)/i.test(navigator.userAgent)
var bolinha = 3; // do canvas
var complemento_foto = "http://www2.camara.gov.br/deputados/pesquisa/ws_layouts_deputados_fotoBiograf?id="
var inicio, fim, datas_sorted = [], votacoes = [], participantes = [], votacoes_ids = [], participantes = {}, votantes = {}, votantes_sorted = [], partidos = [], votos = [], passos = 7, filtros = {}, porcentagem, enter_frame = 0, tip_path, item_selected = false, media_por_votacao = {},politicos_hints = [],votacoes_hints = [], visualizacao = "por_bancadas_partidárias", is_fim = false, inicio_left = 0, play_interval,tocando = false, first_time = true;

$.ui.autocomplete.prototype._renderItem = function( ul, item){
  var term = this.term.split(' ').join('|');
  var re = new RegExp("(" + term + ")", "gi") ;
  var t = item.label.replace(re,"<b>$1</b>");
  return $( "<li></li>" )
     .data( "item.autocomplete", item )
     .append( "<a>" + t + "</a>" )
     .appendTo( ul );
};

function main(legislatura){
	$("#mpl"+(ios?"":"_ios")).hide();
	$("#como_usar").click(function(){
		$(this).fadeOut();
	})
	if ($.browser.msie && $.browser.version < 9 ) {
		alert("Atualize o Internet Explorer para a versão 9 ou superior; ou abra o Basômetro em outro navegador, como Chrome ou Firefox.")
	};
	$("#loading").show();
	$.getJSON("./dados_finais_"+legislatura+".json",function(data, saida){
		$("#loading").hide();
		d = data;//global data {politicos,votacoes,votos}
		papel();
		navegacao();
		muda();
	});
}

function papel(){
	paper.install(window);
	paper.setup('grafico');
	view.viewSize = new Size(largura, altura+10);

	g = new Group();
	// g.position.y = 5;
	for(politico in d.politicos){
		d.politicos[politico].ID_POLITICO = politico;
		var circulo = new Path.Circle([380,5], bolinha);
		circulo.fillColor = 'red', circulo.fillColor.alpha = 0.7;
  	circulo.name = "id"+d.politicos[politico].ID
  	circulo.partido = d.politicos[politico].PARTIDO
  	circulo.politico = politico;
  	circulo.uf = d.politicos[politico].UF;
  	circulo.mandato = d.politicos[politico].ANO_MANDATO
  	circulo.foto = d.politicos[politico].URL_FOTO
		circulo.votos = [0,0,0,0,0,0,0];//o ultimo são os votos com o governo
		g.addChild(circulo);
	}

	tip_path = new Path();
	tip_path.strokeColor = 'white';
	tip_path._index = 1000;

	for (votacao in d.votacoes) {
		d.votacoes[votacao].ID_VOTACAO = votacao;
	}
	view.onFrame = onFrame;
	
	var tool = new Tool();
	tool.onMouseDown = onMouseDown;
}

function navegacao(){

	$("#choices").hide();
	$("#navegacao_topo a.drop").click(function(){
		if ($("#choices").is(":visible")) {
			$("#choices").hide();
		}else{
			var choices = $(this).attr("title").split(",");
			choices_parsed = "";
			for (var i = 0; i < choices.length; i++) {
				choices_parsed += "<div id='choice_"+choices[i]+"' class='choices'>"+choices[i].replace(/_/g," ")+"</div>"
			};
			$("#choices").html(choices_parsed).css("left",$(this).position().left + "px").width($(this).outerWidth()).show().css("cursor", "pointer");
		};
	})
	$(".choices").live("click",function(){
		visualizacao = $(this).attr("id").substr(7);
		$("#listar_tipos").text(visualizacao.replace(/_/g," "))
		$("#choices").hide();
		mudar_visualizacao();
	}).css("cursor", "pointer")

	$(".partido, .estado, .bancada").click(function(){
		$(this).toggleClass("click");
		muda();
	})
	
	//Desenha as escalas do gráfico
	$('.linha_apoio').each(function (i){
		$(this).css("top",(i * (altura/4) )+5);
	});
	
	$("#search").autocomplete({
		source:[],
		select: function(event, ui) {
			if (visualizacao == "por_bancadas_partidárias") {
				selecionar_politico(ui.item.value)
			}else{
				mover_alca_fim($(".evento[title='"+ui.item.value+"']").attr("id"))
			};
		}
	})
	
	function update_pos(el){
		var pos = el.position().top;
		$('.marcador_h').css('top',(pos+29)+'px');
		el.html(parseInt(100-((pos/altura)*100))+'%');
		linha_y = Math.round((pos/altura)*100)/100;
	}

	$('.seletor').draggable({
		containment:"parent",
		scroll: false,
		drag: function(event, ui) {
			update_pos($(this));
		},
		stop: function(event, ui) {
			update_pos($(this));
			totalizacao();
		}
	});

	
	$('.alca').draggable({
		containment:"parent",
		scroll: false,
		drag: function(event,ui){
			is_fim = $(this).attr('id') == "alca_fim";
			if (is_fim){
				if ($(this).position().left <= $("#alca_inicio").position().left) {
					$(this).css("left", ($("#alca_inicio").position().left + 1) + "px");
					return false;
				}
			}else{
				inicio_left = $(this).position().left;
				if (inicio_left >= $("#alca_fim").position().left) {
					$(this).css("left",($("#alca_fim").position().left - 1) + "px");
					return false;
				}
			}
	    $("#slider_tip").text(update_pos_alca($(this),is_fim).attr("title"))
    },
		stop: function(event, ui) {
			var next = update_pos_alca($(this))
	    $("#slider_tip").text(next.attr("title"))

	    if (is_fim){
	    	fim = (next.length == 0)?datas_sorted[datas_sorted.length-1][1]:d.votacoes[next.attr("id")];
	    } else {
				inicio_left = $(this).position().left;
	    	inicio = (next.length == 0)?datas_sorted[0][1]:d.votacoes[next.attr("id")];
	    }
			muda();
		}
	});

	desenha_eventos(); //Cria eventos na timeline
}

function update_pos_alca(el) {
	slider_finishing(el)
	return find_next(el);
}

function find_next(el){
	var pos = el.position().left;
	return ( $('.evento').filter(function() {return ($(this).position().left < pos) }).last() )
}

function slider_finishing(el) {
	if (is_fim) {
		$('.intervalo').css('width',($('#fim').position().left + el.position().left - (inicio_left+40))+'px');
		$("#liga_caixa").css('left',($("#alca_fim").position().left + $("#fim").position().left - 9));
	}else{
		$('.intervalo').css('left',(inicio_left + 50)+'px')
		.css('width',(($("#alca_fim").position().left + $("#fim").position().left -30) - (inicio_left))+'px')
		$("#liga_caixa").css('left',el.position().left + 50);
	}
}


function mudar_visualizacao() {
	$(".abas").hide();
	$("#"+visualizacao).show();

	if (visualizacao == "por_bancadas_partidárias") {
		$("#search").autocomplete("option", { source: politicos_hints });
		$(".intervalo").fadeIn();
		$("#alca_inicio").fadeIn(function(){
			var alca = $("#alca_fim").text("Fim").removeClass("alca_votacao");
			if (alca.position().left < inicio_left) {
				is_fim = true;
				var next = update_pos_alca($(this));
				fim = d.votacoes[next.attr("id")];
				alca.css("left",(inicio_left + 1)+ "px")
				slider_finishing(alca)
				$("#slider_tip").text(next.attr("title"))
			};
			$("#search").attr("placeholder","buscar politico")
		});
	}else{
		$("#search").autocomplete("option", { source: votacoes_hints });
    $("#slider_tip").text(update_pos_alca($("#alca_fim").text("Votação").addClass("alca_votacao"),true).attr("title"))
		$(".intervalo").fadeOut();
		$("#alca_inicio").fadeOut();
		$("#search").attr("placeholder","buscar votacao")
	  muda();
	};
}

function mover_alca_fim(votacao_num,callback) {
	is_fim = true;
	var alca = $("#alca_fim");
	var votacao = $("#"+votacao_num)
	alca.css("left",votacao.position().left+ "px")
	fim = d.votacoes[votacao_num];
	slider_finishing(alca)
	$("#slider_tip").text(votacao.attr("title"))
	muda(callback);
}

$("#somar_votacao").click(function(){
	var proximo = $("#"+fim.ID_VOTACAO).next();
	if (proximo.length > 0) mover_alca_fim(proximo.attr("id"));
})

$("#subtrair_votacao").click(function(){
	var anterior = $("#"+fim.ID_VOTACAO).prev();
	if (anterior.length > 0) mover_alca_fim(anterior.attr("id"));
})

$("#tocar_votacao").click(function(){
	if (tocando) {
		$(this).children().removeClass("parar").addClass("tocar")
		tocando = false;
		window.clearInterval(play_interval);
	}else{
		$(this).children().removeClass("tocar").addClass("parar")
		tocando = true;
		mover_alca_fim(inicio.ID_VOTACAO)
		play_interval = window.setInterval(function(){
			var proximo = $("#"+fim.ID_VOTACAO).next();
			if (proximo.length > 0) mover_alca_fim(proximo.attr("id"));
		},1000);
	};
})

function selecionar_politico(nome) {
	for (var i = 0; i < g.children.length; i++) {
		g.children[i].strokeColor = null
		if(g.children[i].politico == nome) {
			if (g.children[i].visible) {
				//TODO: DRY aqui
				item_selected = g.children[i];
				$("#ficha").show();
				preenche_ficha(item_selected);
				draw_tip_arc(item_selected)
			}else {
				alert("Não participou dessa votação")
				esconder_ficha();
			};
		}
	};
}

function desenha_eventos(){
	datas_sorted = [],data_anterior = new Date(0),votacoes_hints = [];
	for (votacao in d.votacoes) {
		var dt = String(d.votacoes[votacao].DATA).replace(/(\S{2})/g,"$1-").replace(/-$/,"").split("-")
		dt = dt.concat(d.votacoes[votacao].HORA.split(":"))
		d.votacoes[votacao].data_parsed = new Date("20"+dt[0],(dt[1]-1),dt[2],dt[3],dt[4]);
		datas_sorted.push([d.votacoes[votacao].data_parsed,d.votacoes[votacao],votacao])
	}
	datas_sorted.sort(function(a,b){return b[0]-a[0]}).reverse();
	var intervalo = ((largura - 130)/datas_sorted.length);
	function posicao(i){return Math.round((i*intervalo)+intervalo)+"px"}//TODO: pixels dont allow floats, so we have a problem on positioning scale
	for (var i = 0; i < datas_sorted.length; i++) {
		if(data_anterior.getFullYear() != datas_sorted[i][0].getFullYear()){
			$('#eventos_tag').append('<div class="evento_tag" style="left:'+posicao(i)+'">'+datas_sorted[i][0].getFullYear()+'</div>');
		} else if(data_anterior.getMonth() != datas_sorted[i][0].getMonth() && meses[datas_sorted[i][0].getMonth()]){
			$('#eventos_tag').append('<div class="evento_tag" style="left:'+posicao(i)+'">'+meses[datas_sorted[i][0].getMonth()]+'</div>');
		}
		var dt = datas_sorted[i][1].data_parsed;
		var titulo = (i+1) + " - " + dt.getDate() +"/"+ (dt.getMonth()+1) +"/"+ dt.getFullYear()+ " "+ dt.getHours() + "h" + (dt.getMinutes()<10?"0":"")+ dt.getMinutes() + " - " +datas_sorted[i][1].LINGUAGEM_COMUM + " ("+datas_sorted[i][1].ID_VOTACAO + ")";
		votacoes_hints.push(titulo)
		$('#eventos').append('<div id="'+datas_sorted[i][2]+'" class="evento" data="'+datas_sorted[i][0].getTime()+'" title="'+titulo+'" style="left:'+posicao(i)+'"></div>');
		data_anterior = datas_sorted[i][0];
	};
	inicio = datas_sorted[0][1];
	fim = datas_sorted[datas_sorted.length-1][1];
}


function muda(){
	enter_frame = 0, politicos_hints = [], votacoes_ids = [], participantes = {}, votantes = {}, partidos = [], votos = [], votantes_sorted = [], media_por_votacao = {};
	if (inicio.data_parsed > fim.data_parsed) inicio = fim;
	for (var i = 0; i < datas_sorted.length; i++) {
		if(datas_sorted[i][1].data_parsed >= inicio.data_parsed && datas_sorted[i][1].data_parsed <= fim.data_parsed) {
			votacoes_ids.push(Number(datas_sorted[i][2]));
			media_por_votacao[Number(datas_sorted[i][2])] = {}//[PARTIDO][VOTOS_GOVERNO,VOTOS_TOTAIS]
		}
	};
	$("#vota_count").text(votacoes_ids.length);

	for (var i = 0; i < d.votos.length; i++) {//votos = [POLITICO,ID_VOTACAO,PARTIDO,VOTO]
		if(votacoes_ids.indexOf(Number(d.votos[i][1])) != -1){ //todos os votos aqui já estão subselecteds
			votos.push(d.votos[i])

			if (media_por_votacao[d.votos[i][1]][d.votos[i][2]]) {
				if(d.votos[i][3]>=0 && d.votos[i][3] < 4) media_por_votacao[d.votos[i][1]][d.votos[i][2]][1] ++
			}else{
				media_por_votacao[d.votos[i][1]][d.votos[i][2]] = [0,((d.votos[i][3]>=0 && d.votos[i][3] < 4)?1:0)]
			};

			if(d.votacoes[d.votos[i][1]].ORIENTACAO_GOVERNO == "Sim" && d.votos[i][3] == 1) {
				media_por_votacao[d.votos[i][1]][d.votos[i][2]][0] ++
			} else if(d.votacoes[d.votos[i][1]].ORIENTACAO_GOVERNO == "Não" && d.votos[i][3] == 0) {
				media_por_votacao[d.votos[i][1]][d.votos[i][2]][0] ++
			}

			participantes["id"+d.votos[i][0]] = [d.votos[i][2],d.votos[i][3]] //ultimo partido e ultimo voto
			if (fim.ID_VOTACAO == d.votos[i][1]) votantes["id"+d.votos[i][0]] = [d.votos[i][2],d.votos[i][3]] //só os votantes da última sessão
			if (partidos.indexOf(d.votos[i][2]) == -1) partidos.push(d.votos[i][2]);
		}
	};

	for (var i = 0; i < g.children.length; i++) { g.children[i].visible = false };//reset visibility
	for (var i = 0; i < partidos.length; i++) {if ( !votantes_sorted[cores[partidos[i]][1]]) votantes_sorted[cores[partidos[i]][1]] = [] }; //initiate array of partidos

	for(politico in votantes){
		politicos_hints.push(g.children[politico].politico);
		g.children[politico].visible = true;
		g.children[politico].partido = votantes[politico][0];
		g.children[politico].fillColor = cores[votantes[politico][0]][0];
		g.children[politico].fillColor.alpha = 0.7;
		g.children[politico].aceleracao = 0;
		g.children[politico].destino_y = 0; //eixo vertical
		g.children[politico].destino_x = 0; //eixo horizontal
		g.children[politico].votos = [0,0,0,0,0,0,0];//o ultimo são os votos com o governo
		votantes[politico].push(politico,g.children[politico].politico); //[PARTIDO,ULTIMO_VOTO,ID_POLITICO,NOME_CASA]
	}
	politicos_hints.sort();
	if (first_time) {
		$("#search").autocomplete("option", { source: politicos_hints });
		first_time = false;
	}

	for (var i = 0; i < votos.length; i++) {
		//TODO: dupla iteração de votos???
		g.children["id"+votos[i][0]].votos[votos[i][3]] ++;
		if(d.votacoes[votos[i][1]].ORIENTACAO_GOVERNO == "Sim" && votos[i][3] == 1) g.children["id"+votos[i][0]].votos[6] ++;
		if(d.votacoes[votos[i][1]].ORIENTACAO_GOVERNO == "Não" && votos[i][3] == 0) g.children["id"+votos[i][0]].votos[6] ++;
	}

	for(politico in votantes) {
		votantes_sorted[cores[g.children[politico].partido][1]].push(votantes[politico])
	}

	for (var i = 0; i < votantes_sorted.length; i++) {
		if (votantes_sorted[i]) {
			votantes_sorted[i].sort(function(a,b){
				if (a[3] < b[3]) return -1;
				if (a[3] > b[3]) return 1;
				return 0;
			});
		}
	};

	var x_pos = 10;
	for (var i = 0; i < votantes_sorted.length; i++) {
		if (votantes_sorted[i]) {
			for (var j = 0; j < votantes_sorted[i].length; j++) {//[PARTIDO,ULTIMO_VOTO,ID_POLITICO,NOME_CASA]
				if (votantes_sorted[i][j]) {
					var politico = votantes_sorted[i][j][2];
					votos_ = g.children[politico].votos;
					g.children[politico].destino_x = x_pos;
					g.children[politico].aceleracao_x = (g.children[politico].destino_x - g.children[politico].position.x)/passos;
					x_pos += 1.4;




					//votos_ = [NAO,SIM,ABSTENCAO,OBSTRUCAO,NAO VOTOU,PRESIDENTE,COM_GOVERNO]
					var participacao = votos_[0] + votos_[1] + votos_[2] + votos_[3];
					g.children[politico].governismo = votos_[6]/participacao; //em porcentagem
					g.children[politico].destino_y = (altura - (g.children[politico].governismo * altura)) + 5;
					if (isNaN(g.children[politico].governismo)) g.children[politico].visible = false;
					// (Math.PI * (participacao * participacao * participacao))/(altura*20)
					// g.children[politico].bounds.width  = Math.log(participacao)*3;
					// g.children[politico].bounds.height = Math.log(participacao)*3;





					g.children[politico].aceleracao_y = (g.children[politico].destino_y - g.children[politico].position.y)/passos;
				};
			};
		};
	};

	filtra();
	muda_votacao();
}

function onFrame(event){
	if (enter_frame < passos){
		enter_frame++;

		for (var i = 0; i < votantes_sorted.length; i++) {
			if(votantes_sorted[i]){
				for (var j = 0; j < votantes_sorted[i].length; j++) {//[PARTIDO,ULTIMO_VOTO,ID_POLITICO,NOME_CASA]
					if (votantes_sorted[i][j]) {
						g.children[votantes_sorted[i][j][2]].position.y += g.children[votantes_sorted[i][j][2]].aceleracao_y;
						g.children[votantes_sorted[i][j][2]].position.x += g.children[votantes_sorted[i][j][2]].aceleracao_x;
						if(g.children[votantes_sorted[i][j][2]].strokeColor) {
							item_selected = g.children[votantes_sorted[i][j][2]];
							draw_tip_arc(item_selected);
						}
					};
				};
			}
		};
	} else if (enter_frame == passos){
		enter_frame++;//faz falhar
		totalizacao();
	}
}

function filtra(){

	filtros = {}, filtrar_partido = false, filtrar_estado = false;
	$(".partido.click,.estado.click").each(function(){
		filtros[$(this).find("abbr").text()] = true;
		if($(this).is(".partido")) filtrar_partido = true;
		if($(this).is(".estado")) filtrar_estado = true;
	});

	if (filtrar_partido || filtrar_estado) {
		for (var i = 0; i < g.children.length; i++) {
			if (g.children[i].visible) {
				if ( !( (filtrar_estado?filtros[g.children[i].uf]:true) && (filtrar_partido?filtros[g.children[i].partido]:true) ) ) {
					g.children[i].visible = false;
					g.children[i].strokeColor = null;
				};
			};
		};
	};

}

function totalizacao(){
	if (item_selected) {
		if (item_selected.visible) {
			preenche_ficha(item_selected)
		} else {
			esconder_ficha();
		};
	}

	politicos_votantes = 0, governistas = 0, porcentagem = parseInt($("#seletor_v").text()) ;
	for (var i = 0; i < g.children.length; i++) {
		if(g.children[i].visible){

			politicos_votantes ++;
			if ((g.children[i].governismo*100) >= porcentagem && g.children[i].governismo != 0) {
				governistas ++;
			}
		}
	};
	$('#titulo').html("Em <b>"+ votacoes_ids.length +"</b> votações, <b>"+ governistas + "</b> deputados votaram com o governo em <b>"+ $("#seletor_v").text() +"</b> das vezes ou mais; e <b>"+ (politicos_votantes-governistas) +"</b> votaram com o governo em "+(($("#seletor_v").text() == "0%")?"":"menos de")+" <b>"+ $("#seletor_v").text() +"</b> das vezes")
	.effect( "highlight", {color:tocando?"#111":"#333"}, 500 );

	atualiza_partidos();
}

function atualiza_partidos(){
	var media_partidos = {};
	for(votacao_ in media_por_votacao) {
		for(partido_ in media_por_votacao[votacao_]) {
			var porcentagem = media_por_votacao[votacao_][partido_][0]/media_por_votacao[votacao_][partido_][1];
			if (media_partidos[partido_]) {
				if(!isNaN(porcentagem)) {
					media_partidos[partido_][1] ++;
					media_partidos[partido_][0] += porcentagem;
				}
			}else{
				media_partidos[partido_] = [(isNaN(porcentagem)?0:porcentagem),(isNaN(porcentagem)?0:1)]
			};
		}
	}
	for(partido_ in media_partidos) {
		media_partidos[partido_] = parseInt((media_partidos[partido_][0]/media_partidos[partido_][1])*100)
	}

	$(".presenca_partido").each(function(){
		$(this).text("---");
	})
	for(partido in media_partidos) {
		var text_soma = (isNaN(media_partidos[partido]))?"---":media_partidos[partido]+"%";
		$(".presenca_partido#"+partido).text(text_soma);
	}
	
}

//Função de mouse over nos deputados
function onMouseDown(event){
	for (var i = 0; i < g.children.length; i++) {g.children[i].strokeColor = null}
	var hit = project.hitTest(event.point, {segments: false, stroke: true, fill: true, tolerance: 2 });
	if(hit && hit.item.visible){
		if(hit) {
			$("#ficha").show();
			preenche_ficha(hit.item)
			draw_tip_arc(hit.item)//vai para o lado esquerdo
		}else{
			esconder_ficha();
		}
	}else{
		esconder_ficha();
	}
}

function esconder_ficha(){
	$("#ficha").hide();
	item_selected.strokeColor = null;
	tip_path.visible = false;
	item_selected = false;
}

function preenche_ficha (item) {
	$("#ficha_partido_cor").css("background-color",cores[item.partido][0])
	$("#ficha_nome").text(item.politico)
	$("#ficha_partido").text(item.partido)
	$("#ficha_uf").text(item.uf)
	$("#ficha_taxa").text(Math.round(item.governismo*100) + "%")
	$("#ficha_contra").text((item.votos[0] + item.votos[1] + item.votos[3]) - item.votos[6])
	$("#ficha_favor").text(item.votos[6])
	$("#ficha_abst").text(item.votos[2])
	$("#ficha_n_votou").text(item.votos[4])

	if ($("#ficha_foto").attr("src") != (complemento_foto + item.foto)) {
		$("#lendo_foto").show();
		$("#ficha_foto").hide().attr("src",(complemento_foto + item.foto)).load(function(){
			$(this).show();
			$("#lendo_foto").hide();
		})
	};
}

function draw_tip_arc (item) {
	var left = false;
	item.strokeColor = "white";
	if (item.position.x > (largura/2)) {
		left = true;
		$("#ficha").css("left",10)
	}else{
		$("#ficha").css("left",600)
	};
	tip_path.removeSegments();
	tip_path.add(item.position);
	tip_path.add(new Point(item.position.x, (altura -50) ));
	tip_path.add(new Point((left?133:600), (altura -50) ));
	tip_path.visible = true;
}

function muda_votacao(){

	$("#titulo_voto").html("<br>"+fim.LINGUAGEM_COMUM);
	$("#texto_voto").html(fim.O_QUE_FOI_VOTADO);
	$("#subtitulo_voto").html(fim.EMENTA);
	$("#texto_data").html(fim.TIPO + " " + fim.NUMERO + " " + fim.ANO + " &rarr; <span id='t_data'>"+fim.data_parsed.getDate()+"/"+(fim.data_parsed.getMonth()+1)+"/"+fim.data_parsed.getFullYear()+"</span> - <span id='t_hora'>"+fim.data_parsed.getHours()+"h"+(fim.data_parsed.getMinutes()<10?"0":"")+fim.data_parsed.getMinutes()+" &rarr; Orientação do governo: <b>"+fim.ORIENTACAO_GOVERNO+"</b></span>");

	$('#partido_voto').html('<div id="governista" ></div><div id="oposicionista" ></div><div id="abstencao" ></div>');

	var govs = 0, opos = 0, abst = 0, nao_votou = 0, partidos_sorted = [];
	$('#governista').html('<div id="gov_counter">Pró-governo</div><br>');
	$('#oposicionista').html('<div id="ops_counter">Contra o governo + obstruções </div><br>');
	$('#abstencao').html('<div id="abs_counter">Abstenção</div><br>');

	for (var i = 0; i < partidos.length; i++) {
		partidos_sorted[cores[partidos[i]][1]] = partidos[i];
	};
	for (var i=0; i<partidos_sorted.length; i++){
		$('#governista').append('<div id="v_g_'+partidos_sorted[i]+'" class="partido_row" ><small>'+partidos_sorted[i]+'</small></div>');
		$('#oposicionista').append('<div id="v_o_'+partidos_sorted[i]+'" class="partido_row" ></div>');
		$('#abstencao').append('<div id="v_a_'+partidos_sorted[i]+'" class="partido_row" ></div>');
	};

	var count = 0;
	for (var i = 0; i < votantes_sorted.length; i++) {
		if(votantes_sorted[i]){
			for (var j = 0; j < votantes_sorted[i].length; j++) {//[PARTIDO,ULTIMO_VOTO,ID_POLITICO,NOME_CASA]
				if (votantes_sorted[i][j] && votantes_sorted[i][j][1] != 4) {
					count ++

					// tipos_de_voto = ["NAO","SIM","ABSTENCAO","OBSTRUCAO","NAO VOTOU","PRESIDENTE"];
					var class_;
					var type;
					if (votantes_sorted[i][j][1] == 2){
						abst++;
						class_ = "abstencao_voto", type = "a";
					} else if (votantes_sorted[i][j][1] == 3){
						opos++;
						class_ = "oposicionista_voto obstrucao", type = "o";
					} else if (votantes_sorted[i][j][1] == 5){
						abst++;
						class_ = "abstencao_voto /cod_17", type = "a";
					} else if ((fim.ORIENTACAO_GOVERNO == "Sim" && votantes_sorted[i][j][1] == 1) || (fim.ORIENTACAO_GOVERNO == "Não" && votantes_sorted[i][j][1] == 0)){
						govs++;
						class_ = "governista_voto", type = "g";
					}else {
						opos++;
						class_ = "oposicionista_voto", type = "o";
					}

					$("#v_"+type+"_"+votantes_sorted[i][j][0]).append('<div class="'+class_+'" title="'+g.children[votantes_sorted[i][j][2]].politico+', '+votantes_sorted[i][j][0]+'" style="background-color:'+cores[votantes_sorted[i][j][0]][0]+';" ></div>');

				}else{
					nao_votou ++;
				};
			};
		}
	};
	
	var plus1;
	govs <= 1 ?  plus1 = " voto" : plus1 = " votos";
	$('#gov_counter').append(' <i> • <b>'+govs+"</b>"+plus1+"</i>");
	opos <= 1 ?  plus1 = " voto" : plus1 = " votos";
	$('#ops_counter').append(' <i> • <b>'+opos+"</b>"+plus1+"</i>");
	abst <= 1 ?  plus1 = " voto" : plus1 = " votos";
	$('#abs_counter').append(' <i> • <b>'+abst+"</b>"+plus1+"</i>");

}



$(document).ready(main(1));



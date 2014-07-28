var partidos_clicados = [],
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    focus_formatDate = d3.time.format("%m/%Y"),
    focus_formatOutput = function(d) { return focus_formatDate(d.date) + ": " + d.valor + "%"; };

window.histData = {};

function toggleHistorico(){
    $("#janela_historico").toggle();
}

function esconder_janela_historico(){
    $("#janela_historico").hide();
}

function hist_prepare(){
    hist_draw_base();
    hist_get_data();
    hist_first_draw();
}

function hist_draw_base(){
    /* Gera o SVG e cria abase para os gráficos de linha de histórico. */
    var width = 740,
        height = 505;

    $('<ul/>', {
        'id':'lista_valores_historico',
        'class':'lista_valores_historico',
    }).appendTo('#janela_historico');

    $('<li/>',{
        'class': 'data_considerada',
        }).appendTo("#lista_valores_historico");

    d3.select("#janela_historico").append("svg").append("g")
        .attr("id","svg_hist")
        .attr("width", width)
        .attr("height", height)
        .attr("transform","translate(0,8)")
        .on("click",esconder_janela_historico);
}

function hist_draw_legend(partido, conteudo){
    $('<li/>', {
        'class': "focus_text " + partido,
        'html': function(){ return partido + ": " + conteudo ;},
    }).appendTo('#lista_valores_historico')
}

function hist_legend_update(partido, conteudo){
    $(".focus_text." + partido)
        .text(partido + ": " + conteudo);
}

function hist_get_data(){
    //carrega os dados do histórico

    var base_hist_url = "/basometro/dados/",
        file_url = base_hist_url + "hist_" + governo + "_" + casa.replace("â","a") + "_" + legislatura + ".json";

    $.ajax({
        type: 'GET',
        url: file_url,
        dataType: 'json',
        success: function(data) {
            var parseDate = d3.time.format("%Y-%m-%d").parse;
            for (idx in data){
                data[idx].forEach(function(d) {
                  d.date = parseDate(d.date);
                  d.valor = +d.valor;
                });
            }
            window.histData = data;
        },
        async: false
    });
}

function hist_draw_clicked(element){
    if (!element) {
        partidos_clicados = [];
        $("[id*='hist_part_'").remove();
        $('.focus:not(.Geral)').remove();
        $('.focus_text:not(.Geral)').remove();
    } else {
        partido = element.find("abbr").text();
        if (element.hasClass("click")) {
            // Se o elemento possui a classe 'click' significa que ele está "clicado"/"selecionado"
            if (partidos_clicados.indexOf(partido) == -1) {
            //Se o elemento não está na lista de partidos clicados, é porque ele acabou de ser clicado e o gráfico precisa ser gerado.
                partidos_clicados.push(partido);
                hist_draw_line(partido);
                hist_draw_legend(partido,"");
            }
        } else {
        //Se o elemento não possui a classe 'click' é porque ele está desselecionado e
            if (partidos_clicados.indexOf(partido) > -1) {
            //Se o elemento estiver na lista de partidos_clicados, ele precisa ser removido, assim como seu gráfico.
                partidos_clicados.splice(partidos_clicados.indexOf(partido), 1) // remove o elemento da lista
                $('.focus.'+partido).remove();
                $('.focus_text.'+partido).remove();
                $('#hist_part_'+partido).remove();
            }
        }
    }
}

function hist_first_draw(){
    //Desenha os eixos e o histórico geral, além do layer de mouseover

    var margin = {top: 11, right: 0, bottom: 42, left: 35},
        width = 715 - margin.left - margin.right,
        height = 505 - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%m-%y"));;

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line_container = d3.select("#svg_hist").append("g")
        .attr("id","linhas_historico")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on("click", esconder_janela_historico);

    //Pegando dados referentes ao histórico geral do mandato atual
    var data = window.histData["Geral"]; //TODO: Incrementar com "casa" e "mandato"

    data.sort(function(a, b) {
        return a.date - b.date;
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0,100]);

    //Desenha eixos x e y
    var eixos = d3.select("#svg_hist").append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("id","hist_eixos")
            .on("click", esconder_janela_historico);

    eixos.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    eixos.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Governismo (%)");


    // Desenha "linha geral"
    var line = d3.svg.line()
        .defined(function(d){return d.valor >= 0; })
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.valor); });

    line_container = line_container.append("g")
        .attr("id","hist_Geral")
        .attr("class","hist_linha Geral");

    line_container.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    hist_draw_legend("Geral", "bla 123");

    //Desenha elemento de grupo que receberá os 'focus'
    d3.select("#svg_hist").append("g")
        .attr("id","hist_focus_group")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Desenha retângulo que dispara os eventos de focus no mouseover
    d3.select("#svg_hist").append("rect")
        .attr("class", "hist_overlay")
        .attr("id","hist_overlay")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $("#svg_hist").off("mousemove"); //Desabilita o default do mouseover

    var focus = d3.select("#hist_focus_group").append("g")
              .attr("class", "focus Geral")
              .attr("data-partido","Geral")
              .style("display", "none");

    focus.append("line")
        .attr("class", "x")
        .attr("y1", y(0) - 30)
        .attr("y2", y(0) + 6)
        .style("fill", "#fff")
        .style("stroke", "#fff");

    focus.append("line")
        .attr("class", "y")
        .attr("x1", width - 6)
        .attr("x2", width + 6)
        .style("fill", "#fff")
        .style("stroke", "#fff");

    focus.append("circle")
        .attr("class", "y")
        .attr("r", 4)
        .style("fill", "#fff")
        .style("stroke", "#fff");

    focus.append("text")
        .attr("class", "y")
        .attr("dy", "-1em");

    //var partido = $(this).data("partido");
    $("#hist_overlay")
        .on("mouseover", function() {
            d3.selectAll(".focus").style("display", null);
        })
        .on("mouseout", function() {
            d3.selectAll(".focus").style("display", "none");
        })
        .on("mousemove", function(el){
            var _x_pos = el.offsetX;

            $(".focus").each(function(){
                var partido = $(this).data("partido"),
                    data = d3.select(".hist_linha." + partido + " path").datum(),
                    x0 = x.invert(_x_pos - margin.left),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                var focus = d3.select(".focus." + partido);
                if (d.valor == undefined || d.valor == -1){
                    focus.style("display","none");
                    hist_legend_update(partido, " -- ");
                } else {
                    if ($(".focus." + partido).css("display") == "none") focus.style("display", null);
                    focus.select("circle.y").attr("transform", "translate(" + x(d.date) + "," + y(d.valor) + ")");
                    focus.select("text.y").attr("transform", "translate(" + x(d.date) + "," + y(d.valor) + ")").text(partido);// + ": " + focus_formatOutput(d));
                    focus.select(".x").attr("transform", "translate(" + x(d.date) + ",0)");
                    focus.select(".y").attr("transform", "translate(" + width * -1 + ", " + y(d.valor) + ")").attr("x2", width + x(d.date));
                    hist_legend_update(partido, d.valor + "%");
                    $('.data_considerada').html(focus_formatDate(d.date));
                }

            });
        });

}

function hist_draw_line(partido) {

    var margin = {top: 11, right: 0, bottom: 42, left: 35},
        width = 715 - margin.left - margin.right,
        height = 505 - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%m-%y"));;

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line_container = d3.select("#linhas_historico")

    var data = window.histData[partido];

    data.sort(function(a, b) {
        return a.date - b.date;
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0,100]);

    var line = d3.svg.line()
        .defined(function(d){ return d.valor >= 0; })
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.valor); });

    line_container = line_container.append("g")
        .attr("id","hist_part_" + partido)
        .attr("class","hist_linha " + partido);

    line_container.append("path")
        .datum(data)
        .attr("class", "line " + partido)
        .attr("d", line)
        .style("stroke", cores[partido]);

    var focus = d3.select("#hist_focus_group").append("g")
              .attr("class", "focus " + partido)
              .attr("data-partido", partido)
              .style("display", "none");

    focus.append("line")
        .attr("class", "x")
        .attr("y1", y(0) - 6)
        .attr("y2", y(0) + 6)
        .style("fill", "#fff")
        .style("stroke", "#fff");

    focus.append("line")
        .attr("class", "y")
        .attr("x1", width - 6)
        .attr("x2", width + 6)
        .style("fill", "#fff")
        .style("stroke", "#fff");

    focus.append("circle")
        .attr("class", "y")
        .attr("r", 4)
        .style("fill", "#fff")
        .style("stroke", "#fff");

    focus.append("text")
        .attr("class", "y")
        .attr("dy", "-1em");

 }

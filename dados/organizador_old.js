var vot = [4527,4536,4535,4537,4542,4538,4546,4574,4581,4590,4588,4598,4589,4608,4615,4626,4629,4642,4640,4653,4648,4662,4664,4661,4674,4680,4681,4685,4690,4695,4692,4693,4694,4701,4698,4712,4713,4710,4719,4720,4725,4723,4728,4726,4727,4730,4740,4743,4754,4757,4769,4772,4778,4787,4798,4796,4793,4802,4808,4810,4815,4805,4809,4814,4807,4811,4812,4806,4804,4823,4819,4826,4829,4825,4827,4830,4824,4831,4835,4839,4841,4854,4870,4884,4875,4883,4898,4899,4905,4922,4926,4925,4942,4941,4953];
var partidos = ["PSOL","PCdoB","PT","PSB","PDT","PMDB","PSL","PRP","PTC","PTdoB","PR","PV","PRTB","PRB","PP","PSC","PMN","PHS","PTB","PPS","PSDB","DEM","PSD","S.Part."];		  

var dps = [];
var tip = ["SIM","NAO","ABSTENCAO","OBSTRUCAO","NAO VOTOU","PRESIDENTE"];
var vts = [];

var deputado = [];

function main(){
	//Carrega as votações dos dbfs, já convertidos em um único txt
	jQuery.get('dbf_camara.txt', function(dados) {
		console.log(dados)
		dados = dados.split('\n');
		var string = '';
		for (var i=0; i<dados.length; i++){
			dados[i] = dados[i].split('\t');
			
			//cria array com os nomes dos deputados e os estados
			if (dps.indexOf(dados[i][1]) == -1){
				dps.push(dados[i][1]);
				deputado.push([dados[i][1],dados[i][4]]);
			}
			
			//indexa os tipos de voto
			if (tip.indexOf(dados[i][2]) == -1){
				dados[i][2] = 'null';
			} else {
				dados[i][2] = tip.indexOf(dados[i][2]);
			}
			
			//indexa os partidos
			if (partidos.indexOf(dados[i][3]) == -1){
				dados[i][3] = 'null';
			} else {
				dados[i][3] = partidos.indexOf(dados[i][3]);
			}
		}
		
		//Arranja deputados
		dps.sort();
		deputado.sort();
		
		for (var i=0; i<deputado.length; i++){
			dps[i] = deputado[i][0];
			//string += '["'+deputado[i][0]+'","'+deputado[i][1]+'"],<br>';
		}
		
		//Cria as votações em arrays
		for (var i=0; i<vot.length; i++){
			vts[i] = [];
		}
		
		for (var i=0; i<dados.length; i++){
			//Index a votação
			dados[i][0] = vot.indexOf(Number(dados[i][0]));
		
			//indexa o nome dos deputados
			dados[i][1] = dps.indexOf(dados[i][1]);

			//Insere os dados na array dos votos
			vts[dados[i][0]].push([dados[i][3],dados[i][1],dados[i][2]]);
			
			//ordem dos votos é
			//0 - partido
			//1 - deputado
			//2 - voto
		}
		
		for (var i=0; i<vts.length; i++){
			vts[i].sort(sortfunc);
			string += '['
			for (var j=0; j<vts[i].length; j++){
				string += '['+vts[i][j][0]+','+vts[i][j][1]+','+vts[i][j][2]+'],'
			}
			string += '],<br />'
		}
		
		//Escreve no HTML
		$('#corpo').append(string);	
	});
}

function sortfunc(a,b) {
	if (a[0] != b[0]){
		return a[0] - b[0];
	} else {
		return a[1] - b[1];
	}
}

$(document).ready(main);
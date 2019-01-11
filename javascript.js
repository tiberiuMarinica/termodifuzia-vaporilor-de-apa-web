$(document).ready(function () {
	
	$("#adaugaStratButton").click(function(){
		
		var nrStraturi = $("#nrStraturi").val();
		console.log(nrStraturi);
		
		$("#containerStraturi").html("");
		
		for(var i = 0; i < nrStraturi; i++){
			
			var index = i + 1;
			
			$("#containerStraturi").append('<hr class="mb-4"></hr> <h5 class="mb-3" id="numeStrat">Stratul '+ index + '</h5> <div class="row"> <div class="col-md-4 mb-3"> <label for="grosimeStrat'+index+'">Grosime</label> <div class="input-group"> <input type="text" class="form-control" id="grosimeStrat'+index+'" placeholder="" value="" required="true"/> <div class="input-group-append"> <span class="input-group-text">cm</span> </div> <div class="invalid-feedback"> Acest camp este obligatoriu. </div> </div> </div> <div class="col-md-4 mb-3"> <label for="lambda'+index+'">Conductivitatea termica (&#955;)</label> <div class="input-group"> <input type="text" class="form-control" id="lambda'+index+'" placeholder="" value="" required="true"/> <div class="input-group-append"> <span class="input-group-text">W/mK</span> </div> <div class="invalid-feedback"> Acest camp este obligatoriu. </div> </div> </div> <div class="col-md-4 mb-3"> <label for="miu'+index+'">&#956;</label> <input type="text" class="form-control" id="miu'+index+'" placeholder="" value="" required="true"/> <div class="invalid-feedback"> Acest camp este obligatoriu. </div> </div> </div>');
		}
		
		
	});
	
	

	$('#genereazaGrafic').click(function() {
		
		var formDTO = {};
		
		//find nrStraturi
		var nrStraturi = 0;
		$("#form :input").each(function(){
			var input = $(this); // This is the jquery object of the input, do what you will
			
			var id = input.attr("id");
			if(id == "nrStraturi"){
				nrStraturi = input.val();
			}
			
		});
		
		var error = false;
		
		if(nrStraturi == 0){
			showAlert("");
			return;
		}else{
			hideAlert();
		}
		
		$("#form :input").each(function(){
			var input = $(this); // This is the jquery object of the input, do what you will
			
			var id = input.attr("id");
			var value = input.val();
			
			if(input.attr("type")!="button"){
				
				if(id.startsWith("grosimeStrat") || id.startsWith("lambda") || id.startsWith("miu")){
					
					if(isNaN(value) || value === ""){
						console.log(id+" is not a number");
						error = true;
						return;
					}
					
				}else{
					
					if(isNaN(value) || value === ""){
						console.log(id+" is not a number");
						error = true;
						return;
					}
					
					if(id === "phiInt" || id ==="phiExt"){
						value = value / 100;
					}
					
					formDTO[id] = value;
					
				}
			
			}
		});
		
		if(error){
			showAlert("");
			return;
		}else{
			hideAlert();
		}
		
		formDTO.straturi = [];
		for(var i = 0; i < nrStraturi; i++){
			
			var index = i+1;
			
			var strat = {};
			strat.d = ($("#grosimeStrat"+index).val()) / 100;
			strat.lambda = $("#lambda"+index).val();
			strat.miu = $("#miu"+index).val();
			
			formDTO.straturi.push(strat);

		}
			
		console.log(formDTO);
		console.log(JSON.stringify(formDTO));
		var data = JSON.stringify(formDTO);
		data = btoa(data);
		

		$.ajax("http://localhost:8080/grafic/create/"+data, {
			
			
			async: true,
			//dataType: 'json',
			type: 'GET',
			
			
			success: function(data, textStatus){
				afiseazaDateIesire(data);
			},
			
			error: function(xhr, ajaxOptions, thrownError){
				console.log(thrownError);
			}
			
		});
		
	});
	
});

function showAlert(message){
	$("#alert").show();
}

function hideAlert(message){
	$("#alert").hide();
}

function afiseazaDateIesire(data){
	
	console.log(data);
	
	$("#dateIesire").html("");
	
	var pi = data.Pi;
	var pe = data.Pe;
	var psThetaSe = data.PsThetaSe;
	var psThetaSi = data.PsThetaSi;
	var thetaSE = data.thetaSE;
	var thetaSI = data.thetaSI;
	
	adaugaLaDateDeIesire("Pi", pi, "Pa"); 
	adaugaLaDateDeIesire("Pe", pe, "Pa"); 
	adaugaLaDateDeIesire("PsThetaSe", psThetaSe, "Pa"); 
	adaugaLaDateDeIesire("PsThetaSi", psThetaSi, "Pa"); 
	adaugaLaDateDeIesire("ThetaSe", thetaSE, "&#8451;"); 
	adaugaLaDateDeIesire("ThetaSi", thetaSI, "&#8451;"); 
	
	var straturi = data.straturi;
	for(var i = 0; i < straturi.length - 1; i++){
		
		var strat = straturi[i];
		
		$("#dateIesire").append('<li class="list-group-item d-flex justify-content-between lh-condensed"><div><h6 class="my-0">'+"Strat "+(i+1)+'</h6></div><span>'+"P="+trimTo2Digits(strat.P)+' Pa, &theta;='+ trimTo2Digits(strat.theta)+' &#8451;, Ps='+ trimTo2Digits(strat.PsTheta)+' Pa</span></li>');
		
	}
	
	var grafic = data.graficBase64;
	var height = data.inaltimeGrafic;
	var width = data.latimeGrafic;
	
	$("#grafic").append('<img id="itemPreview" src="" />');
	$("#itemPreview").attr('src', `data:image/png;base64,${grafic}`);
	$("#itemPreview").attr('height', height);
	$("#itemPreview").attr('width', width);
	
}

function trimTo2Digits(number){
	return parseFloat(Math.round(number * 100) / 100).toFixed(2);
}

function adaugaLaDateDeIesire(cheie, valoare, unitateDeMasura){
	
	$("#dateIesire").append('<li class="list-group-item d-flex justify-content-between lh-condensed"><div><h6 class="my-0">'+cheie+'</h6></div><span>'+trimTo2Digits(valoare)+' '+unitateDeMasura+'</span></li>');
	
}

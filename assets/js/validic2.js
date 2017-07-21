


	//Variables to hold data
	var mySteps = "";
	var myActiveTime = "";
	var myDistance = "";
	var myCalories = "";
	var myWeight = "";
	var myWeightUnit = "";

    //Determine the Date 
    var date_today = new Date();

    //Get Parameter Values from Query String 
    var getQueryString = function ( field, url ) {
        var href = url ? url : window.location.href;
        var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        var string = reg.exec(href);
        return string ? string[1] : null;
    };

	//Get the Account from the Query String Parameter
	var account = getQueryString('account');
	var validicrequestcreds = "";
	var validicorganizationid
	switch(account) {
    case "demo":
        validicrequestcreds = "?token=e8db5d7a069743509c613254e59235cf";
        validicorganizationid = "5953eb328a5da50001379e4e";
        break;
    case "other":
		var parametertoken = getQueryString('token');
        var parameterorgid = getQueryString('orgid');
        validicrequestcreds = "?token=" + parametertoken;
        validicorganizationid = paramterorgid;
        break;
    case "devpreview":
    case "dev":
	default:
		//assume Dev Preview 
       validicrequestcreds = "?token=e8db5d7a069743509c613254e59235cf";
       validicorganizationid = "5953eb328a5da50001379e4e";
}
 

    

    //Get the User from the Query String Parameter
    var user = getQueryString('user');
    if (user == null) {
			alert("I don't know you.  Please add ?user=FirstLast.");

    } 

    //Get the Date from the Query String Parameter
    var querydate = getQueryString('date');
	
    if (querydate == null) {
    		var d = new Date();
    		var queryyear = d.getFullYear()
    		var querymonth = ("0" + (d.getMonth() + 1)).slice(-2);
    		var queryday = ("0" + d.getDate()).slice(-2);
    		querydate = [queryyear,querymonth,queryday].join('-');
    	}
	document.getElementById("headerdate").innerHTML = querydate;
	document.getElementById("subheading").innerHTML = user;
	
    //setup query 
    	var validicrequestbase = "https://api.v2.validic.com/organizations/" + validicorganizationid +"/users/";
    	var validicrequestuser = user;
  		var validicrequestdate = "&date=" + querydate;



function GetSummaryData() {

		var validicsummaryrequest = validicrequestbase + validicrequestuser + "/summaries" + validicrequestcreds + validicrequestdate;
		console.log(validicsummaryrequest);


	//Get Summary Data
		$.get( validicsummaryrequest, function( data ) {
		console.log("summary data retrieved with " + data.data.length+ " records");		
		
				if(data.data[0]){
					donkey = data.data[0].metrics;
					console.log(donkey.length);

					function getValuebyType(type) {
					  return donkey.filter(
					      function(donkey){ return donkey.type == type }
					  );
					}
						
						var objSteps = getValuebyType('steps');
						var objDistance = getValuebyType('distance');
						var objActiveTime = getValuebyType('active_duration');
						var objBMR = getValuebyType('basal_energy_burned');
						var objenergy = getValuebyType('energy_burned');

						mySteps = objSteps[0].value;
						if(objActiveTime[0]) {
							switch(objActiveTime[0].unit) {
								case "s":
								myActiveTime = Math.round(objActiveTime[0].value / 60);
								break
							}
						}
						
						
						
						myDistance = objDistance[0].value;
						switch (objDistance[0].unit) {
							case "km":
								myDistance=Math.round(myDistance*0.621371*10)/10;
								break;
							case "m":
								myDistance=Math.round(myDistance*0.000621371*10)/10;
								break;
						}
					
						if(objBMR[0] && objenergy[0]) {
							myCaloriesBurned = Math.round(objBMR[0].value + objenergy[0].value);
						}
						else {
							myCaloriesBurned = 0;
						};
						

						//write results
						document.getElementById("article1text").innerHTML = mySteps + " steps";
						document.getElementById("article1content").innerHTML = "That's " + myDistance + " miles!" + "<br/>with " + myCaloriesBurned + " calories burned.";

						if(myActiveTime) {
							document.getElementById("article2text").innerHTML = myActiveTime + " active minutes";
						};
				}
				
for (var record=0, quantity=data.data.length; record<quantity; record++){
	console.log("record = " + record + " and quantity = "+quantity);

			$('#summarydata').append(data.data[record].source.type);
			var newtablehtml = "<table id='summarytable"+record+"'><tr><th>Type</th><th>Value</th><th>Unit</th></tr></table>";
			
			$('#summarydata').append(newtablehtml);
			//Begin Table RowCreation			
			var r = new Array(), j = -1;				
			console.log(data.data[record].metrics.length);	
			for (var key=0, size=data.data[record].metrics.length; key<size; key++){
				r[++j] ='<tr><td>';
				r[++j] = data.data[record].metrics[key].type;
				r[++j] = '</td><td>';
				r[++j] = data.data[record].metrics[key].value;
				r[++j] = '</td><td>';
				r[++j] = data.data[record].metrics[key].unit;
				r[++j] = '</td></tr>';
			}

			$('#summarytable'+record).html(r.join(''));


			//End Table Creation

				
			}
		}, "json" );

} 	


function GetWeightData() {
	//Get Weight Data
	var validicweightrequest = validicrequestbase + validicrequestuser + "/measurements" + validicrequestcreds + validicrequestdate;
	
		$.get( validicweightrequest, function( data ) {
				console.log(data);
				console.log ("research start")

				console.log ("research end")

				if (data.data["0"]) {
					weightdonkey = data.data["0"].metrics;
				
					function getValuebyType(type) {
					  return weightdonkey.filter(
					      function(weightdonkey){ return weightdonkey.type == type }
					  );
					}

					var objWeight = getValuebyType('body_weight');
					var objBodyFat = getValuebyType('body_fat');

					if (objWeight[0]) {
							myWeight = Math.round(objWeight[0].value * 2.20462262*10)/10;
							document.getElementById("article3text").innerHTML = myWeight + " lbs";
					}
					if (objBodyFat[0]) {
							myBodyFat = Math.round(objBodyFat[0].value * 10)/10;
							document.getElementById("article3content").innerHTML = "You are " + myBodyFat + "% Phat!";
					}
					}
						
for (var record=0, quantity=data.data.length; record<quantity; record++){
	console.log("Weight record = " + record + " and quantity = "+quantity);

			$('#measurementsdata').append(data.data[record].source.type);
			var newtablehtml = "<table id='measurementstable"+record+"'><tr><th>Type</th><th>Value</th><th>Unit</th></tr></table>";
			
			$('#measurementsdata').append(newtablehtml);
			//Begin Table RowCreation			
			var r = new Array(), j = -1;				
			console.log("measurements metrics = "+ data.data[record].metrics.length);	
			for (var key=0, size=data.data[record].metrics.length; key<size; key++){



				r[++j] ='<tr><td>';
				r[++j] = data.data[record].metrics[key].type;
				r[++j] = '</td><td>';
				r[++j] = data.data[record].metrics[key].value;
				r[++j] = '</td><td>';
				r[++j] = data.data[record].metrics[key].unit;
				r[++j] = '</td></tr>';
			}

			$('#measurementstable'+record).html(r.join(''));


			//End Table Creation

	}

		}, "json" );
}


function GetWorkoutsData() {
	//Get Workouts Data
	var validicworkoutrequest = validicrequestbase + validicrequestuser + "/workouts" + validicrequestcreds + validicrequestdate;

		$.get( validicworkoutrequest, function( data ) {
				console.log(data);
				if (data.data["0"]) {
				wdonkey = data.data["0"].metrics;

					function getValuebyType(type) {
					  return wdonkey.filter(
					      function(wdonkey){ return wdonkey.type == type }
					  );
					}

					// Determine Workout Duration
					// subtract start from end time to get duration.
					// convert from ms to minutes

					var workout_start_time = new Date(data.data["0"].start_time);
					var workout_end_time = new Date(data.data["0"].end_time);
					var workout_duration = Math.floor((workout_end_time-workout_start_time) / 60e3);
					document.getElementById("article4text").innerHTML = workout_duration + " Minutes of Exercise";
					



					var objDuration = getValuebyType('active_duration');
					if(objDuration[0]) {
						
						myDuration = objDuration[0].value;
						switch (objDuration[0].unit) {
							case "ms":
								myDuration=myDuration/1000/60;
								break;
							case "s":
								myDuration=myDuration/60;
								break;
						}
						myDuration = Math.round(myDuration*10)/10
						console.log(myDuration);
						document.getElementById("article2text").innerHTML = myDuration + " Active Minutes Today";
						
						
					}

for (var record=0, quantity=data.data.length; record<quantity; record++){
	console.log("record = " + record + " and quantity = "+quantity);

			$('#workoutsdata').append(data.data[record].source.type);
			var newtablehtml = "<table id='workoutstable"+record+"'><tr><th>Type</th><th>Value</th><th>Unit</th></tr></table>";
			
			$('#workoutsdata').append(newtablehtml);
			//Begin Table RowCreation			
			var r = new Array(), j = -1;				
			console.log(data.data[record].metrics.length);	
			for (var key=0, size=data.data[record].metrics.length; key<size; key++){
				r[++j] ='<tr><td>';
				r[++j] = data.data[record].metrics[key].type;
				r[++j] = '</td><td>';
				r[++j] = data.data[record].metrics[key].value;
				r[++j] = '</td><td>';
				r[++j] = data.data[record].metrics[key].unit;
				r[++j] = '</td></tr>';
			}

			$('#workoutstable'+record).html(r.join(''));


			//End Table Creation

	}
			}
		}, "json" );
}


function GetSleepData() {
	//Get Sleep Data
	var validicsleeprequest = validicrequestbase + validicrequestuser + "/sleep" + validicrequestcreds + validicrequestdate;

		$.get( validicsleeprequest, function( data ) {
				console.log("Sleep");
				console.log(data);
				if (data.data["0"]) {
					sdonkey = data.data["0"].metrics;			
					function getValuebyType(type) {
					  return sdonkey.filter(
					      function(sdonkey){ return sdonkey.type == type }
					  );
					}

					var objSleep = getValuebyType('time_to_fall_asleep');
					var objREM = getValuebyType('rem_sleep');
					var objDeep = getValuebyType('deep_sleep');
					var objLight = getValuebyType('light_sleep');
					var objSleepDuration = getValuebyType('asleep_duration'); 
					
					//if sleep duration was not provided, add up other sleep values to get a total.
					var SleepDuration = 0;
					if (objSleepDuration[0]) {
						SleepDuration = objSleepDuration[0];
						console.log("Directly Retrieved Sleep Duration: " + SleepDuration);
					}
					else {
						if (objREM[0]) {
							SleepDuration = SleepDuration + Number(objREM[0].value); 
							console.log("REM is " + Number(objREM[0].value));
						}
						if (objDeep[0]) {
							SleepDuration = SleepDuration + Number(objDeep[0].value);
							console.log("Deep Sleep is " + Number(objDeep[0].value));
						}
						if (objLight[0]) {
							SleepDuration = SleepDuration + Number(objLight[0].value);
							console.log("Light Sleep is " + objLight[0].value);
						}
					};
					
					SleepDuration = SleepDuration / 3600;
					console.log("Sleep Duration: " + SleepDuration);
					document.getElementById("article5text").innerHTML = "You slept for  " + SleepDuration + " hours";

					if (objSleep[0]) {
						myTimeToSleep = objSleep[0].value / 60;
						console.log("MyTimeToSleep: " + myTimeToSleep);

						
						
						
						//document.getElementById("article5text").innerHTML = "It took you " + myTimeToSleep + " minutes to fall asleep";
					}

for (var record=0, quantity=data.data.length; record<quantity; record++){
	console.log("Sleep record = " + record + " and quantity = "+quantity);

			$('#sleepdata').append(data.data[record].source.type);
			var newtablehtml = "<table id='sleeptable"+record+"'><tr><th>Type</th><th>Value</th><th>Unit</th></tr></table>";
			
			$('#sleepdata').append(newtablehtml);
			//Begin Table RowCreation			
			var r = new Array(), j = -1;				
			console.log("sleep metrics = "+ data.data[record].metrics.length);	
			for (var key=0, size=data.data[record].metrics.length; key<size; key++){
				r[++j] ='<tr><td>';
				r[++j] = data.data[record].metrics[key].type;
				r[++j] = '</td><td>';
				r[++j] = data.data[record].metrics[key].value;
				r[++j] = '</td><td>';
				r[++j] = data.data[record].metrics[key].unit;
				r[++j] = '</td></tr>';
			}

			$('#sleeptable'+record).html(r.join(''));


			//End Table Creation

	}
			}
		}, "json" );

}


function GetNutritionyData() {
	//Get Nutrition Data
	var validicnutritionrequest = validicrequestbase + validicrequestuser + "/nutrition" + validicrequestcreds + validicrequestdate;

		$.get( validicnutritionrequest, function( data ) {

				console.log("Starting Nutrition");
				if (data.data["0"]) {
					nutritiondonkey = data.data["0"].metrics;
				
					function getValuebyType(type) {
					  return nutritiondonkey.filter(
					      function(nutritiondonkey){ return nutritiondonkey.type == type }
					  );
					}

					var objCalories = getValuebyType('energy_consumed');
					var objProtein = getValuebyType('protein');
					var objFat = getValuebyType('fat');

					if (objCalories[0]) {
							document.getElementById("article6text").innerHTML = objCalories[0].value + " Calores Eaten";
					}
					if (objFat[0]) {
							document.getElementById("article6content").innerHTML = objFat[0].value + "g Fat and " + objProtein[0].value + "g Protein";
					}
					}

									
				for (var record=0, quantity=data.data.length; record<quantity; record++){
					if (data.data[record]) {
						
						ndonkey = data.data[record].metrics;
						console.log("Nutrition record " + record + " has " + ndonkey.length + " metrics");


	
						function getValuebyType(type) {
						return ndonkey.filter(
							function(ndonkey){ return ndonkey.type == type }
						);
						}

						$('#nutritiondata').append(data.data[record].source.type);
						var newtablehtml = "<table id='nutritiontable"+record+"'><tr><th>Type</th><th>Value</th><th>Unit</th></tr></table>";
						
						$('#nutritiondata').append(newtablehtml);
						//Begin Nutrition Table RowCreation			
						var r = new Array(), j = -1;					
						for (var key=0, size=ndonkey.length; key<size; key++){
							r[++j] ='<tr><td>';
							r[++j] = data.data[record].metrics[key].type;
							r[++j] = '</td><td>';
							r[++j] = data.data[record].metrics[key].value;
							r[++j] = '</td><td>';
							r[++j] = data.data[record].metrics[key].unit;
							r[++j] = '</td></tr>';
						}

						$('#nutritiontable'+record).html(r.join(''));

						//End Table Creation


						}


				} //iterating through records
				
		}, "json" );


}

GetSummaryData();
GetWeightData();
GetNutritionyData();
GetSleepData();
GetWorkoutsData();

//set page links
function detailnavigate(type) {
	window.location.href = "details.html?type="+type+"&user="+user+validicrequestdate;
}



//end file




	//Variables to hold data
	var mySteps = "";
	var myActiveTime = "";
	var myDistance = "";
	var myCalories = "";
	var myWeight = "";

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
	switch(account) {
    case engineering:
	case eng:
        validicrequestcreds = "?token=1533597acc3945fea2256569db36bc03";
        break;
    case other:
		var parametertoken = getQueryString('token');
        validicrequestcreds = "?token=" + parametertoken;
        break;
    case challenge:
	default:
		//assume Validic Challenge app
       validicrequestcreds = "?token=abeed1ffe4f14f3fb7d9bcb4928c72b4";
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
    	var validicrequestbase = "https://api2.stage.validic.com/users/";
    	var validicrequestuser = user;
  		var validicrequestdate = "&date=" + querydate;
		var validicsummaryrequest = validicrequestbase + validicrequestuser + "/summaries" + validicrequestcreds + validicrequestdate;


	//Get Summary Data
		$.get( validicsummaryrequest, function( data ) {
				if (data.data[0]) {
					console.log(data.data["0"].metrics);
					donkey = data.data["0"].metrics;

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
					myActiveTime = Math.round(objActiveTime[0].value / 60);
					myDistance = objDistance[0].value;
					switch (objDistance[0].unit) {
					    case "km":
					        myDistance=Math.round(myDistance*0.621371*10)/10;
					        break;
					    case "m":
					        myDistance=Math.round(myDistance*0.000621371*10)/10;
					        break;
					}



					myCaloriesBurned = Math.round(objBMR[0].value + objenergy[0].value);

					document.getElementById("article1text").innerHTML = mySteps + " steps";
					document.getElementById("article1content").innerHTML = "That's " + myDistance + " miles!" + "<br/>with " + myCaloriesBurned + " calories burned.";

				if(myActiveTime) {
					document.getElementById("article2text").innerHTML = myActiveTime + " active minutes";
				};

//Begin Summary Table Creation			
var r = new Array(), j = -1;
 								
 r[++j] ='<tr><th>Type</th><th>Value</th><th>Unit</th></tr>';
 for (var key=0, size=donkey.length; key<size; key++){
     r[++j] ='<tr><td>';
     r[++j] = donkey[key].type;
     r[++j] = '</td><td class="whatever1">';
     r[++j] = donkey[key].value;
     r[++j] = '</td><td class="whatever2">';
     r[++j] = donkey[key].unit;
     r[++j] = '</td></tr>';
 }

 $('#summarydataTable').html(r.join(''));

//End Table Creation


				
			}
		}, "json" );

 	

	//Get Weight Data
	var validicweightrequest = validicrequestbase + validicrequestuser + "/measurements" + validicrequestcreds + validicrequestdate;

		$.get( validicweightrequest, function( data ) {
				console.log(data);
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
		}, "json" );


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

					var objDuration = getValuebyType('active_duration');
					console.log("Duration object");
					console.log(objDuration);
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
					document.getElementById("article4text").innerHTML = myDuration + " Minutes";


//Begin Workouts Table Creation			
var r = new Array(), j = -1;
 								
 r[++j] ='<tr><th>Type</th><th>Value</th><th>Unit</th></tr>';
 for (var key=0, size=weightdonkey.length; key<size; key++){
     r[++j] ='<tr><td>';
     r[++j] = weightdonkey[key].type;
     r[++j] = '</td><td class="whatever1">';
     r[++j] = weightdonkey[key].value;
     r[++j] = '</td><td class="whatever2">';
     r[++j] = weightdonkey[key].unit;
     r[++j] = '</td></tr>';
 }

 $('#workoutsdataTable').html(r.join(''));

//End Table Creation


				}
		}, "json" );


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

//Begin Sleep Table Creation			
var r = new Array(), j = -1;
 								
 r[++j] ='<tr><th>Type</th><th>Value</th><th>Unit</th></tr>';
 for (var key=0, size=sdonkey.length; key<size; key++){
     r[++j] ='<tr><td>';
     r[++j] = sdonkey[key].type;
     r[++j] = '</td><td class="whatever1">';
     r[++j] = sdonkey[key].value;
     r[++j] = '</td><td class="whatever2">';
     r[++j] = sdonkey[key].unit;
     r[++j] = '</td></tr>';
 }

 $('#sleepdataTable').html(r.join(''));

//End Table Creation


				}
				
		}, "json" );


	//Get Nutrition Data
	var validicnutritionrequest = validicrequestbase + validicrequestuser + "/nutrition" + validicrequestcreds + validicrequestdate;

		$.get( validicnutritionrequest, function( data ) {
				console.log("Nutrition");
				console.log(data);
				if (data.data["0"]) {
					ndonkey = data.data["0"].metrics;			
					function getValuebyType(type) {
					  return ndonkey.filter(
					      function(ndonkey){ return ndonkey.type == type }
					  );
					}

					//var objSleep = getValuebyType('time_to_fall_asleep');
					//var objREM = getValuebyType('rem_sleep');
					//var objDeep = getValuebyType('deep_sleep');
					//var objLight = getValuebyType('light_sleep');
					//var objSleepDuration = getValuebyType('asleep_duration'); 
					

						
						//document.getElementById("article5text").innerHTML = "It took you " + myTimeToSleep + " minutes to fall asleep";
					}

//Begin Nutrition Table Creation			
var r = new Array(), j = -1;
 								
 r[++j] ='<tr><th>Type</th><th>Value</th><th>Unit</th></tr>';
 for (var key=0, size=ndonkey.length; key<size; key++){
     r[++j] ='<tr><td>';
     r[++j] = ndonkey[key].type;
     r[++j] = '</td><td class="whatever1">';
     r[++j] = ndonkey[key].value;
     r[++j] = '</td><td class="whatever2">';
     r[++j] = ndonkey[key].unit;
     r[++j] = '</td></tr>';
 }

 $('#nutritiondataTable').html(r.join(''));

//End Table Creation
				
		}, "json" );







//set page links
function detailnavigate(type) {
	window.location.href = "details.html?type="+type+"&user="+user+validicrequestdate;
}
//end file

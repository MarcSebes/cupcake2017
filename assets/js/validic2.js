


//Variables to hold data
	var mySteps = "";
	var myActiveTime = "";
	var myDistance = "";
	var myCalories = "";
	var myWeight = "";

    //Get Parameter Values from Query String 
    var getQueryString = function ( field, url ) {
        var href = url ? url : window.location.href;
        var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        var string = reg.exec(href);
        return string ? string[1] : null;
    };


    //Determine the Date 
    var date_today = new Date();
    //var  = formatLocalDate("start");
    //var request_end_date = formatLocalDate("end");


    

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
    console.log("Query Date Parameter: " + querydate )	
    //setup query 
    	var validicrequestbase = "https://api2.stage.validic.com/users/";
    	var validicrequestuser = user;
  		var validicrequestdate = "&date=" + querydate;
    	var validicrequestcreds = "?token=abeed1ffe4f14f3fb7d9bcb4928c72b4";
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
			}
		}, "json" );

 	

	//Get Weight Data
	var validicweightrequest = validicrequestbase + validicrequestuser + "/measurements" + validicrequestcreds + validicrequestdate;

		$.get( validicweightrequest, function( data ) {
				console.log(data);
				if (data.data["0"]) {
					donkey = data.data["0"].metrics;
				
					function getValuebyType(type) {
					  return donkey.filter(
					      function(donkey){ return donkey.type == type }
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
				donkey = data.data["0"].metrics;

					function getValuebyType(type) {
					  return donkey.filter(
					      function(donkey){ return donkey.type == type }
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
				}
		}, "json" );


	//Get Sleep Data
	var validicsleeprequest = validicrequestbase + validicrequestuser + "/sleep" + validicrequestcreds + validicrequestdate;

		$.get( validicsleeprequest, function( data ) {
				console.log("Sleep");
				console.log(data);
				if (data.data["0"]) {
					donkey = data.data["0"].metrics;			
					function getValuebyType(type) {
					  return donkey.filter(
					      function(donkey){ return donkey.type == type }
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
				}
				
		}, "json" );



//set page links
function detailnavigate(type) {
	window.location.href = "details.html?type="+type+"&user="+user+validicrequestdate;
}
//hi marc
//good work
//update bitch

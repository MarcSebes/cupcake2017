


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


    //Timzone offset function
    function formatLocalDate(start) {
    var now = new Date(),
        tzo = -now.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };



    switch(start){
    	case "start":
		    return now.getFullYear() 
		        + '-' + pad(now.getMonth()+1)
		        + '-' + pad(now.getDate())
		        + 'T' + pad("00")
		        + ':' + pad("00") 
		        + ':' + pad("00") 
		        + dif + pad(tzo / 60) 
		        + ':' + pad(tzo % 60);
	        break;
        case "end":
			return now.getFullYear() 
		        + '-' + pad(now.getMonth()+1)
		        + '-' + pad(now.getDate())
		        + 'T' + pad("23")
		        + ':' + pad("59") 
		        + ':' + pad("59") 
		        + dif + pad(tzo / 60) 
		        + ':' + pad(tzo % 60);    
	        break;   	
        default:
			 return now.getFullYear() 
		        + '-' + pad(now.getMonth()+1)
		        + '-' + pad(now.getDate())
				+ 'T' + pad(now.getHours())
		        + ':' + pad(now.getMinutes()) 
		        + ':' + pad(now.getSeconds()) 
		        + dif + pad(tzo / 60) 
		        + ':' + pad(tzo % 60);  
	    }

}

    //Determine the Date 
    var date_today = new Date();
    var request_start_date = formatLocalDate("start");
    var request_end_date = formatLocalDate("end");


    

    //Get the User from the Query String Parameter
    var authentication_token = getQueryString('authentication_token');
    if (authentication_token == null) {
			alert("I don't know you.  Please provide an authentication_token in the header.");

    } 

    //Construct the Validic Request URLs
    var validicrequestbase = "https://api.validic.com/v1/";
    var validicrequestuser = "authentication_token=" + authentication_token;
    var validicrequestparams = "&expanded=1&dashboard=1&start_date="+request_start_date+"&end_date="+request_end_date;  
    
    var validicroutinerequest = validicrequestbase + "routine.json?" + validicrequestuser + validicrequestparams;
    var validicweightrequest = validicrequestbase + "weight.json?" + validicrequestuser + validicrequestparams;
    var validicfitnessrequest = validicrequestbase + "fitness.json?" + validicrequestuser + validicrequestparams;
    var validicsleeprequest=  validicrequestbase + "sleep.json?" + validicrequestuser + validicrequestparams;
    var validicnutritionrequest = validicrequestbase + "nutrition.json?" + validicrequestuser + validicrequestparams;
    var validicbiometricsrequest = validicrequestbase + "biometrics.json?" + validicrequestuser + validicrequestparams;
    console.log(validicroutinerequest);
    //Make the Routine Request via jQuery
		$.get( validicroutinerequest, function( data ) {
		console.log(data);

		mySteps = data.routine[0].steps;
		if(data.routine[0].source = "fitbit") {
			myActiveTime = data.routine[0].minutes_fairly_active+data.routine[0].minutes_very_active;
		};
		myDistance = Math.round((data.routine[0].distance * 0.00062137)*10)/10;
		myCaloriesBurned = data.routine[0].calories_burned;


		document.getElementById("article1text").innerHTML = mySteps + " steps";
		document.getElementById("article1content").innerHTML = "That's " + myDistance + " miles!" + "<br/>with " + myCaloriesBurned + " calories burned.";

		if(myActiveTime) {
			document.getElementById("article2text").innerHTML = myActiveTime + " active minutes";
		};
		}, "json" );

 	//Make the Weight Request via jQuery
		$.get( validicweightrequest, function( data ) {
		console.log(data);
		if(data.weight[0]){
			var myWeight = Math.round((data.weight[0].weight/0.45359237)*10)/10;
			document.getElementById("article3text").innerHTML = myWeight + " lbs";
			if(data.weight[0].fat_percent){
			var myFatPercent = Math.round((data.weight[0].fat_percent)*10)/10;
			document.getElementById("article3content").innerHTML = "You are " + myFatPercent + "% fat";
		}
		else {
			document.getElementById("article3content").innerHTML = "You phat!";
		}
		};	

		}, "json" );

    //Make the Fitness Request via jQuery
		$.get( validicfitnessrequest, function( data ) {
				console.log(data);

		
		
		if(data.fitness[0]) {
			var myFitnessCategory = "";
			var myFitnessDuration = "";
			var myFitnessDistance = "";
			var myFitnessPace = "";
		

			//Determine Available Fields for Fitness Record
			
			if (data.fitness[0].activity_category == "unknown") {
				myFitnessCategory = data.fitness[0].type;
			}
			else{
				myFitnessCategory = data.fitness[0].activity_category;
			}; 
			
			if (data.fitness[0].duration) {
				myFitnessDuration = (data.fitness[0].duration)/60;
			}
			
			if (data.fitness[0].distance) {
				myFitnessDistance = Math.round((data.fitness[0].distance * 0.00062137)*10)/10;
			}

			if (myFitnessDuration && myFitnessDistance) {
				myFitnessPace = Math.round((myFitnessDistance / (myFitnessDuration/60)) * 10)/10;
			}

			//Set Fitness Message on Dashboard
			if (myFitnessPace) {
				document.getElementById("article4text").innerHTML = myFitnessCategory + " <br/> for " + myFitnessDuration + " minutes";
				document.getElementById("article4content").innerHTML =  myFitnessPace + " mph";
			}

			else {
				document.getElementById("article4text").innerHTML = myFitnessCategory;
				document.getElementById("article4content").innerHTML =  "via " + data.fitness[0].source_name;
			}

		}

		}, "json" );


	//Make the Sleep Request via jQuery
		$.get( validicsleeprequest, function( data ) {
				console.log(data);

		if(data.sleep[0]){
			var mySleepTime = Math.round((data.sleep[0].total_sleep/3600) * 10)/10;

			document.getElementById("article5text").innerHTML = mySleepTime + " hrs of sleep";
			document.getElementById("article5content").innerHTML =  "Goodnight!";
		}

		}, "json" );

	//Make the Vitals Request via jQuery
		$.get( validicbiometricsrequest, function( data ) {
				console.log(data);

		if(data.biometrics[0]){
			var mySystolic = data.biometrics[0].systolic;
			var myDiastolic = data.biometrics[0].diastolic;
			var myPulse = data.biometrics[0].resting_heartrate;

			//document.getElementById("article6text").innerHTML = mySystolic + "/" + myDiastolic;
			//document.getElementById("article6content").innerHTML =  myPulse + " bpm";
		}

		}, "json" );

	//Make the Nutrition Request via jQuery
		$.get( validicnutritionrequest, function( data ) {
				console.log(data);

		if(data.nutrition[0]){
			//1. Get all the nutrition records for today
			//2. Sum the calories, carbs, fat, and protein for the day
			//3. Display it

			//var NumberofElements = data.nutrition.length;
			var myTotalCalories = 0;
			var myTotalFat = 0;
			var myTotalProtein = 0;
			var myTotalCarbs = 0;
			var myTotalFiber = 0;
			$.each(data.nutrition, function(i) {
    			if(data.nutrition[i].calories) {
        			myTotalCalories = myTotalCalories + data.nutrition[i].calories;
    			}
    			if(data.nutrition[i].fat) {
        			myTotalFat = myTotalFat + data.nutrition[i].fat;
    			}
    			if(data.nutrition[i].protein) {
        			myTotalProtein = myTotalProtein + data.nutrition[i].protein;
    			}
    			if(data.nutrition[i].carbs) {
        			myTotalCarbs = myTotalCarbs + data.nutrition[i].carbs;
    			}
    			if(data.nutrition[i].fiber) {
        			myTotalFiber = myTotalFiber + data.nutrition[i].fiber;
    			}
			});

			//var mySystolic = data.biometrics[0].systolic;
			//var myDiastolic = data.biometrics[0].diastolic;
			//var myPulse = data.biometrics[0].resting_heartrate;

			document.getElementById("article6text").innerHTML = myTotalCalories + " Calories Consumed";
			document.getElementById("article6content").innerHTML =  "Carbs: " + myTotalCarbs + "<br/>Protein: " + myTotalProtein + "<br/>Fiber: " + myTotalFiber + "<br/>Fat: " + myTotalFat;
		}

		}, "json" );

//set page links
function detailnavigate(type) {
	window.location.href = "details.html?type="+type+"&authentication_token="+authentication_token;
}
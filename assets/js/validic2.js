


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
    //var  = formatLocalDate("start");
    //var request_end_date = formatLocalDate("end");


    

    //Get the User from the Query String Parameter
    var user = getQueryString('user');
    if (user == null) {
			alert("I don't know you.  Please add ?user=FirstLast.");

    } 

    //setup query 
    	var validicrequestbase = "https://api2.stage.validic.com/users/";
    	var validicrequestuser = user;
  
    	var validicrequestcreds = "?token=abeed1ffe4f14f3fb7d9bcb4928c72b4";
		var validicsummaryrequest = validicrequestbase + validicrequestuser + "/summaries" + validicrequestcreds + "&date=2017-03-01";


	//Get Summary Data
		$.get( validicsummaryrequest, function( data ) {
				//console.log(data);
				console.log(data.data["0"].metrics);
				donkey = data.data["0"].metrics;
				//mySteps = data.data["0"].metrics[4].value;

				//console.log(mySteps);
		//console.log(Array.isArray(donkey));

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
		myDistance = Math.round(objDistance[0].value);
		myCaloriesBurned = Math.round(objBMR[0].value + objenergy[0].value);


		document.getElementById("article1text").innerHTML = mySteps + " steps";
		document.getElementById("article1content").innerHTML = "That's " + myDistance + " miles!" + "<br/>with " + myCaloriesBurned + " calories burned.";

		if(myActiveTime) {
			document.getElementById("article2text").innerHTML = myActiveTime + " active minutes";
		};
		}, "json" );

 	

	//Get Weight Data
	var validicweightrequest = validicrequestbase + validicrequestuser + "/measurements" + validicrequestcreds + "&date=2017-02-27";

		$.get( validicweightrequest, function( data ) {
				console.log(data);
				donkey = data.data["0"].metrics;

		function getValuebyType(type) {
		  return donkey.filter(
		      function(donkey){ return donkey.type == type }
		  );
		}

		var objWeight = getValuebyType('body_weight');
		myWeight = Math.round(objWeight[0].value * 2.20462262*10)/10;
		document.getElementById("article3text").innerHTML = myWeight + " lbs";

		}, "json" );



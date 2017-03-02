 // 1. Timezone Offset
 // 2. Get Params from Query String





 //1. Timzone offset function
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
		    var someDate = new Date();
			var numberOfDaysToSubtract = 14;
			someDate.setDate(someDate.getDate() - numberOfDaysToSubtract); 
		    return someDate.getFullYear() 
		        + '-' + pad(someDate.getMonth()+1)
		        + '-' + pad(someDate.getDate())
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


// 2. Get Parameter Values from Query String 
    var getQueryString = function ( field, url ) {
        var href = url ? url : window.location.href;
        var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        var string = reg.exec(href);
        return string ? string[1] : null;
    };



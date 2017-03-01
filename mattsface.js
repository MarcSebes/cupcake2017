var Client = require('lib/node-rest-client').Client;

var client = new Client();

// direct way
client.get("https://api2.stage.validic.com/users/MarcSebes/summaries?token=abeed1ffe4f14f3fb7d9bcb4928c72b4", function (data, response) {
    // parsed response body as js object
    console.log(data);
    // raw response
    console.log(response);
});

console.log("----- beginning second method of getting data ----- ")


// registering remote methods
client.registerMethod("jsonMethod", "https://api2.stage.validic.com/users/MarcSebes/summaries?token=abeed1ffe4f14f3fb7d9bcb4928c72b4", "GET");

client.methods.jsonMethod(function (data, response) {
    // parsed response body as js object
    console.log(data);
    // raw response
    console.log(response);
});
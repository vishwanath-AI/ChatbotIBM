var
    DiscoveryV1 = require('watson-developer-cloud/discovery/v1')
;

function Discovery () {
    this.discovery = new DiscoveryV1(configFromEnv());
}

Discovery.prototype.Query = function (something) {
    var self = this;

    var req = something != undefined ? something : "";

    return new Promise(function (resolve, reject) {
    	var collection_id = "API Key";
    	var environment_id = "API Key";
    	
    	console.log("calling discover service");
    	// TODO: Call this.discovery.query();
    	
	    self.discovery.query({
	    	environment_id: environment_id,
	    	collection_id: collection_id,
	    	query: something,
	    	passages: true
		}, function(err, response) {
	        if (err) {
	          console.error(err);
	          return reject(err);
	        } 
	        	console.log(Object.keys(response));
	          console.log(JSON.stringify(response));
          
          		var endIndex = 3;
          		
          		if (endIndex > response.matching_results) endIndex = response.matching_results;
				var resp =  {output: []} 
				if (response.matching_results > 0) {
					resp.output = response.passages.slice(0,endIndex);
				}
				
	            return resolve(resp);
	         
	   });
    	// NOTE: Like here: https://www.npmjs.com/package/watson-developer-cloud#discovery
    	

    });
};

function configFromEnv() {
    var c = {};

	var vcap = JSON.parse(process.env.VCAP_SERVICES);

    c.username = vcap["discovery"][0]["credentials"]["username"];
    c.password = vcap["discovery"][0]["credentials"]["password"];
    c.version_date = DiscoveryV1.VERSION_DATE_2017_04_27;

    return c;
}

module.exports = new Discovery();

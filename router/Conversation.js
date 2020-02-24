var
    bodyParser  = require('body-parser'),
    express     = require('express'),

    Conversation = require('../service/Conversation'),
    Discovery = require('../service/Discovery')
;

var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

// Endpoint to create/continue a conversation.
router.post('/conversation', function (req, res) {
	console.log("Hit /conversation route");
	
    var input, context;

    if (req.body) {
        input   = req.body.input;
        context = req.body.context;
    }

	console.log("Calling Watson Conversation service.");

    // Invoke Watson Conversation api to start/continue a conversation
    // workflow.
    Conversation.Say(input, context)
    .then(function (resp) {
		console.log(JSON.stringify(resp));
		context = resp.context;
		// TODO: If nodes visited doesn't contains anything else then we return the result.
		var nodesVisited = resp.output.nodes_visited;
		console.log(resp.output);
		if (nodesVisited && nodesVisited.indexOf("Anything else") == -1 && resp.output.text.length > 0) {
			return new Promise(function (resolve) { return resolve(resp); });	
		}
		
    	// If resp is unknown, then call Discovery
    	return Discovery.Query(input);
    })
    .then(function (resp) {
    	//TODO: Pass context to discovery service to continue converstion
//    	if (resp.data.context == undefined) {
//    		resp.data.context = context;
//    	}
    	return res.json(resp);
    })
    .catch(function (err) {
        res.status(500).json(err);
    });

});

// Export the router instance to simplify application
// level router allocations.
module.exports = router;
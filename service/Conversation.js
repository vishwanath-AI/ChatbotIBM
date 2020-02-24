var
    ConversationV1 = require('watson-developer-cloud/conversation/v1')
;

// NOTE: Reference for general app development leveraging Watson Conversation:
// https://www.ibm.com/watson/developercloud/doc/conversation/develop-app.html

// NOTE: Reference for utilizing Watson Discovery service with Conversation:
// https://github.com/watson-developer-cloud/conversation-with-discovery
// https://www.ibm.com/watson/developercloud/doc/discovery/index.html

function Watson () {
    this.conversation = new ConversationV1(configFromEnv())
}

Watson.prototype.Say = function (something, context) {
    var self = this;

    var req = something != undefined ? something : {};

    if (context) req = {
        input:      {text: something},
        context:    context
    };

    return new Promise(function (resolve, reject) {
        self.conversation.message(req, function (err, resp) {
            if (err) return reject(err);

            resolve(resp)
        });
    });
};

function configFromEnv() {
    var c = {};

	var vcap = JSON.parse(process.env.VCAP_SERVICES);
	console.log(vcap); 
    c.username = vcap["conversation"][0]["credentials"]["username"];
    c.password = vcap["conversation"][0]["credentials"]["password"];
    c.path = {
        workspace_id: "API Key"
    };
    c.version_date = ConversationV1.VERSION_DATE_2017_04_21;

    return c;
}

module.exports = new Watson();

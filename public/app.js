'use strict';

var module = angular.module('ecmChatbot', []);

module.service('Chat', [
	'$http',
	Chat
]);

// Chat service
function Chat($http) {
	var service = {};

	// POST /conversation	
    service.say = function (something, context) {
		var body = {
			input: something,
			context: context
		};

		return $http.post('/conversation', body);
    };

	return service;
}

module.controller('ChatCtrl', ['$scope', 'Chat', ChatCtrl]);

// Chat controller
function ChatCtrl($scope, Chat) {
	console.log('Instantiated ChatCtrl angular controller :)');

	// NOTE: Make initial call to Watson Conversation to start dialog.
    Chat.say("")
	.then(function (response) {
		var outputText = response.data.output.text;
		
		// Render response message to UI.			
		$('#chatHistory').append("<p class='chat-bubble-left'>"+outputText+"</p>");

		// Store context in $scope.context.
		$scope.context = response.data.context;
	})
	.catch(function (reason) {
		console.log('Failed to sendMessage: '+JSON.stringify(reason));
	});
		
	$scope.sendMessage = function () {
		// TODO: Get value of chat input field.
		var input = $('#chatInput').val();

		// NOTE: Retrieve context from scope if it exists to continue
		// an existing conversation dialog with Watson Conversation service.
		var context = $scope.context;

		console.log("Sending text input to Watson Conversation.");

		$('#chatHistory').append("<p class='chat-bubble chat-bubble-right'>"+input+"</p>");

		// NOTE: Call out to Angular Chat service to proxy message to
		// Watson Conversation service via out Node.js backend.
		Chat.say(input, context)
		.then(function (response) {
			console.log(response);
			if (response.data.output.text) {
				var outputText = response.data.output.text;

				// Render response message to UI.			
				$('#chatHistory').append("<p class='chat-bubble chat-bubble-left'>"+outputText+"</p>");
			} else if (response.data.output) {
				for(var i = 0; i < response.data.output.length; i++) {
					console.log(response.data.output)
					var outputText = response.data.output[i].passage_text;
					var score = response.data.output[i].passage_score;
					$('#chatHistory').append("<p class='chat-bubble chat-bubble-left'>"+outputText+"</br>Relevance: "+score+"</p>");
				}

			} else {
				conosole.log(response.data);
			}
			
	
			// Store context in $scope.context.
			$scope.context = response.data.context;
		})
		.catch(function (reason) {
			console.log('Failed to sendMessage: '+reason);
			});
	};
}

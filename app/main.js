define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var parser = require('./turtle_parser');
	console.log(parser);

	var turtle = document.getElementById("turtle");
	document.getElementById("btn-parse").addEventListener("click", function(event){
		var tokens = parser.lex(turtle.value);
		console.log(tokens);
		var graph = parser.parse(tokens);
		console.log(graph);
	});
});

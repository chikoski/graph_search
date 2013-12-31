define(["app/graph"], function(Graph){

	var concat_until = function(str, index, until){
		var buf = [str[index]];
		for(index = index + 1; index < str.length; index = index + 1){
			buf.push(str[index]);
			if(until != null && str[index] === until ||
			   until == null && str[index] == " " ||
			   until == null && str[index] == "\n"){
				break;
			}
		}
		if(buf[buf.length -1] === " " || buf[buf.length -1] === "\n"){
			buf = buf.slice(0, buf.length -1);
		}
		return {
			string: buf.join(""),
			index: index
		};
	};

	var concat_until_eol = function(str, index){
		return concat_until(str, index, '\n');
	};

	var lex_uri = function(str, index){
		return concat_until(str, index, '>');
	};

	var lex_string = function(str, index){
		var result =  concat_until(str, index, '"');
		index = result.index;
		if(str[index + 1] === "@"){
			var lang = concat_until(str, index + 1);
			result.string += lang.string;
			result.index = lang.index;
		}
		return result;
	};

	var lex_comment = function(str, index){
		concat_until_eol(str, index);
		return null;
	};

	var lex = function(str){
		var tokens = [];
		var result = null;
		for(var i = 0; i < str.length; i++){
			if(str[i] === " " || str[i] === "\n"){
			}else if(str[i] === "<"){
				result = lex_uri(str, i);
			}else if(str[i] === '"'){
				result = lex_string(str, i);
			}else if(str[i] === '#'){
				result = lex_comment(str, i);
			}else if(str[i] === "." || str[i] === ";" || str[i] === ","){
				result = {
					string: str[i],
					index: i
				};
			}else{
				result = concat_until(str, i);
			}
			if(result != null && result.string.length > 0){
				tokens.push(result.string);
				i = result.index;
				result = null;
			}
		}
		return tokens;
	};

	var isUri = function(token){
		return token && token[0] == "<" && token[token.length -1] == ">";
	};

	var isPeriod = function(token){
		return token == ".";
	};

	var isSemicolon = function(token){
		return token == ";";
	};

	var isPrefix = function(token){
		return token && token[token.length - 1] == ":";
	};

	var isComma = function(token){
		return token == ",";
	};
	
	var extractUri = function(token){
		if(isUri(token)){
			return token.slice(1, token.length - 1);
		}
		return token;
	};

	var parse_prefix = function(tokens, index){
		if(tokens[index] == "@base" &&
		   isUri(tokens[index + 1]) && isPeriod(tokens[index + 2])){
			return {
				result: {
					uri: extractUri(tokens[index + 1]),
					prefix: "@base"
				},
				index: index + 2
			};
		}else if(isPrefix(tokens[index + 1]) &&
				 isUri(tokens[index + 2]) && isPeriod(tokens[index + 3])){
			return {
				result: {
					uri: extractUri(tokens[index + 2]),
					prefix: tokens[index + 1]
				},
				index: index + 3
			};
		}else{
		// rase error here
			return {};
		}
	};

	var addTriple = function(graph, subject, predicate, object){
		graph.addTriple(extractUri(subject),
						extractUri(predicate),
						extractUri(object));
	};

	var parse = function(tokens){
		var graph = new Graph();
		var subject = null;
		var predicate = null;
		for(var i = 0; i < tokens.length; i++){
			var chr = tokens[i][0];
			if(chr == "@"){
				var prod = parse_prefix(tokens, i);
				graph.addPrefix(prod.result.prefix, prod.result.uri);
				i = prod.index;
			}else if(isComma(tokens[i + 3]) && isUri(tokens[i])){
				addTriple(graph, tokens[i], tokens[i + 1], tokens[i + 2]);
				subject = tokens[i];
				predicate = tokens[i + 1];
				i = i + 3;
			}else if(isComma(tokens[i + 2]) && subject != null){
				addTriple(graph, subject, tokens[i], tokens[i + 1]);
				predicate = tokens[i];
				i = i + 2;
			}else if(isComma(tokens[i + 1]) && subject != null && predicate != null){
				addTriple(graph, subject, predicate, tokens[i]);
				i = i + 1;
			}else if(isSemicolon(tokens[i + 1]) &&
					 subject != null && predicate != null){
				addTriple(graph, subject, predicate, tokens[i]);
				predicate = null;
				i = i + 1;
			}else if(isPeriod(tokens[i + 1]) &&
					 subject != null && predicate != null){
				addTriple(graph, subject, predicate, tokens[i]);
				predicate = null;
				subject = null;
				i = i + 1;
			}else if(isPeriod(tokens[i + 3]) && isUri(tokens[i])){
				addTriple(graph, tokens[i], tokens[i + 1], tokens[i + 2]);
				i = i + 3;
			}else if(isPeriod(tokens[i + 2]) && subject != null){
				addTriple(graph, subject, tokens[i], tokens[i + 1]);
				subject = null;
				predicate = null;
				i = i + 2;
			}else if(isSemicolon(tokens[i + 3]) && isUri(tokens[i])){
				addTriple(graph, tokens[i], tokens[i + 1], tokens[i + 2]);
				subject = tokens[i];
				i = i + 3;
			}else if(isSemicolon(tokens[i + 2]) && subject != null){
				addTriple(graph, subject, tokens[i], tokens[i + 1]);
				i = i + 2;
			}else{
				// parse error
			}
		}
		return graph;
	};

	return {
		lex: lex,
		parse: parse
	};
	
});

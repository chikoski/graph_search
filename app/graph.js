define(["app/predicate"], function(Predicate){

	var Graph = function(){
		this._predicates = {};
		this._prefix = {};
	};

	Graph.prototype = {

		createPredicate: function(uri, subject, object){
			return new Predicate(uri, subject, object);
		},
		addTriple: function(subject, predicate, object){
			this.addPredicate(this.createPredicate(predicate, subject, object));
		},
		addPredicate: function(predicate){
			if(arguments.length > 2){
				predicate =
					this.createPredicate(arguments[0], arguments[1], arguments[2]);
			}
			if(this._predicates[predicate.uri] == null){
				this._predicates[predicate.uri] = [];
			}
			this._predicates[predicate.uri].push(predicate);
		},
		addPrefix: function(prefix, uri){
			this._prefix[prefix] = uri;
		}
		
	};

	return Graph;
	
});

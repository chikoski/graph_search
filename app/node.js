define([], function(){

	var Node = function(){
		this.initialize.apply(this, arguments);
	};

	Node.prototype = {

		initialize: function(uri){
			this.uri = uri;
			this._next = {};
		},

		add: function(edge_uri, node){
			if(node){
				if(this._next[edge_uri] === null){
					this._next[edge_uri] = [];
				}
				this._next[edge_uri].push(node);
			}
		}
		
	};

	return Node;
});

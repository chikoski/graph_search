define([], function(){

	var Resource = function(){
		this.initialize.apply(this, arguments);
	};

	Resource.prototype = {

		initialize: function(uri){
			this.uri = uri;
			this._next = {};
		},

		add: function(predicate, obj){
			if(predicate && obj){
				if(this._next[predicate] === null){
					this._next[predicate] = [];
				}
				this._next[predicate].push(obj);
			}
		}
		
	};

	return Resource;
});

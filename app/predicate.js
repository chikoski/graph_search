define([], function(){

	var Predicate = function(uri, subject, object){
		this.uri = uri;
		this.subject = subject;
		this.object = object;
	};

	return Predicate;
	
});

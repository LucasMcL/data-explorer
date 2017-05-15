app.factory('HttpFact', function($http) {
	console.log('http factory instantiated')

	function sayHello() {console.log('hello world')}

	return { sayHello }
})

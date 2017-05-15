app.factory('HomeFact', function() {
	console.log('home factory instantiated')

	function sayHello() {
		console.log('hello world from home factory')
	}

	return { sayHello }
})

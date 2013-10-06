flashcardAgent.config(function($routeProvider) {
    var routes = GetRoutes();
    var mainMenu = routes.getMainMenu();
    for(var i = 0; i < mainMenu.length; i++) {
        $routeProvider.when(mainMenu[i].url, {
            controller:mainMenu[i].controller,
            templateUrl:mainMenu[i].templateUrl
        });
    };
    $routeProvider.otherwise({redirectTo: '/'});
});



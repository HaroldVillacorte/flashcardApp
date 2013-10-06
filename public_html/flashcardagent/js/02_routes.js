GetRoutes = function() {
    var routes = {};
    routes.rootUrl = 'http://flashcardApp';
    routes.baseUrl = 'http://flashcardApp/index.html#';
    routes.getMainMenu = function() {
        return [
            {
                url: '/card/:deck',
                controller: 'CardController',
                templateUrl: 'partials/flashcardagent/card.html',
                title: 'Study',
                icon: 'photo'
            },
            {
                url: '/settings',
                controller: 'SettingsController',
                templateUrl: 'partials/flashcardagent/settings.html',
                title: 'Settings',
                icon: 'settings'
            },
            {
                url: '/account',
                controller: 'AccountController',
                templateUrl: 'partials/flashcardagent/account.html',
                title: 'Account',
                icon: 'globe'
            }
        ];
    };
    return routes;
};
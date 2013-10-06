flashcardAgent.directive('message', function(Message) {
    return {
        restrict: 'EA',
        controller: function($scope) {
            $scope.$watch(function() {
                $scope.text = Message.message.text;
                $scope.showMessage = Message.message.show;
                $scope.messageClass = Message.message.class;
                $scope.$on('$locationChangeStart', function() {
                    Message.resetMessage();
                });
            });
        }
    };
});

flashcardAgent.directive('deckSelector', function(Decks, $rootScope) {
    $rootScope.decks = Decks;
    $rootScope.routeObject = GetRoutes();
    $rootScope.rootUrl = $rootScope.routeObject.rootUrl;
    $rootScope.baseUrl = $rootScope.routeObject.baseUrl;
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: $rootScope.rootUrl + '/flashcardagent/templates/deckSelector.html'
    };
});



flashcardAgent.controller('NavController', function($scope) {
    var routes = GetRoutes();
    $scope.baseUrl = routes.baseUrl;
    $scope.mainMenu = routes.getMainMenu();
});


flashcardAgent.controller('SettingsController', function($scope) {

});

flashcardAgent.controller('AccountController', function(Account, $scope) {
    $scope.username = Account.username;
    $scope.apiKey = Account.apiKey;
    $scope.save = Account.save();
});

flashcardAgent.controller('CardController', function(Decks, Message, $scope, $routeParams) {
    var deck = (Decks[$routeParams.deck]) ? Decks[$routeParams.deck] : Decks[0];
    $scope.cardIndex = 0;
    $scope.showAnswer = false;

    $scope.deck = deck;

    $scope.$watch(function() {
        $scope.card = (deck.cards[$scope.cardIndex]) ? deck.cards[$scope.cardIndex] : deck.cards[0];
        $scope.qora = ($scope.showAnswer === false) ? 'Question' : 'Answer';
        $scope.content = ($scope.showAnswer === false) ? $scope.card.question : $scope.card.answer;
    });
    $scope.flip = function() {
        $scope.showAnswer = !$scope.showAnswer;
        $('#card-box-content').hide();
        $('#card-box-content').fadeIn('slow');
        Message.resetMessage();
    };
    $scope.quickSelect = function(indexValue) {
        $scope.cardIndex = indexValue;
        $('#card-drop-click').click();
        Message.resetMessage();
    };
    $scope.nextCard = function() {
        if ($scope.cardIndex + 1 > deck.cards.length - 1) {
            var message = 'Conratulations!  That was the last question.  Your knowledge of the subject has improved.';
            Message.setMessage(message, true, 'success');
        }
        else {
            $scope.cardIndex++;
            $scope.showAnswer = false;
            Message.resetMessage();
        }
    };
    $scope.previousCard = function() {
        if ($scope.cardIndex - 1 < 0) {
            var message = 'That was the first question.  Go this way >>>';
            Message.setMessage(message, true, 'secondary');
        }
        else {
            $scope.cardIndex--;
            $scope.showAnswer = false;
            Message.resetMessage();
        }
    };
});
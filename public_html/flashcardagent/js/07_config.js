flashcardAgent.config(function($routeProvider, $httpProvider) {
    $routeProvider.when('/', {
        controller: 'IndexController',
        templateUrl: 'flashcardagent/partials/index.html',
        title: 'Flashcard Agent',
        icon: 'smiley'
    }).when('/data-view', {
        controller: 'DataViewController',
        templateUrl: 'flashcardagent/partials/data-view.html',
        title: 'Manage Decks',
        icon: 'folder'
    }).when('/deck-add', {
        controller: 'DeckAddController',
        templateUrl: 'flashcardagent/partials/deck-add.html',
        title: 'Add a Deck',
        icon: 'plus'
    }).when('/deck-edit/:deckId', {
        controller: 'DeckEditController',
        templateUrl: 'flashcardagent/partials/deck-edit.html',
        title: 'Edit a Deck',
        icon: 'edit'
    }).when('/deck-delete/:deckId', {
        controller: 'DeckDeleteController',
        templateUrl: 'flashcardagent/partials/deck-delete.html',
        title: 'Delete a Deck',
        icon: 'remove'
    }).when('/deck-view/:deckId', {
        controller: 'DeckViewController',
        templateUrl: 'flashcardagent/partials/deck-view.html',
        title: 'Manage Deck',
        icon: 'folder'
    }).when('/card-add/:deckId', {
        controller: 'CardAddController',
        templateUrl: 'flashcardagent/partials/card-add.html',
        title: 'Add a Card',
        icon: 'plus'
    }).when('/card-edit/:deckId/:cardId', {
        controller: 'CardEditController',
        templateUrl: 'flashcardagent/partials/card-edit.html',
        title: 'Edit a Card',
        icon: 'folder'
    }).when('/card-delete/:deckId/:cardId', {
        controller: 'CardDeleteController',
        templateUrl: 'flashcardagent/partials/card-delete.html',
        title: 'Delte Card',
        icon: 'remove'
    }).when('/card', {
        controller: 'CardController',
        templateUrl: 'flashcardagent/partials/card.html',
        title: 'Study',
        icon: 'photo'
    }).when('/sync', {
        controller: 'SyncController',
        templateUrl: 'flashcardagent/partials/sync.html',
        title: 'Account',
        icon: 'globe',
        resolve: {
           loadSyncData: SyncController.loadSyncData
        }
    }).when('/account', {
        controller: 'AccountController',
        templateUrl: 'flashcardagent/partials/account.html',
        title: 'Account',
        icon: 'website'
    }).otherwise({redirectTo: '/'});

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

flashcardAgent.run(function(dbService, fileService) {

    // Foundation 4
    $(document).foundation();

    dbService.docInit();

    // Initialize file system
    fileService.init();

});


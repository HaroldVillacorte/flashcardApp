flashcardAgent.config(function($routeProvider, $httpProvider) {
    $routeProvider.when('/', {
        controller: 'IndexController',
        templateUrl: 'flashcardagent/partials/index.html',
        title: 'Flashcard Agent',
        icon: 'smiley',
        resolve: {
            loadIndexData: IndexController.loadIndexData
        }
    }).when('/data-view', {
        controller: 'DataViewController',
        templateUrl: 'flashcardagent/partials/data-view.html',
        title: 'Manage Categories',
        icon: 'folder',
        resolve: {
            loadDataViewData: DataViewController.loadDataViewData
        }
    }).when('/category-add', {
        controller: 'CategoryAddController',
        templateUrl: 'flashcardagent/partials/category-add.html',
        title: 'Add a Category',
        icon: 'plus',
        resolve: {
            loadCategoryAddData: CategoryAddController.loadCategoryAddData
        }
    }).when('/category-edit/:categoryName', {
        controller: 'CategoryEditController',
        templateUrl: 'flashcardagent/partials/category-edit.html',
        title: 'Edit a Category',
        icon: 'edit',
        resolve: {
           loadCategoryEditData: CategoryEditController.loadCategoryEditData
        }
    }).when('/category-delete/:categoryName', {
        controller: 'CategoryDeleteController',
        templateUrl: 'flashcardagent/partials/category-delete.html',
        title: 'Delete a Category',
        icon: 'remove',
        resolve: {
           loadCategoryDeleteData: CategoryDeleteController.loadCategoryDeleteData
        }
    }).when('/category-view/:categoryName', {
        controller: 'CategoryViewController',
        templateUrl: 'flashcardagent/partials/category-view.html',
        title: 'Manage Category',
        icon: 'folder',
        resolve: {
           loadCategoryViewData: CategoryViewController.loadCategoryViewData
        }
    }).when('/deck-add/:categoryName', {
        controller: 'DeckAddController',
        templateUrl: 'flashcardagent/partials/deck-add.html',
        title: 'Add a Deck',
        icon: 'plus',
        resolve: {
           loadDeckAddData: DeckAddController.loadDeckAddData
        }
    }).when('/deck-edit/:categoryName/:deckName', {
        controller: 'DeckEditController',
        templateUrl: 'flashcardagent/partials/deck-edit.html',
        title: 'Edit a Deck',
        icon: 'edit',
        resolve: {
           loadDeckEditData: DeckEditController.loadDeckEditData
        }
    }).when('/deck-delete/:categoryName/:deckName', {
        controller: 'DeckDeleteController',
        templateUrl: 'flashcardagent/partials/deck-delete.html',
        title: 'Delete a Deck',
        icon: 'remove',
        resolve: {
           loadDeckDeleteData: DeckDeleteController.loadDeckDeleteData
        }
    }).when('/deck-view/:categoryName/:deckName', {
        controller: 'DeckViewController',
        templateUrl: 'flashcardagent/partials/deck-view.html',
        title: 'Manage Deck',
        icon: 'folder',
        resolve: {
           loadDeckViewData: DeckViewController.loadDeckViewData
        }
    }).when('/card-add/:categoryName/:deckName', {
        controller: 'CardAddController',
        templateUrl: 'flashcardagent/partials/card-add.html',
        title: 'Add a Card',
        icon: 'plus',
        resolve: {
           loadCardAddData: CardAddController.loadCardAddData
        }
    }).when('/card-edit/:categoryName/:deckName/:cardQuestion', {
        controller: 'CardEditController',
        templateUrl: 'flashcardagent/partials/card-edit.html',
        title: 'Edit a Card',
        icon: 'folder',
        resolve: {
           loadCardEditData: CardEditController.loadCardEditData
        }
    }).when('/card-delete/:categoryName/:deckName/:cardQuestion', {
        controller: 'CardDeleteController',
        templateUrl: 'flashcardagent/partials/card-delete.html',
        title: 'Delte Card',
        icon: 'remove',
        resolve: {
           loadCardDeleteData: CardDeleteController.loadCardDeleteData
        }
    }).when('/card', {
        controller: 'CardController',
        templateUrl: 'flashcardagent/partials/card.html',
        title: 'Study',
        icon: 'photo',
        resolve: {
           loadCardData: CardController.loadCardData
        }
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
        icon: 'website',
        resolve: {
           loadAccountData: AccountController.loadAccountData
        }
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


//----------------------------------------------------------------------------//
// NavController
//----------------------------------------------------------------------------//

flashcardAgent.controller('NavController', function($scope, goToService, $route,
        $timeout) {
    $scope.showRefresh = true;
    $scope.showPleaseWait = false;
    $scope.mainMenu = [
        {
            url: '/card',
            title: 'Study',
            icon: 'photo'
        },
        {
            url: '/data-view',
            title: 'Manage Data',
            icon: 'folder'
        },
        {
            url: '/account',
            title: 'Account',
            icon: 'website'
        },
        {
            url: '/sync',
            title: 'Sync',
            icon: 'globe'
        }
    ];
    $scope.route = $route;
    $scope.goTo = function(index) {
        goToService.go($scope.mainMenu[index].url);
        $('#toggle-top-bar').click();
    };
    $scope.refresh = function() {
        $scope.showRefresh = false;
        $scope.showPleaseWait = true;
        $timeout(function() {
            $route.reload();
            $scope.showRefresh = true;
            $scope.showPleaseWait = false;
            $('#toggle-top-bar').click();
        }, 1000);
    };
});

//----------------------------------------------------------------------------//
// IndexController
//----------------------------------------------------------------------------//

var IndexController = flashcardAgent.controller('IndexController', function(
        $scope, $timeout, $q, $route) {

    $scope.showInit = false;
    $scope.showReady = false;
    $scope.showError = false;
    var defer = $q.defer();
    var doc;

    defer.promise.then(function() {
        $scope.showInit = true;
        doc = $route.current.locals.loadIndexData;
    }).then(function() {
        $timeout(function() {
            if (doc && doc.categories !== undefined) {
                $scope.showInit = false;
                $scope.showReady = true;
            }
            else {
                $scope.showInit = false;
                $scope.showError = true;
            }
        }, 4500);
    });
    defer.resolve();
});

IndexController.loadIndexData = function($q, dbService, $timeout) {
    var defer = $q.defer();
    $timeout(function() {
        var doc = dbService.getFcDoc();
        defer.resolve(doc);
    }, 1500);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// DataViewController
//----------------------------------------------------------------------------//

var DataViewController = flashcardAgent.controller('DataViewController', function(
        $scope, goToService, $route, categoryService) {

    categoryService.reset();
    var doc = $route.current.locals.loadDataViewData;
    $scope.categories = doc.categories;
    $scope.startLimit = 1;
    $scope.endLimit = doc ? doc.categories.length : 1;
    $scope.reverseBool = false;
    $scope.resultOrder = 'created';

    $scope.addNewCategory = function() {
        goToService.go('/category-add');
    };
    $scope.edit = function(index) {
        goToService.go('/category-edit/' + index);
    };
    $scope.delete = function(name) {
        goToService.go('/category-delete/' + name);
    };
    $scope.goToCategory = function(name) {
        goToService.go('/category-view/' + name);
    };
    $scope.$watch(function() {
        $scope.reverse = ($scope.reverseBool === false) ? '' : '-';
    });
});

DataViewController.loadDataViewData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// CategoryAddController
//----------------------------------------------------------------------------//

var CategoryAddController = flashcardAgent.controller('CategoryAddController', function(
        $scope, goToService, categoryService, $route) {

    var doc = $route.current.locals.loadCategoryAddData;
    $scope.category = categoryService.new();

    $scope.add = function() {
        categoryService.setName($scope.category.name);
        categoryService.add($scope.category, doc);
        goToService.go('/data-view');
    };
    $scope.cancel = function() {
        goToService.go('/data-view');
    };
});

CategoryAddController.loadCategoryAddData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// CategoryEditController
//----------------------------------------------------------------------------//

var CategoryEditController = flashcardAgent.controller('CategoryEditController', function(
        $scope, categoryService, goToService, $route, $routeParams) {

    var doc = $route.current.locals.loadCategoryEditData;
    $scope.category;

    for (var i = 0; i < doc.categories.length; i++) {
        if (doc.categories[i].name === $routeParams.categoryName) {
            $scope.category = doc.categories[i];
        }
    }
    $scope.save = function() {
        $scope.category.updated = Date.now() || +new Date();
        categoryService.save(doc);
        goToService.go('/data-view');
    };
    $scope.cancel = function() {
        goToService.go('/data-view');
    };
});

CategoryEditController.loadCategoryEditData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// CategoryDeleteController
//----------------------------------------------------------------------------//

var CategoryDeleteController = flashcardAgent.controller('CategoryDeleteController', function(
        $scope, categoryService, goToService, $route, $routeParams) {

    var doc = $route.current.locals.loadCategoryDeleteData;
    var index;
    $scope.category;

    for (var i = 0; i < doc.categories.length; i++) {
        if (doc.categories[i].name === $routeParams.categoryName) {
            $scope.category = doc.categories[i];
            index = i;
        }
    }
    $scope.delete = function() {
        for (var i = 0; i < doc.categories.length; i++) {
            var decks = doc.categories[i].decks;
            for (var i = 0; i < decks.length; i++) {
                var cards = decks[i].cards;
                for (var i = 0; i < cards.length; i++) {
                    delete doc._attachments[cards[i].questionImage];
                    delete doc._attachments[cards[i].answerImage];
                    delete doc._attachments[cards[i].notesImage];
                }
            }
        }
        categoryService.delete(index, doc);
        goToService.go('/data-view');
    };
    $scope.cancel = function() {
        goToService.go('/data-view');
    };
});

CategoryDeleteController.loadCategoryDeleteData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// CategoryViewController
//----------------------------------------------------------------------------//

var CategoryViewController = flashcardAgent.controller('CategoryViewController', function(
        $scope, goToService, $route, deckService, $routeParams) {

    deckService.reset();
    var doc = $route.current.locals.loadCategoryViewData;
    $scope.categories = doc.categories;
    $scope.chosenCategory;
    $scope.categoryObject;
    $scope.decks;
    $scope.startLimit = 1;
    $scope.reverseBool = false;
    $scope.resultOrder = 'created';

    if ($scope.categories && $scope.categories.length > 0) {
        $scope.chosenCategory = $routeParams.categoryName !== 'deckview' ?
                $routeParams.categoryName : $scope.categories[0].name;
        for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].name === $scope.chosenCategory) {
                $scope.categoryObject = $scope.categories[i];
            }
        }
        $scope.decks = $scope.categoryObject.decks;
        $scope.endLimit = $scope.decks.length;
    }
    $scope.addNewDeck = function(categoryName) {
        goToService.go('/deck-add/' + categoryName);
    };
    $scope.backToCategories = function() {
        goToService.go('/data-view/');
    };
    $scope.addNewDeck = function(name) {
        goToService.go('/deck-add/' + name);
    };
    $scope.edit = function(nameArray) {
        goToService.go('/deck-edit/' + nameArray[0] + '/' + nameArray[1]);
    };
    $scope.delete = function(nameArray) {
        goToService.go('/deck-delete/' + nameArray[0] + '/' + nameArray[1]);
    };
    $scope.goToDeck = function(nameArray) {
        goToService.go('/deck-view/' + nameArray[0] + '/' + nameArray[1]);
    };
    $scope.$watch(function() {
        $scope.reverse = ($scope.reverseBool === false) ? '' : '-';
    });
});

CategoryViewController.loadCategoryViewData = function($q, dbService) {
    var doc = dbService.getFcDoc();
    var defer = $q.defer();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// DeckAddController
//----------------------------------------------------------------------------//

var DeckAddController = flashcardAgent.controller('DeckAddController', function(
        $scope, $routeParams, goToService, deckService, $route) {

    var doc = $route.current.locals.loadDeckAddData;
    $scope.categories = doc.categories;
    $scope.chosenCategory = $routeParams.categoryName;
    $scope.deck = deckService.entity;

    $scope.add = function() {
        deckService.add($scope.chosenCategory, doc);
        goToService.go('/category-view/' + $scope.chosenCategory);
    };
    $scope.cancel = function() {
        goToService.go('/category-view/' + $scope.chosenCategory);
    };

});

DeckAddController.loadDeckAddData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// DeckEditController
//----------------------------------------------------------------------------//

var DeckEditController = flashcardAgent.controller('DeckEditController', function(
        $scope, $routeParams, goToService, $route, deckService, $sanitize) {

    var doc = $route.current.locals.loadDeckEditData;
    $scope.categories = doc.categories;
    $scope.chosenCategory = $routeParams.categoryName;
    $scope.chosenDeck = $routeParams.deckName;
    $scope.categoryObject;
    $scope.deck;

    for (var i = 0; i < $scope.categories.length; i++) {
        if ($scope.categories[i].name === $scope.chosenCategory) {
            $scope.categoryObject = $scope.categories[i];
        }
    }
    for (var i = 0; i < $scope.categoryObject.decks.length; i++) {
        if ($scope.categoryObject.decks[i].name === $scope.chosenDeck) {
            $scope.deck = $scope.categoryObject.decks[i];
        }
    }
    $scope.save = function() {
        $scope.deck.name = $sanitize($scope.deck.name);
        $scope.deck.updated = Date.now() || +new Date();
        deckService.save(doc);
        goToService.go('/category-view/' + $scope.chosenCategory);
    };
    $scope.cancel = function() {
        goToService.go('/category-view/' + $scope.chosenCategory);
    };
});

DeckEditController.loadDeckEditData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// DeckDeleteController
//----------------------------------------------------------------------------//

var DeckDeleteController = flashcardAgent.controller('DeckDeleteController', function(
        $scope, $routeParams, $route, goToService, deckService) {

    var doc = $route.current.locals.loadDeckDeleteData;
    $scope.categories = doc.categories;
    $scope.chosenCategory = $routeParams.categoryName;
    $scope.chosenDeck = $routeParams.deckName;
    $scope.categoryObject;
    $scope.deck;

    for (var i = 0; i < $scope.categories.length; i++) {
        if ($scope.categories[i].name === $scope.chosenCategory) {
            $scope.categoryObject = $scope.categories[i];
        }
    }
    var index;
    for (var i = 0; i < $scope.categoryObject.decks.length; i++) {
        if ($scope.categoryObject.decks[i].name === $scope.chosenDeck) {
            $scope.deck = $scope.categoryObject.decks[i];
            index = i;
        }
    }
    $scope.delete = function() {
        for (var i = 0; i < $scope.categories.length; i++) {
            var decks = $scope.categories[i].decks;
            for (var i = 0; i < decks.length; i++) {
                var cards = decks[i].cards;
                for (var i = 0; i < cards.length; i++) {
                    delete doc._attachments[cards[i].questionImage];
                    delete doc._attachments[cards[i].answerImage];
                    delete doc._attachments[cards[i].notesImage];
                }
            }
        }
        $scope.categoryObject.decks.splice(index, 1);
        deckService.save(doc);
        goToService.go('/category-view/' + $scope.chosenCategory);
    };
    $scope.cancel = function() {
        goToService.go('/category-view/' + $scope.chosenCategory);
    };
});

DeckDeleteController.loadDeckDeleteData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// DeckViewController
//----------------------------------------------------------------------------//

var DeckViewController = flashcardAgent.controller('DeckViewController', function(
        $scope, $routeParams, goToService, $route) {

    var doc = $route.current.locals.loadDeckViewData;
    $scope.categories = doc.categories;
    $scope.chosenCategory = $routeParams.categoryName;
    $scope.chosenDeck = $routeParams.deckName;
    $scope.categoryObject;
    $scope.deck;
    $scope.cards;
    $scope.startLimit = 1;
    $scope.endLimit;
    $scope.reverseBool = false;
    $scope.resultOrder = 'created';

    if ($scope.categories) {
        for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].name === $scope.chosenCategory) {
                $scope.categoryObject = $scope.categories[i];
            }
        }
    }
    var index;
    if ($scope.categoryObject) {
        for (var i = 0; i < $scope.categoryObject.decks.length; i++) {
            if ($scope.categoryObject.decks[i].name === $scope.chosenDeck) {
                $scope.deck = $scope.categoryObject.decks[i];
                index = i;
            }
        }
    }
    if ($scope.deck) {
        $scope.cards = $scope.deck.cards;
        $scope.endLimit = $scope.cards.length;
    }

    $scope.backToCategory = function() {
        goToService.go('/category-view/' + $scope.chosenCategory);
    };
    $scope.addNewCard = function() {
        goToService.go('/card-add/' + $scope.chosenCategory + '/' + $scope.chosenDeck);
    };
    $scope.edit = function(name) {
        goToService.go('/card-edit/' + $scope.chosenCategory + '/' + $scope.chosenDeck + '/' + name);
    };
    $scope.delete = function(name) {
        goToService.go('/card-delete/' + $scope.chosenCategory + '/' + $scope.chosenDeck + '/' + name);
    };
    $scope.$watch(function() {
        $scope.reverse = ($scope.reverseBool === false) ? '' : '-';
    });
});

DeckViewController.loadDeckViewData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// CardAddController
//----------------------------------------------------------------------------//

var CardAddController = flashcardAgent.controller('CardAddController', function(
        $scope, goToService, $routeParams, cardService, $route, guidService) {

    // Reflow Foundation sections.
    $(document).foundation('section', 'reflow');

    // Initalize new card entity.
    cardService.reset();

    var doc = $route.current.locals.loadCardAddData;
    $scope.chosenCategory = $routeParams.categoryName;
    $scope.chosenDeck = $routeParams.deckName;
    $scope.card = cardService.entity;

    $scope.addImage = function(fileObject) {
        var id = guidService.get();
        switch (fileObject.canvas) {
            case 'question':
                $scope.card.questionImage = id;
                break;
            case 'answer':
                $scope.card.answerImage = id;
                break;
            case 'notes':
                $scope.card.notesImage = id;
                break;
        }
        doc._attachments[id] = {
            content_type: 'image/png',
            data: fileObject.file
        };
    };

    $scope.removeImage = function(canvas) {
        switch (canvas) {
            case 'question':
                delete doc._attachments[$scope.card.questionImage];
                $scope.card.questionImage = undefined;
                $scope.files.question = undefined;
                break;
            case 'answer':
                delete doc._attachments[$scope.card.answerImage];
                $scope.card.answerImage = undefined;
                $scope.files.answer = undefined;
                break;
            case 'notes':
                delete doc._attachments[$scope.card.notesImage];
                $scope.card.notesImage = undefined;
                $scope.files.answer = undefined;
                break;
        }
        console.log($scope.files);
    };

    // Add card to database.
    $scope.add = function() {
        cardService.add(doc, $scope.chosenCategory, $scope.chosenDeck);
        goToService.go('/deck-view/' + $scope.chosenCategory + '/' + $scope.chosenDeck);
    };

    // Cancel card add.
    $scope.cancel = function() {
        goToService.go('/deck-view/' + $scope.chosenCategory + '/' + $scope.chosenDeck);
    };
});

CardAddController.loadCardAddData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// CardEditController
//----------------------------------------------------------------------------//

var CardEditController = flashcardAgent.controller('CardEditController', function(
        $scope, $routeParams, $route, cardService, dbService, $timeout, fileService,
        guidService, goToService, $sanitize) {

    // Reflow Foundation sections.
    $(document).foundation('section', 'reflow');

    var doc = $route.current.locals.loadCardEditData;
    $scope.categories = doc.categories;
    $scope.chosenCategory = $routeParams.categoryName;
    $scope.chosenDeck = $routeParams.deckName;
    $scope.chosenCard = $routeParams.cardQuestion;
    $scope.categoryObject;
    $scope.deck;
    $scope.cards;
    $scope.card;
    $scope.showQuestionImageCanvas = false;
    $scope.showQuestionImageAttachment = true;
    $scope.showAnswerImageCanvas = false;
    $scope.showAnswerImageAttachment = true;
    $scope.showNotesImageCanvas = false;
    $scope.showNotesImageAttachment = true;

    if ($scope.categories) {
        for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].name === $scope.chosenCategory) {
                $scope.categoryObject = $scope.categories[i];
            }
        }
    }
    var index;
    if ($scope.categoryObject) {
        for (var i = 0; i < $scope.categoryObject.decks.length; i++) {
            if ($scope.categoryObject.decks[i].name === $scope.chosenDeck) {
                $scope.deck = $scope.categoryObject.decks[i];
                index = i;
            }
        }
    }
    if ($scope.deck) {
        $scope.cards = $scope.deck.cards;
    }
    if ($scope.cards) {
        for (var i = 0; i < $scope.cards.length; i++) {
            if ($scope.cards[i].question === $scope.chosenCard) {
                $scope.card = $scope.cards[i];
            }
        }
    }

    if ($scope.card.questionImage) {
        dbService.getAttachment(doc._id, $scope.card.questionImage, {}, function(error, response) {
            if (error) {
                console.log('Get attachment error: ');
                console.log(error);
            }
            else {
                $timeout(function() {
                    $scope.questionImageAttachment = fileService.getBlobUrl(response);
                }, 100);
            }
        });
    }

    if ($scope.card.answerImage) {
        dbService.getAttachment(doc._id, $scope.card.answerImage, {}, function(error, response) {
            if (error) {
                console.log('Get attachment error: ');
                console.log(error);
            }
            else {
                $timeout(function() {
                    $scope.answerImageAttachment = fileService.getBlobUrl(response);
                }, 100);
            }
        });
    }

    if ($scope.card.notesImage) {
        dbService.getAttachment(doc._id, $scope.card.notesImage, {}, function(error, response) {
            if (error) {
                console.log('Get attachment error: ');
                console.log(error);
            }
            else {
                $timeout(function() {
                    $scope.notesImageAttachment = fileService.getBlobUrl(response);
                }, 100);
            }
        });
    }

    $scope.addImage = function(fileObject) {
        var id = guidService.get();
        switch (fileObject.canvas) {
            case 'question':
                delete doc._attachments[$scope.card.questionImage];
                $scope.card.questionImage = id;
                $scope.showQuestionImageCanvas = true;
                $scope.showQuestionImageAttachment = false;
                $scope.$apply();
                break;
            case 'answer':
                delete doc._attachments[$scope.card.answerImage];
                $scope.card.answerImage = id;
                $scope.showAnswerImageCanvas = true;
                $scope.showAnswerImageAttachment = false;
                $scope.$apply();
                break;
            case 'notes':
                delete doc._attachments[$scope.card.notesImage];
                $scope.card.notesImage = id;
                $scope.showNotesImageCanvas = true;
                $scope.showNotesImageAttachment = false;
                $scope.$apply();
                break;
        }
        doc._attachments[id] = {
            content_type: 'image/png',
            data: fileObject.file
        };
    };

    $scope.removeImage = function(canvas) {
        switch (canvas) {
            case 'question':
                delete doc._attachments[$scope.card.questionImage];
                $scope.showQuestionImageCanvas = false;
                $scope.showQuestionImageAttachment = false;
                $scope.card.questionImage = undefined;
                break;
            case 'answer':
                delete doc._attachments[$scope.card.answerImage];
                $scope.showAnswerImageCanvas = false;
                $scope.showAnswerImageAttachment = false;
                $scope.card.answerImage = undefined;
                break;
            case 'notes':
                delete doc._attachments[$scope.card.notesImage];
                $scope.showNotesImageCanvas = false;
                $scope.showNotesImageAttachment = false;
                $scope.card.notesImage = undefined;
                break;
        }
    };

    $scope.save = function() {
        $scope.card.question = $sanitize($scope.card.question);
        $scope.card.answer = $sanitize($scope.card.answer);
        $scope.card.notes = $sanitize($scope.card.notes);
        $scope.card.updated = Date.now() || +new Date();
        cardService.save(doc);
        goToService.go('/deck-view/' + $scope.chosenCategory + '/' + $scope.chosenDeck);
    };

    // Cancel card add.
    $scope.cancel = function() {
        goToService.go('/deck-view/' + $scope.chosenCategory + '/' + $scope.chosenDeck);
    };
});

CardEditController.loadCardEditData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// CardDeleteController
//----------------------------------------------------------------------------//

var CardDeleteController = flashcardAgent.controller('CardDeleteController', function(
        $scope, $routeParams, $route, goToService, cardService) {

    var doc = $route.current.locals.loadCardDeleteData;
    $scope.chosenCategory = $routeParams.categoryName;
    $scope.chosenDeck = $routeParams.deckName;
    $scope.chosenCard = $routeParams.cardQuestion;
    $scope.categories = doc.categories;
    $scope.categoryObject;
    $scope.deck;
    $scope.cards;
    $scope.card;
    var index;

    if ($scope.categories) {
        for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].name === $scope.chosenCategory) {
                $scope.categoryObject = $scope.categories[i];
            }
        }
    }
    if ($scope.categoryObject) {
        for (var i = 0; i < $scope.categoryObject.decks.length; i++) {
            if ($scope.categoryObject.decks[i].name === $scope.chosenDeck) {
                $scope.deck = $scope.categoryObject.decks[i];
                index = i;
            }
        }
    }
    if ($scope.deck) {
        $scope.cards = $scope.deck.cards;
    }
    if ($scope.cards) {
        for (var i = 0; i < $scope.cards.length; i++) {
            if ($scope.cards[i].question === $scope.chosenCard) {
                $scope.card = $scope.cards[i];
                index = i;
            }
        }
    }

    $scope.delete = function() {
        $scope.cards.splice(index, 1);
        delete doc._attachments[$scope.card.questionImage];
        delete doc._attachments[$scope.card.answerImage];
        delete doc._attachments[$scope.card.notesImage];
        cardService.save(doc);
        goToService.go('/deck-view/' + $scope.chosenCategory + '/' + $scope.chosenDeck);
    };

    $scope.cancel = function() {
        goToService.go('/deck-view/' + $scope.chosenCategory + '/' + $scope.chosenDeck);
    };

});

CardDeleteController.loadCardDeleteData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// CardController
//----------------------------------------------------------------------------//

var CardController = flashcardAgent.controller('CardController', function(
        Message, $scope, $route, showCardService, dbService, fileService, $timeout) {

    var doc = $route.current.locals.loadCardData;
    $scope.categories = doc.categories;
    $scope.decks = [];
    $scope.chosenCategory = 0;
    $scope.chosenDeck = 0;
    $scope.chosenCard = 0;
    $scope.category;
    $scope.deck;
    $scope.cards;
    $scope.card;
    $scope.cardIndex = 0;
    $scope.content;
    $scope.show = showCardService;
    $scope.showCategorySelectOption = true;
    $scope.stripedCard;

    // Images.
    $scope.questionImageAttachment;
    $scope.answerImageAttachment;
    $scope.notesImageAttachment;

    $scope.setDeck = function(index) {
        $scope.chosenDeck = index;
        $scope.setCard(0);
    };

    $scope.setCard = function(index) {
        $scope.chosenCard = index;
        $scope.card = $scope.cards[$scope.chosenCard];
        $scope.cardIndex = $scope.chosenCard;
        setImages();
        Message.reset();
        $scope.show.showQuestion();
        $scope.stripedCard = undefined;
    };

    $scope.nextCard = function() {
        if ($scope.cardIndex + 1 > $scope.cards.length - 1) {
            var message = 'Conratulations!  That was the last question.  Your knowledge of the subject has improved.';
            Message.set(message, 'success');
        }
        else {
            $scope.setCard($scope.cardIndex + 1);
        }
    };

    $scope.previousCard = function() {
        if ($scope.cardIndex - 1 < 0) {
            var message = 'That was the first question.  Go this way >>>';
            Message.set(message, 'secondary');
        }
        else {
            $scope.setCard($scope.cardIndex - 1);
            Message.reset();
        }
    };

    $scope.flip = function() {
        if (showCardService.question || showCardService.notes) {
            $scope.show.showAnswer();
            $scope.stripedCard = 'striped-card';
        }
        else if (showCardService.answer || showCardService.notes) {
            $scope.show.showQuestion();
            $scope.stripedCard = undefined;
        }
        Message.reset();
        $('#card-box-content').hide();
        $('#card-box-content').fadeIn('slow');
    };

    $scope.showNotes = function() {
        $scope.show.showNotes();
        Message.reset();
        $scope.stripedCard = undefined;
        $('#card-box-content').hide();
        $('#card-box-content').fadeIn('slow');
    };

    $scope.$watch('chosenCategory', function() {
        $scope.category = $scope.categories[$scope.chosenCategory];
        $scope.decks = $scope.category.decks;
        $scope.deck = $scope.decks[0];
        $scope.cards = $scope.deck.cards;
        if ($scope.cards) {
            $scope.setCard(0);
        }
    });

    $scope.$watch('chosenDeck', function() {
        $scope.deck = $scope.decks[$scope.chosenDeck];
        $scope.cards = $scope.deck.cards;
        $scope.card = $scope.cards[0];
        if ($scope.cards) {
            $scope.setCard(0);
        }
    });

    $scope.$watch(function() {
        if ($scope.show.question) {
            $scope.qora = 'Card';
        }
        if ($scope.show.answer) {
            $scope.qora = 'Answer';
        }
        if ($scope.show.notes) {
            $scope.qora = 'Notes';
        }
    });

    var setImages = function() {
        if (!$scope.card.questionImage) {
            fileService.revokeBlobUrl($scope.questionImageAttachment);
        }
        else {
            dbService.getAttachment(doc._id, $scope.card.questionImage, {}, function(error, response) {
                if (error) {
                    console.log('Get attachment error: ');
                    console.log(error);
                }
                else {
                    $timeout(function() {
                        $scope.questionImageAttachment = fileService.getBlobUrl(response);
                    }, 100);
                }
            });
        }

        if (!$scope.card.answerImage) {
            fileService.revokeBlobUrl($scope.answerImageAttachment);
        }
        else {
            dbService.getAttachment(doc._id, $scope.card.answerImage, {}, function(error, response) {
                if (error) {
                    console.log('Get attachment error: ');
                    console.log(error);
                }
                else {
                    $timeout(function() {
                        $scope.answerImageAttachment = fileService.getBlobUrl(response);
                    }, 100);
                }
            });
        }

        if (!$scope.card.notesImage) {
            fileService.revokeBlobUrl($scope.notesImageAttachment);
        }
        else {
            dbService.getAttachment(doc._id, $scope.card.notesImage, {}, function(error, response) {
                if (error) {
                    console.log('Get attachment error: ');
                    console.log(error);
                }
                else {
                    $timeout(function() {
                        $scope.notesImageAttachment = fileService.getBlobUrl(response);
                    }, 100);
                }
            });
        }
    };

    $scope.quickSelect = function(indexValue) {
        $scope.cardIndex = indexValue;
        $('#card-drop-click').click();
        Message.reset();
    };
});

CardController.loadCardData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// SyncController
//----------------------------------------------------------------------------//

var SyncController = flashcardAgent.controller('SyncController', function($scope,
        $route, Message, dbService, $timeout, goToService) {

    var doc = $route.current.locals.loadSyncData;
    var url = 'http://flashcard/rest-user-post-data';
    $scope.syncTime = doc.syncTime;
    $scope.updateTime = doc.updateTime;
    $scope.showHome = false;
    $scope.showPush = false;
    $scope.showPull = false;
    $scope.pleaseWait = false;

    if (!doc.username || !doc.apiExpire) {
        goToService.go('/account');
    }
    else if (doc.apiExpire * 1000 < Math.round((new Date()).getTime())) {
        goToService.go('/account');
    }
    else {
        $scope.showHome = true;
    }

    $scope.choosePush = function() {
        $scope.showHome = false;
        $scope.showPush = true;
    };

    $scope.choosePull = function() {
        $scope.showHome = false;
        $scope.showPull = true;
    };

    $scope.cancel = function() {
        $scope.showHome = true;
        $scope.showPush = false;
        $scope.showPull = false;
    };

    $scope.push = function() {
        $.ajax({
            type: "POST",
            url: url,
            data: {username: doc.username, apiKey: doc.apiKey, id: doc._id, data: doc},
            beforeSend: function() {
                $scope.pleaseWait = true;
                $scope.showPush = false;
            },
            success: function(data) {
                doc.syncTime = Date.now() || +new Date();
                dbService.putFcDoc(doc);

                $timeout(function() {
                    $scope.pleaseWait = false;
                    $scope.synced = true;
                    $scope.needsSync = false;
                    console.log(data);
                }, 2000);
            },
            error: function(error) {
                $scope.$apply(function() {
                    Message.set('There was an error synchronizing data', 'alert');
                    $scope.pleaseWait = false;
                    $scope.synced = false;
                    $scope.needsSync = true;
                });
                console.log(error);
            },
            dataType: 'json'
        });
    };

    $scope.pull = function() {

    };
});

SyncController.loadSyncData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};

//----------------------------------------------------------------------------//
// AccountController
//----------------------------------------------------------------------------//

var AccountController = flashcardAgent.controller('AccountController', function(
        $scope, $route, Message, dbService, $timeout) {

    var doc = $route.current.locals.loadAccountData;
    var signUpUrl = 'http://flashcard/rest-user-sign-up';
    var loginUrl = 'http://flashcard/rest-user-login';
    $scope.username = doc.username ? doc.username : null;
    $scope.email = doc.email ? doc.email : null;
    $scope.password;
    $scope.apiKey = doc.apiKey ? doc.apiKey : null;
    $scope.apiExpire = doc.apiExpire ? doc.apiExpire : null;
    $scope.newUsername;
    $scope.newEmail;
    $scope.newPassword;
    $scope.showLogin = true;
    $scope.showAccount = false;
    $scope.showSignUp = false;
    $scope.pleaseWait = false;

    $scope.showSignUpForm = function() {
        $scope.showLogin = false;
        $scope.showAccount = false;
        $scope.showSignUp = true;
    };

    $scope.cancelSignUp = function() {
        $scope.showLogin = true;
        $scope.showAccount = false;
        $scope.showSignUp = false;
    };

    $scope.logout = function() {
        $scope.username = undefined;
        $scope.email = undefined;
        $scope.apiKey = undefined;
        $scope.apiExpire = undefined;
        $scope.apiExpired = ($scope.apiExpire * 1000 < Math.round((new Date()).getTime()));
        doc.username = $scope.username;
        doc.email = $scope.email;
        doc.apiKey = $scope.apiKey;
        doc.apiExpire = $scope.apiExpire;
        dbService.putFcDoc(doc);
        $scope.showLogin = true;
        $scope.showAccount = false;
    };

    $scope.login = function() {
        $.ajax({
            type: 'POST',
            url: loginUrl,
            data: {username: $scope.username, password: $scope.password},
            beforeSend: function() {
                $scope.pleaseWait = true;
                $scope.showLogin = false;
            },
            success: function(data) {
                switch (data.result) {
                    case data.result === false:
                        $timeout(function() {
                            $scope.pleaseWait = false;
                            $scope.showLogin = true;
                            Message.set('There was an error logging in.  Please try again.', 'alert');
                        }, 2000);
                        break;
                    case 'alnum':
                        $timeout(function() {
                            $scope.pleaseWait = false;
                            $scope.showLogin = true;
                            Message.set('Username and password values can only be alphanumeric with no spaces.', 'alert');
                        }, 2000);
                        break;
                    case 'userNotFound':
                        $timeout(function() {
                            $scope.pleaseWait = false;
                            $scope.showLogin = true;
                            Message.set('Username was not found in the database.', 'alert');
                        }, 2000);
                        break;
                    case 'noMatch':
                        $timeout(function() {
                            $scope.pleaseWait = false;
                            $scope.showLogin = true;
                            Message.set('Username and password combination was not found in the database.', 'alert');
                        }, 2000);
                        break;
                    default:
                        $scope.email = data.result.email;
                        $scope.apiKey = data.result.apiKey;
                        $scope.apiExpire = data.result.apiExpire;
                        doc.username = $scope.username;
                        doc.email = $scope.email;
                        doc.apiKey = $scope.apiKey;
                        doc.apiExpire = $scope.apiExpire;
                        dbService.putFcDoc(doc);
                        $timeout(function() {
                            $scope.pleaseWait = false;
                            $scope.showAccount = true;
                            Message.set('You have successfully logged in.', 'success');
                        }, 2000);
                }
            },
            error: function(error) {
                $timeout(function() {
                    Message.set('There was an error logging in.  Please try again.', 'alert');
                    $scope.pleaseWait = false;
                    $scope.showLogin = true;
                    console.log(error);
                }, 2000);
            },
            dataType: 'json'
        });
    };

    $scope.signUp = function() {
        $.ajax({
            type: 'POST',
            url: signUpUrl,
            data: {username: $scope.newUsername, email: $scope.newEmail, password: $scope.newPassword},
            beforeSend: function() {
                $scope.pleaseWait = true;
                $scope.showSignUp = false;
            },
            success: function(data) {
                switch (data.result) {
                    case data.result === false:
                        $timeout(function() {
                            $scope.pleaseWait = false;
                            $scope.showSignUp = true;
                            Message.set('There was an error signing up.  Please try again.', 'alert');
                        }, 2000);
                        break;
                    case 'uniqueUsername':
                        $timeout(function() {
                            $scope.pleaseWait = false;
                            $scope.showSignUp = true;
                            Message.set('That username is already taken.  Try another one.', 'alert');
                        }, 2000);
                        break;
                    case 'uniqueEmail':
                        $timeout(function() {
                            $scope.pleaseWait = false;
                            $scope.showSignUp = true;
                            Message.set('That email is already in our database.  Try another one.', 'alert');
                        }, 2000);
                        break;
                    case 'alnum':
                        $timeout(function() {
                            $scope.pleaseWait = false;
                            $scope.showSignUp = true;
                            Message.set('Username and password values can only be alphanumeric with no spaces.', 'alert');
                        }, 2000);
                        break;
                    case 'validEmail':
                        $timeout(function() {
                            $scope.pleaseWait = false;
                            $scope.showSignUp = true;
                            Message.set('You must enter a valid email address.', 'alert');
                        }, 2000);
                        break;
                    default:
                        $scope.username = $scope.newUsername;
                        $scope.email = $scope.newEmail;
                        $scope.apiKey = data.result.apiKey;
                        $scope.apiExpire = data.result.apiExpire;
                        doc.username = $scope.username;
                        doc.email = $scope.email;
                        doc.apiKey = $scope.apiKey;
                        doc.apiExpire = $scope.apiExpire;
                        dbService.putFcDoc(doc);
                        $timeout(function() {
                            $scope.pleaseWait = false;
                            $scope.showAccount = true;
                            Message.set('You have successfully signed up.', 'success');
                        }, 2000);
                }
            },
            error: function(error) {
                $timeout(function() {
                    Message.set('There was an error signing up.  Please try again.', 'alert');
                    $scope.pleaseWait = false;
                    $scope.showSignUp = true;
                }, 2000);
                console.log(error);
            },
            dataType: 'json'
        });
    };

    if ($scope.username && $scope.apiExpire * 1000 >= Math.round((new Date()).getTime())) {
        $scope.showLogin = false;
        $scope.showAccount = true;
    }
});

AccountController.loadAccountData = function($q, dbService) {
    var defer = $q.defer();
    var doc = dbService.getFcDoc();
    defer.resolve(doc);
    return defer.promise;
};
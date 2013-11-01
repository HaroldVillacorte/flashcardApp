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
            title: 'Manage Decks',
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
        $scope, $timeout, $q, dbService) {

    $scope.showInit = false;
    $scope.showReady = false;
    $scope.showError = false;
    var defer = $q.defer();
    var settings;

    defer.promise.then(function() {
        $scope.showInit = true;
        $timeout(function() {
            dbService.getFcSettings();
            $scope.$on('getFcSettings', function(event, response) {
                settings = response;
            });
        }, 1000);
    }).then(function() {
        $timeout(function() {
            if (settings && settings.ready === true) {
                $scope.showInit = false;
                $scope.showReady = true;
            }
            else {
                $scope.showInit = false;
                $scope.showError = true;
            }
        }, 2000);
    });
    defer.resolve();
});

//----------------------------------------------------------------------------//
// DataViewController
//----------------------------------------------------------------------------//

var DataViewController = flashcardAgent.controller('DataViewController', function(
        $scope, goToService, deckService, dbService) {

    deckService.reset();
    dbService.getFcDecks();
    $scope.$on('getFcDecks', function(event, response) {
        $scope.$apply(function() {
            $scope.decks = response;
            $scope.endLimit = $scope.decks.length - 1;
            $scope.startLimit = 1;
            $scope.reverseBool = false;
            $scope.resultOrder = 'doc.created';
        });
    });

    $scope.addNewDeck = function() {
        goToService.go('/deck-add');
    };
    $scope.edit = function(id) {
        goToService.go('/deck-edit/' + id);
    };
    $scope.delete = function(id) {
        goToService.go('/deck-delete/' + id);
    };
    $scope.goToDeck = function(id) {
        goToService.go('/deck-view/' + id);
    };
    $scope.$watch(function() {
        $scope.reverse = ($scope.reverseBool === false) ? '' : '-';
    });
});

//----------------------------------------------------------------------------//
// DeckAddController
//----------------------------------------------------------------------------//

var DeckAddController = flashcardAgent.controller('DeckAddController', function(
        $scope, goToService, deckService, dbService) {

    $scope.deck = deckService.entity;

    $scope.add = function() {
        dbService.postFcDoc($scope.deck);
        goToService.go100('/data-view');
    };

    $scope.cancel = function() {
        goToService.go('/data-view');
    };

});

//----------------------------------------------------------------------------//
// DeckEditController
//----------------------------------------------------------------------------//

var DeckEditController = flashcardAgent.controller('DeckEditController', function(
        $scope, $routeParams, goToService, dbService) {

    dbService.getFcDeck($routeParams.deckId);
    $scope.$on('getFcDeck', function(event, response) {
        $scope.$apply(function() {
            $scope.deck = response;
        });
    });

    $scope.save = function() {
        $scope.deck.updated = Date.now() || +new Date();
        dbService.putFcDoc($scope.deck);
        goToService.go100('/data-view');
    };
    $scope.cancel = function() {
        goToService.go('/data-view');
    };
});

//----------------------------------------------------------------------------//
// DeckDeleteController
//----------------------------------------------------------------------------//

var DeckDeleteController = flashcardAgent.controller('DeckDeleteController', function(
        $scope, $routeParams, goToService, dbService) {

    dbService.getFcDeck($routeParams.deckId);
    $scope.$on('getFcDeck', function(event, response) {
        $scope.$apply(function() {
            $scope.deck = response;
        });
    });

    $scope.delete = function() {
        dbService.deleteFcDoc($scope.deck);
        goToService.go100('/data-view');
    };
    $scope.cancel = function() {
        goToService.go('/data-view');
    };
});

//----------------------------------------------------------------------------//
// DeckViewController
//----------------------------------------------------------------------------//

var DeckViewController = flashcardAgent.controller('DeckViewController', function(
        $scope, $routeParams, goToService, dbService) {

    dbService.getFcDeck($routeParams.deckId);
    $scope.$on('getFcDeck', function(event, response) {
        $scope.$apply(function() {
            $scope.deck = response;
            $scope.cards = $scope.deck.cards;
            $scope.endLimit = $scope.cards.length;
            $scope.startLimit = 1;
            $scope.endLimit;
            $scope.reverseBool = false;
            $scope.resultOrder = 'created';
        });
    });

    $scope.back = function() {
        goToService.go('/data-view');
    };
    $scope.addNewCard = function(_id) {
        goToService.go('/card-add/' + _id);
    };
    $scope.edit = function(deckId, cardId) {
        goToService.go('/card-edit/' + deckId + '/' + cardId);
    };
    $scope.delete = function(deckId, cardId) {
        goToService.go('/card-delete/' + deckId + '/' + cardId);
    };
    $scope.$watch(function() {
        $scope.reverse = ($scope.reverseBool === false) ? '' : '-';
    });
});

//----------------------------------------------------------------------------//
// CardAddController
//----------------------------------------------------------------------------//

var CardAddController = flashcardAgent.controller('CardAddController', function(
        $scope, goToService, $routeParams, cardService, dbService, guidService) {

    // Reflow Foundation sections.
    $(document).foundation('section', 'reflow');

    // Initalize new card entity.
    cardService.reset();

    dbService.getFcDeck($routeParams.deckId);
    $scope.$on('getFcDeck', function(event, response) {
        $scope.$apply(function() {
            $scope.deck = response;
        });
    });
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
        $scope.deck._attachments[id] = {
            content_type: 'image/png',
            data: fileObject.file
        };
    };

    $scope.removeImage = function(canvas) {
        switch (canvas) {
            case 'question':
                delete $scope.deck._attachments[$scope.card.questionImage];
                $scope.card.questionImage = undefined;
                //$scope.files.question = undefined;
                break;
            case 'answer':
                delete $scope.deck._attachments[$scope.card.answerImage];
                $scope.card.answerImage = undefined;
                //$scope.files.answer = undefined;
                break;
            case 'notes':
                delete $scope.deck._attachments[$scope.card.notesImage];
                $scope.card.notesImage = undefined;
                //$scope.files.answer = undefined;
                break;
        }
        console.log($scope.files);
    };

    // Add card to database.
    $scope.save = function() {
        $scope.card.id = guidService.get();
        $scope.card.created = Date.now() || +new Date();
        $scope.card.updated = Date.now() || +new Date();
        $scope.deck.cards.push($scope.card);
        dbService.putFcDoc($scope.deck);
        goToService.go100('/deck-view/' + $scope.deck._id);
    };

    // Cancel card add.
    $scope.cancel = function() {
        goToService.go('/deck-view/' + $scope.deck._id);
    };
});

//----------------------------------------------------------------------------//
// CardEditController
//----------------------------------------------------------------------------//

var CardEditController = flashcardAgent.controller('CardEditController', function(
        $scope, $routeParams, dbService, $timeout, fileService, guidService,
        goToService) {

    // Reflow Foundation sections.
    $(document).foundation('section', 'reflow');

    dbService.getFcDeck($routeParams.deckId);
    $scope.$on('getFcDeck', function(event, response) {
        $scope.$apply(function() {

            $scope.deck = response;
            $scope.cards = $scope.deck.cards;

            for (var i = 0; i < $scope.cards.length; i++) {
                if ($scope.cards[i].id === $routeParams.cardId) {
                    $scope.card = $scope.cards[i];
                }
            }

            if ($scope.card.questionImage) {
                dbService.getAttachment($scope.deck._id, $scope.card.questionImage, {}, function(error, response) {
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
                dbService.getAttachment($scope.deck._id, $scope.card.answerImage, {}, function(error, response) {
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
                dbService.getAttachment($scope.deck._id, $scope.card.notesImage, {}, function(error, response) {
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
        });
    });

    $scope.showQuestionImageCanvas = false;
    $scope.showQuestionImageAttachment = true;
    $scope.showAnswerImageCanvas = false;
    $scope.showAnswerImageAttachment = true;
    $scope.showNotesImageCanvas = false;
    $scope.showNotesImageAttachment = true;

    $scope.addImage = function(fileObject) {
        var id = guidService.get();
        switch (fileObject.canvas) {
            case 'question':
                delete $scope.deck._attachments[$scope.card.questionImage];
                $scope.card.questionImage = id;
                $scope.showQuestionImageCanvas = true;
                $scope.showQuestionImageAttachment = false;
                $scope.$apply();
                break;
            case 'answer':
                delete $scope.deck._attachments[$scope.card.answerImage];
                $scope.card.answerImage = id;
                $scope.showAnswerImageCanvas = true;
                $scope.showAnswerImageAttachment = false;
                $scope.$apply();
                break;
            case 'notes':
                delete $scope.deck._attachments[$scope.card.notesImage];
                $scope.card.notesImage = id;
                $scope.showNotesImageCanvas = true;
                $scope.showNotesImageAttachment = false;
                $scope.$apply();
                break;
        }
        $scope.deck._attachments[id] = {
            content_type: 'image/png',
            data: fileObject.file
        };
    };

    $scope.removeImage = function(canvas) {
        switch (canvas) {
            case 'question':
                delete $scope.deck._attachments[$scope.card.questionImage];
                $scope.showQuestionImageCanvas = false;
                $scope.showQuestionImageAttachment = false;
                $scope.card.questionImage = undefined;
                break;
            case 'answer':
                delete $scope.deck._attachments[$scope.card.answerImage];
                $scope.showAnswerImageCanvas = false;
                $scope.showAnswerImageAttachment = false;
                $scope.card.answerImage = undefined;
                break;
            case 'notes':
                delete $scope.deck._attachments[$scope.card.notesImage];
                $scope.showNotesImageCanvas = false;
                $scope.showNotesImageAttachment = false;
                $scope.card.notesImage = undefined;
                break;
        }
    };

    $scope.save = function() {
        $scope.card.updated = Date.now() || +new Date();
        dbService.putFcDoc($scope.deck);
        goToService.go300('/deck-view/' + $scope.deck._id);
    };

    // Cancel card add.
    $scope.cancel = function() {
        goToService.go('/deck-view/' + $scope.deck._id);
    };
});

//----------------------------------------------------------------------------//
// CardDeleteController
//----------------------------------------------------------------------------//

var CardDeleteController = flashcardAgent.controller('CardDeleteController', function(
        $scope, $routeParams, goToService, dbService) {

    var index;
    dbService.getFcDeck($routeParams.deckId);
    $scope.$on('getFcDeck', function(event, response) {
        $scope.$apply(function() {
            $scope.deck = response;
            $scope.cards = $scope.deck.cards;
            for (var i = 0; i < $scope.cards.length; i++) {
                if ($scope.cards[i].id === $routeParams.cardId) {
                    $scope.card = $scope.cards[i];
                    index = i;
                }
            }
        });
    });

    $scope.delete = function() {
        $scope.cards.splice(index, 1);
        delete $scope.deck._attachments[$scope.card.questionImage];
        delete $scope.deck._attachments[$scope.card.answerImage];
        delete $scope.deck._attachments[$scope.card.notesImage];
        dbService.putFcDoc($scope.deck);
        goToService.go100('/deck-view/' + $scope.deck._id);
    };

    $scope.cancel = function() {
        goToService.go('/deck-view/' + $scope.deck._id);
    };

});

//----------------------------------------------------------------------------//
// CardController
//----------------------------------------------------------------------------//

var CardController = flashcardAgent.controller('CardController', function(
        Message, $scope, showCardService, dbService, fileService, $timeout, dbService) {

    dbService.getFcDecks();
    $scope.$on('getFcDecks', function(event, response) {
        $scope.$apply(function() {
            $scope.chosenDeck = 0;
            $scope.chosenCard = 0;
            $scope.cardIndex = 0;
            $scope.content;
            $scope.show = showCardService;
            $scope.stripedCard;

            // Images.
            $scope.questionImageAttachment;
            $scope.answerImageAttachment;
            $scope.notesImageAttachment;
            $scope.decks = response;
        });
    });

    $scope.setDeck = function(index) {
        $scope.chosenDeck = index;
        $scope.setCard(0);
    };

    $scope.setCard = function(index) {
        $scope.cardIndex = index;
        $scope.card = $scope.cards[index];
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

    $scope.$watch('chosenDeck', function() {
        $scope.deck = $scope.decks[$scope.chosenDeck];
        $scope.cards = $scope.deck.doc.cards;
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
            dbService.getAttachment($scope.deck.id, $scope.card.questionImage, {}, function(error, response) {
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
            dbService.getAttachment($scope.deck.id, $scope.card.answerImage, {}, function(error, response) {
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
            dbService.getAttachment($scope.deck.id, $scope.card.notesImage, {}, function(error, response) {
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
        $scope, Message, dbService, $timeout, dbService) {

    var signUpUrl = 'http://flashcard/rest-user-sign-up';
    var loginUrl = 'http://flashcard/rest-user-login';

    dbService.getFcSettings();
    $scope.$on('getFcSettings', function(event, response) {
        $scope.newUsername;
        $scope.password;
        $scope.newEmail;
        $scope.newPassword;
        $scope.showLogin = true;
        $scope.showAccount = false;
        $scope.showSignUp = false;
        $scope.pleaseWait = false;

        $scope.settings = response;
        $scope.username = $scope.settings.username ? $scope.settings.username : null;
        $scope.email = $scope.settings.email ? $scope.settings.email : null;
        $scope.apiKey = $scope.settings.apiKey ? $scope.settings.apiKey : null;
        $scope.apiExpire = $scope.settings.apiExpire ? $scope.settings.apiExpire : null;

        if ($scope.username && $scope.apiExpire * 1000 >= Math.round((new Date()).getTime())) {
            $scope.showLogin = false;
            $scope.showAccount = true;
        }
    });

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
});

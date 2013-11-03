flashcardAgent.factory('goToService', function($location, $timeout) {
    var goTo = {
        go: function(url) {
            $location.path(url);
        },
        go100: function(url) {
            $timeout(function() {
                $location.path(url);
            }, 100);
        },
        go200: function(url) {
            $timeout(function() {
                $location.path(url);
            }, 200);
        },
        go300: function(url) {
            $timeout(function() {
                $location.path(url);
            }, 300);
        },
        go400: function(url) {
            $timeout(function() {
                $location.path(url);
            }, 400);
        },
        go500: function(url) {
            $timeout(function() {
                $location.path(url);
            }, 500);
        }
    };
    return goTo;
});

flashcardAgent.factory('Decks', function($http) {
    var dataObj = {
        getDecks: function(callback) {
            $http.get('data.json').success(callback);
        }
    };
    return dataObj;
});

flashcardAgent.factory('Message', function($rootScope) {
    var message = {
        text: null,
        show: false,
        class: 'secondary',
        set: function(textValue, classValue) {
            this.text = textValue;
            this.show = true;
            this.class = classValue;
            $rootScope.$broadcast('message');
        },
        reset: function() {
            this.text = null;
            this.show = false;
            this.class = 'secondary';
        }
    };
    return message;
});

flashcardAgent.factory('fcString', function() {
    var stringFactory = {
        ucFirst: function(string) {
            var first = string.charAt(0).toUpperCase();
            return first + string.substr(1);
            ;
        }
    };
    return stringFactory;
});

flashcardAgent.service('guidService', function() {
    var guidService = {
        get: function() {
            function _p8(s) {
                var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        }
    };
    return guidService;
});

flashcardAgent.factory('Decks', function($http) {
    var dataObj = {
        getDecks: function(callback) {
            $http.get('data.json').success(callback);
        }
    };
    return dataObj;
});

flashcardAgent.factory('deckService', function() {
    var deckService = {
        entity: {
            _attachments: {},
            name: undefined,
            created: undefined,
            updated: undefined,
            cards: []
        },
        reset: function() {
            this.entity._attachments = {};
            this.entity.name = undefined;
            this.entity.updated = undefined;
            this.entity.created = undefined;
            this.entity.cards = [];
        }
    };
    return deckService;
});

flashcardAgent.factory('cardService', function() {
    var card = {
        entity: {
            question: undefined,
            questionImage: undefined,
            answer: undefined,
            answerImage: undefined,
            notes: undefined,
            notesImage: undefined,
            sync: true
        },
        reset: function() {
            this.entity.question = undefined;
            this.entity.questionImage = undefined;
            this.entity.answer = undefined;
            this.entity.answerImage = undefined;
            this.entity.notes = undefined;
            this.entity.notesImage = undefined;
            this.entity.sync = true;
        }
    };
    return card;
});

flashcardAgent.factory('showCardService', function() {
    var showCardService = {
        question: true,
        answer: false,
        notes: false,
        showAnswer: function() {
            this.question = false;
            this.answer = true;
            this.notes = false;
        },
        showQuestion: function() {
            this.question = true;
            this.answer = false;
            this.notes = false;
        },
        showNotes: function() {
            this.question = false;
            this.answer = false;
            this.notes = true;
        }
    };
    return showCardService;
});

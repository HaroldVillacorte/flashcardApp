flashcardAgent.factory('pouchDb', function() {
    Pouch.enableAllDbs = false;
    return new Pouch('flashcardAgent');
});

flashcardAgent.factory('dbService', function(pouchDb, $q, $timeout) {
    var pouch = pouchDb;
    pouch.docInit = function() {
        var data = {
            categories: [],
            username: undefined,
            email: undefined,
            apiKey: undefined,
            apiExpire: undefined,
            syncTime: 0,
            updateTime: 0,
            _attachments: {}
        };
        pouch.allDocs({include_docs: true}, function(error, response) {
            if (response.total_rows === 0) {
                pouch.post(data, function(error, response) {
                    console.log(error || response);
                });
            }
            else {
                console.log('Database ready: ');
                console.log(response);
            }
        });
    };
    pouch.getFcDoc = function() {
        var defer = $q.defer();
        var result;
        this.allDocs({include_docs: true, attachments: true}, function(error, response) {
            if (error) {
                console.log('Database error:');
                console.log(error);
            }
            else {
                result = response.rows[0].doc;
                console.log(response.rows[0].doc);
            }
        });
        $timeout(function() {
            defer.resolve(result);
        }, 250);
        return defer.promise;
    };
    pouch.putFcDoc = function(doc) {
        doc.updateTime = Date.now() || +new Date();
        this.put(doc, function(error, response) {
            console.log(error | response);
        });
    };
    return pouch;
});

flashcardAgent.factory('goToService', function($location, $timeout) {
    var goTo = {
        go: function(url) {
            $timeout(function() {
                $location.path(url);
            }, 50);
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

flashcardAgent.factory('categoryService', function($q, $timeout, $sanitize,
        dbService) {

    var categoryService = {
        db: dbService,
        entity: {
            name: undefined,
            updated: undefined,
            created: undefined,
            decks: []
        },
        sanitizeEntity: function(entity) {
            for (var property in entity) {
                property = $sanitize(property);
            }
            return entity;
        },
        setName: function(name) {
            this.entity.name = name;
        },
        new : function() {
            return this.entity;
        },
        get: function(name) {
            var i = this.categories().indexOf(name);
            if (i > -1) {
                categoryService.entity.name = this.categories()[i].name;
                categoryService.entity.updated = this.categories()[i].updated;
                categoryService.entity.created = this.categories()[i].created;
            }
        },
        reset: function() {
            this.entity.name = undefined;
            this.entity.updated = undefined;
            this.entity.created = undefined;
            this.entity.decks = [];
        },
        add: function(entity, doc) {
            this.entity.created = Date.now() || +new Date();
            this.entity.updated = Date.now() || +new Date();
            entity = this.sanitizeEntity(entity);
            doc.categories.push(entity);
            this.db.putFcDoc(doc);
        },
        save: function(doc) {
            for (var i = 0; i < doc.categories.length; i++) {
                doc.categories.length[i] = this.sanitizeEntity(doc.categories.length[i]);
            }
            this.db.putFcDoc(doc);
        },
        delete: function(index, doc) {
            doc.categories.splice(index, 1);
            this.db.putFcDoc(doc);
        }
    };
    return categoryService;
});

flashcardAgent.factory('deckService', function(dbService, $sanitize) {
    var deckService = {
        db: dbService,
        entity: {
            name: undefined,
            created: undefined,
            updated: undefined,
            cards: []
        },
        sanitizeEntity: function(entity) {
            for (var property in entity) {
                property = $sanitize(property);
            }
            return entity;
        },
        reset: function() {
            this.entity.name = undefined;
            this.entity.updated = undefined;
            this.entity.created = undefined;
            this.entity.cards = [];
        },
        new : function() {
            return this.entity;
        },
        setName: function(name) {
            this.entity.name = name;
        },
        addCard: function(cardKey) {
            this.entity.cards.push(cardKey);
        },
        add: function(catName, doc) {
            var categories = doc.categories;
            var chosenCategory;
            for (var i in categories) {
                if (categories[i].name === catName) {
                    chosenCategory = categories[i];
                }
            }
            var decks = chosenCategory.decks;
            this.entity.created = Date.now() || +new Date();
            this.entity.updated = Date.now() || +new Date();
            this.entity = this.sanitizeEntity(this.entity);
            decks.push(this.entity);
            this.db.putFcDoc(doc);
        },
        save: function(doc) {
            this.db.putFcDoc(doc);
        }
    };
    return deckService;
});

flashcardAgent.factory('cardService', function(dbService, $sanitize) {
    var card = {
        db: dbService,
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
        },
        sanitizeEntity: function(entity) {
            for (var property in entity) {
                property = $sanitize(property);
            }
            return entity;
        },
        add: function(doc, categoryName, deckName) {
            var categories = doc.categories;
            var chosenCategory;
            var chosenDeck;
            for (var i in categories) {
                if (categories[i].name === categoryName) {
                    chosenCategory = categories[i];
                }
            }
            for (var i in chosenCategory.decks) {
                if (chosenCategory.decks[i].name === deckName) {
                    var chosenDeck = chosenCategory.decks[i];
                }
            }
            this.entity.created = Date.now() || +new Date();
            this.entity.updated = Date.now() || +new Date();
            this.entity = this.sanitizeEntity(this.entity);
            chosenDeck.cards.push(this.entity);
            this.db.putFcDoc(doc);
        },
        save: function(doc) {
            this.db.putFcDoc(doc);
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
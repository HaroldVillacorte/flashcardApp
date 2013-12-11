flashcardAgent.factory('pouchDb', function() {
    Pouch.enableAllDbs = false;
    return new Pouch('flashcardAgent');
});

flashcardAgent.factory('dbService', function(pouchDb, $rootScope, $sanitize) {
    var pouch = pouchDb;
    pouch.docInit = function() {
        var settings = {
            _id: 'settings',
            ready: true,
            username: undefined,
            email: undefined,
            password: undefined
        };
        pouch.get('settings', function(error, response) {
            if (error && error.status !== 404) {
                throw error;
            }
            else if (error && error.status === 404) {
                pouch.put(settings, function(error, response) {
                    if (error) {
                        throw error;
                    }
                    else {
                        console.log('Database ready: ');
                        console.log(response);
                    }
                });
            }
            else {
                console.log('Database ready: ');
                console.log(response);
            }
        });
    };
    pouch.sanitizeDoc = function(doc) {
        for (var property in doc) {
            property = $sanitize(property);
        }
        return doc;
    };
    pouch.getFcSettings = function() {
        this.get('settings', function(error, response) {
            if (error) {
                throw error;
            }
            else {
                $rootScope.$broadcast('getFcSettings', response);
            }
        });
    };
    pouch.getFcDeck = function(id) {
        this.get(id, {attachments: true}, function(error, response) {
            if (error) {
                throw error;
            }
            else {
                $rootScope.$broadcast('getFcDeck', response);
            }
        });
    };
    pouch.getFcDecks = function() {
        this.allDocs({include_docs: true, attachments: true}, function(error, response) {
            if (error) {
                throw error;
            }
            else {
                for (var i in response.rows) {
                    if (response.rows[i].id === 'settings') {
                        delete response.rows[i];
                    }
                }
                $rootScope.$broadcast('getFcDecks', response.rows);
            }
        });
    };
    pouch.postFcDoc = function(doc) {
        doc = this.sanitizeDoc(doc);
        doc.created = Date.now() || +new Date();
        doc.updated = Date.now() || +new Date();
        this.post(doc, function(error, response) {
            if (error) {
                throw error;
            }
            else {
                $rootScope.$broadcast('postFcDoc', response);
            }
        });
    };
    pouch.putFcDoc = function(doc) {
        doc = this.sanitizeDoc(doc);
        this.put(doc, function(error, response) {
            if (error) {
                throw error;
            }
            else {
                $rootScope.$broadcast('putFcDoc', response);
            }
        });
    };
    pouch.deleteFcDoc = function(doc) {
        this.remove(doc, function(error, response) {
            if (error) {
                throw error;
            }
            else {
                $rootScope.$broadcast('deleteFcDoc', response);
            }
        });
    };
    return pouch;
});

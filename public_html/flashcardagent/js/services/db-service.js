flashcardAgent.factory('pouchDb', function() {
    Pouch.enableAllDbs = false;
    return new Pouch('flashcardAgent');
});

flashcardAgent.factory('dbService', function(pouchDb, $rootScope, $sanitize) {
    var pouch = pouchDb;
    pouch.docInit = function() {
        var data = {
            _id: 'settings',
            ready: true,
            username: undefined,
            email: undefined,
            apiKey: undefined,
            apiExpire: undefined
        };
        pouch.get('settings', function(error, response) {
            if (error && !error.status === 404) {
                console.log(error || response);
            }
            else if (error && error.status === 404) {
                pouch.put(data, function(error, response) {
                    console.log(error || response);
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
                console.log('Database error:');
                console.log(error);
            }
            else {
                $rootScope.$broadcast('getFcSettings', response);
                console.log(response);
            }
        });
    };
    pouch.getFcDeck = function(id) {
        this.get(id, {attachments: true}, function(error, response) {
            if (error) {
                console.log('Database error:');
                console.log(error);
            }
            else {
                $rootScope.$broadcast('getFcDeck', response);
                console.log(response);
            }
        });
    };
    pouch.getFcDecks = function() {
        this.allDocs({include_docs: true, attachments: true}, function(error, response) {
            if (error) {
                console.log('Database error:');
                console.log(error);
            }
            else {
                for (var i in response.rows) {
                    if (response.rows[i].id === 'settings') {
                        delete response.rows[i];
                    }
                }
                $rootScope.$broadcast('getFcDecks', response.rows);
                console.log(response.rows);
            }
        });
    };
    pouch.postFcDoc = function(doc) {
        doc = this.sanitizeDoc(doc);
        doc.created = Date.now() || +new Date();
        doc.updated = Date.now() || +new Date();
        this.post(doc, function(error, response) {
            console.log(error || response);
        });
    };
    pouch.putFcDoc = function(doc) {
        doc = this.sanitizeDoc(doc);
        this.put(doc, function(error, response) {
            console.log(error || response);
        });
    };
    pouch.deleteFcDoc = function(doc) {
        this.remove(doc, function(error, response) {
            console.log(error || response);
        });
    };
    return pouch;
});

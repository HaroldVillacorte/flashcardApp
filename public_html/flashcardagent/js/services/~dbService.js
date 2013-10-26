flashcardAgent.factory('dbService', function(Message, fcString) {

    var dbObject = {
        idbSupported: ('indexedDB' in window),
        dbName: 'flashcardAgent1',
        objectStores: [
            {
                storeName: 'category',
                storeIndexes: [
                    {
                        name: 'name',
                        options: {unique: true}
                    },
                    {
                        name: 'created',
                        options: {unique: false}
                    },
                    {
                        name: 'updated',
                        options: {unique: false}
                    }
                ]
            },
            {
                storeName: 'deck',
                storeIndexes: [
                    {
                        name:'name',
                        options: {unique: true}
                    },
                    {
                        name: 'created',
                        options: {unique: false}
                    },
                    {
                        name: 'updated',
                        options: {unique: false}
                    },
                    {
                        name:'categoryKey',
                        options: {unique: false}
                    },
                    {
                        name:'cards',
                        options: {unique: false}
                    }
                ]
            },
            {
                storeName: 'card',
                storeIndexes: [
                    {
                        name: 'created',
                        options: {unique: false}
                    },
                    {
                        name: 'updated',
                        options: {unique: false}
                    },
                    {
                        name: 'deckKey',
                        options: {unique: false}
                    },
                    {
                        name: 'categoryKey',
                        options: {unique: false}
                    },
                    {
                        name: 'question',
                        options: {unique: false}
                    },
                    {
                        name: 'questionImage',
                        options: {unique: false}
                    },
                    {
                        name: 'answer',
                        options: {unique: false}
                    },
                    {
                        name: 'answerImage',
                        options: {unique: false}
                    },
                    {
                        name: 'notes',
                        options: {unique: false}
                    },
                    {
                        name: 'notesImage',
                        options: {unique: false}
                    },
                    {
                        name: 'sync',
                        options: {unique: false}
                    }
                ]
            }
        ],
        db: undefined,
        error: function(e) {
            Message.set('There was a database error.', 'alert');
            console.dir(e);
        },
        init: function() {
            if (this.idbSupported) {
                var openRequest = indexedDB.open(this.dbName, 1);
                openRequest.onupgradeneeded = function(e) {
                    console.log('Upgrading database...');
                    var newDb = e.target.result;
                    for(var i = 0; i < dbObject.objectStores.length; i++) {
                        var newStoreTarget = dbObject.objectStores[i];
                        var newStoreName = dbObject.objectStores[i].storeName;
                        var newStore = newDb.createObjectStore(newStoreName, {
                            autoIncrement: true,
                            unique: true
                        });
                        console.log('Object store "' + newStoreName + '" created.');
                        for(var ii = 0; ii < newStoreTarget.storeIndexes.length; ii++) {
                            var newIndexName = newStoreTarget.storeIndexes[ii].name;
                            newStore.createIndex(newIndexName, newIndexName, newStoreTarget.storeIndexes[ii].options);
                            console.log('Store index "' + newIndexName + '" created.');
                        }
                    }
                };
                openRequest.onsuccess = function(e) {
                    console.log('Database ready.');
                    dbObject.db = e.target.result;
                };
                openRequest.onerror = function(e) {
                    dbObject.error(e);
                };
            }
            else {
                Message.set('Indexed Database not supported.', 'alert');
            }
        },
        add: function(object, storeVal) {
            var transaction = this.db.transaction([storeVal], 'readwrite');
            var store = transaction.objectStore(storeVal);
            object.created = Date.now() || +new Date();
            object.updated = Date.now() || +new Date();
            var result = store.add(object);
            result.onerror = function(e) {
                dbObject.error(e);
            };
            result.onsuccess = function() {
                Message.set(fcString.ucFirst(storeVal) + ' "' + object.name + '" was sucessfully added', 'success');
            };
        },
        save: function(storeVal, object, key) {
            var transaction = this.db.transaction([storeVal], 'readwrite');
            var store = transaction.objectStore(storeVal);
            object.updated = Date.now() || +new Date();
            var deleteResult = store.delete(Number(key));
            deleteResult.onerror = function(e) {
                dbObject.error(e);
            };
            deleteResult.onsuccess = function() {
                console.log('Success');
            };
            var addResult = store.add(object, Number(key));
            addResult.onsuccess = function() {
                Message.set(fcString.ucFirst(storeVal) + ' "' + object.name + '" was sucessfully updated', 'success');
            };
            addResult.onerror = function(e) {
                dbObject.error(e);
            };
        },
        getAll: function(storeVal) {
            var transaction = this.db.transaction([storeVal], 'readonly');
            var store = transaction.objectStore(storeVal);
            var cursor = store.openCursor();
            cursor.onerror = function(e) {
                dbObject.error(e);
            };
            return cursor;
        },
        get: function(storeVal, key) {
            var transaction = this.db.transaction([storeVal], 'readonly');
            var store = transaction.objectStore(storeVal);
            var object = store.get(Number(key));
            object.onerror = function(e) {
                dbObject.error(e);
            };
            return object;
        },
        getManyByIndex: function(storeVal, indexName, value) {
            var transaction = this.db.transaction([storeVal], 'readonly');
            var store = transaction.objectStore(storeVal);
            var index = store.index(indexName);
            var result = index.get(value);
            var cursor = index.openCursor();
            cursor.onerror = function(e) {
                dbObject.error(e);
            };
            return cursor;
        },
        delete: function(storeVal, key) {
            var transaction = this.db.transaction([storeVal], 'readwrite');
            var store = transaction.objectStore(storeVal);
            var result = store.delete(Number(key));
            result.onsuccess = function(e) {
                Message.set('The ' + e.target.source.name + ' was sucessfully deleted.', 'success');
            };
            result.onerror = function(e) {
                dbObject.error(e);
            };
        }
    };
    return dbObject;
});

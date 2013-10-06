flashcardAgent.factory('Decks', function($rootScope, $http) {
    //$http.get('../../angDemos/data.json').success(function(data) {
    //    $rootScope.data = data;
    //});
    $rootScope.data = [
        {
            "id": 0,
            "name": "Category 0",
            "cards": [
                {
                    "question": "This is question 1",
                    "answer": "This is answer 1"
                },
                {
                    "question": "This is question 2",
                    "answer": "This is answer 2"
                },
                {
                    "question": "This is question 3",
                    "answer": "This is answer 3"
                },
                {
                    "question": "This is question 4",
                    "answer": "This is answer 4"
                },
                {
                    "question": "This is question 5",
                    "answer": "This is answer 5"
                }
            ]
        },
        {
            "id": 1,
            "name": "Category 1",
            "cards": [
                {
                    "question": "This is question 1",
                    "answer": "This is answer 1"
                },
                {
                    "question": "This is question 2",
                    "answer": "This is answer 2"
                },
                {
                    "question": "This is question 3",
                    "answer": "This is answer 3"
                },
                {
                    "question": "This is question 4",
                    "answer": "This is answer 4"
                },
                {
                    "question": "This is question 5",
                    "answer": "This is answer 5"
                }
            ]
        },
        {
            "id": 2,
            "name": "Category 2",
            "cards": [
                {
                    "question": "This is question 1",
                    "answer": "This is answer 1"
                },
                {
                    "question": "This is question 2",
                    "answer": "This is answer 2"
                },
                {
                    "question": "This is question 3",
                    "answer": "This is answer 3"
                },
                {
                    "question": "This is question 4",
                    "answer": "This is answer 4"
                },
                {
                    "question": "This is question 5",
                    "answer": "This is answer 5"
                }
            ]
        }
    ];
    return $rootScope.data;
});

flashcardAgent.factory('Message', function($rootScope) {
    $rootScope.message = {};
    $rootScope.message.text = null;
    $rootScope.message.show = false;
    $rootScope.message.message = null;
    $rootScope.message.class = 'secondary';
    $rootScope.setMessage = function(textValue, boolValue, classValue) {
        $rootScope.message.text = textValue;
        $rootScope.message.show = boolValue;
        $rootScope.message.class = classValue;
    };
    $rootScope.resetMessage = function() {
        $rootScope.message.text = null;
        $rootScope.message.show = false;
        $rootScope.message.class = 'secondary';
    };
    return $rootScope;
});

flashcardAgent.factory('Account', function($rootScope) {
    var account = localStorage.getItem('account');
    if(!account) {
        account = {
            username: '',
            apiKey: ''
        };
        localStorage.setItem('account', account);
    }
    $rootScope.getUsername = function() {
        return account.username;
    };
    $rootScope.setUsername = function(usernameText) {
        account.username = usernameText;
    };
    $rootScope.getApiKey = function() {
        return account.apiKey;
    };
    $rootScope.setApiKey = function(apiKeyText) {
        account.apiKey = apiKeyText;
    };
    $rootScope.save = function() {
        try {
            localStorage.setItem('account', account);
        }
        catch(e) {
            alert('There was a problem saving the account: ' + e);
        }
    };
    return $rootScope;
});

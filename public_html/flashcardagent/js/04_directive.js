flashcardAgent.directive('message', function(Message) {
    return {
        restrict: 'EA',
        templateUrl: '/flashcardagent/templates/message.html',
        scope: {},
        link: function(scope, element, attrs) {
            scope.close = function() {
                Message.reset();
            };
            scope.$on('message', function() {
                scope.text = Message.text;
                scope.showMessage = Message.show;
                scope.messageClass = Message.class;
            });
            scope.$on('$locationChangeStart', function() {
                Message.reset();
            });
        }
    };
});

flashcardAgent.directive('deckSelector', function(Decks, $location) {
//    return {
//        restrict: 'EA',
//        link: function(scope) {
//            Decks.getDecks(function(data) {
//                scope.decks = data.data;
//                scope.goToDeck = function(index) {
//                    $location.path('/card/' + index);
//                };
//            });
//        },
//        replace: true,
//        templateUrl: '/flashcardagent/templates/deckSelector.html'
//    };
});

flashcardAgent.directive('quickheight', function() {
    return {
        restrict: 'EA',
        link: function(scope, element, attrs) {
            var windowHeight = window.innerHeight;
            var containerHeight = (windowHeight - 45) * (attrs.quickheight / 100);
            element.css('height', containerHeight + 'px');
        }
    };
});

flashcardAgent.directive('imageDrop', function(fileService) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {},
        templateUrl: '/flashcardagent/templates/image-drop.html',
        link: function(scope, element, attrs) {
            var canvas = document.getElementById(attrs.canvas + '-canvas');
            var ctx = canvas.getContext('2d');
            var DomUrlQuestion;
            var DomUrlAnswer;
            var DomUrlNotes;
            var dataUrl;
            var base64String;
            var MAX_HEIGHT = 300;
            scope.message = undefined;
            scope.dropImage = function($file) {
                scope.message = undefined;
                if ($file[0].size > 200 * 1024) {
                    scope.message = 'The image size exceeds 200kb.  You will not \
                                        be able to sync with the server although \
                                        you can still use your data locally.';
                }

                var img = new Image();

                switch (attrs.canvas) {
                    case 'question':
                        DomUrlQuestion = fileService.dropImage($file);
                        img.src = DomUrlQuestion;
                        break;
                    case 'answer':
                        DomUrlAnswer = fileService.dropImage($file);
                        img.src = DomUrlAnswer;
                        break;
                    case 'notes':
                        DomUrlNotes = fileService.dropImage($file);
                        img.src = DomUrlNotes;
                        break;
                }


                img.onload = function() {
                    if (this.height > MAX_HEIGHT) {
                        this.width *= MAX_HEIGHT / img.height;
                        this.height = MAX_HEIGHT;
                    }
                    canvas.width = this.width;
                    canvas.height = this.height;
                    canvas.style.width = this.width + 'px';
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    dataUrl = canvas.toDataURL();
                    base64String = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
                    scope.$parent.addImage({
                        canvas: attrs.canvas,
                        file: base64String,
                        fileInfoObject: {
                            lastModifiedDate: $file[0].lastModifiedDate,
                            name: $file[0].name,
                            size: $file[0].size,
                            type: $file[0].type
                        }
                    });
                };

            };
            scope.removeImage = function() {
                var canvas = document.getElementById(attrs.canvas + '-canvas');
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.style.width = '0px';

                switch (attrs.canvas) {
                    case 'question':
                        fileService.revokeBlobUrl(DomUrlQuestion);
                        break;
                    case 'answer':
                        fileService.revokeBlobUrl(DomUrlAnswer);
                        break;
                    case 'notes':
                        fileService.revokeBlobUrl(DomUrlNotes);
                        break;
                }
                scope.message = undefined;
                scope.$parent.removeImage(attrs.canvas);
            };
        }
    };
});

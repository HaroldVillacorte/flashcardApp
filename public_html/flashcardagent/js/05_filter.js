flashcardAgent.filter('newlines', function () {
    return function(text) {
        if(text) {
            var textBr = text.replace(/\n/g, '<br/>');
            var textSpace = textBr.replace(/ /g, '&nbsp;');
        }
        return textSpace;
    };
});

flashcardAgent.filter('limitRange', function() {
    return function(arr, start, end) {
        if(arr) {
            return arr.slice(start, end);
        }
    };
});

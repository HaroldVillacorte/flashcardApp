(function($) {

    var resizeIt = function() {
        // Selectors
        var wrapper100 = $('.wrapper-100');
        var deckSelector = document.getElementById('deck-selector');
        var cardSelector = document.getElementById('card-selector');
        var tableWrapper = $('.table-wrapper');

        // Container height
        var windowHeight = window.innerHeight;
        var wrapper100Height = windowHeight - 45;

        // Resize height
        var deckSelectorHeight = (windowHeight - 45) * .35;
        var cardSelectorHeight = (windowHeight - 45) * .65;
        var tableWrapperHeight = (windowHeight - 45) * .7;

        // Resize
        $(wrapper100).css('height', wrapper100Height + 'px');
        $(deckSelector).css('height', deckSelectorHeight + 'px');
        $(cardSelector).css('height', cardSelectorHeight + 'px');
        $(tableWrapper).css('height', tableWrapperHeight + 'px');
    };

    $(window).resize(function() {
        resizeIt();
    });

})(jQuery);



/*
 jQuery pager plugin

Jeremy Herrman
http://jherm.github.com/pager

*/





(function ($) {

    var Pager = function (element, opts) {

        element = $(element);
        var obj = this;

        this.settings = $.extend({}, $.fn.pager.defaults, opts);
        var settings = this.settings;

        this.CurrentPage = function () {
            return settings.currentPage;
        };

        this.SetCurrentPage = function (page) {
            settings.currentPage = page;
        };

        this.RecordsPerPage = function () {
            return settings.recordsPerPage;
        };

        this.TotalRecordCount = function () {
            return settings.totalRecordCount;
        };

        this.Update = function (options) {

            this.settings = $.extend({}, $.fn.pager.defaults, options);
            settings = this.settings;

            SetDisplay();
        };

        this.SetDisplay = SetDisplay;
        function SetDisplay() {

            var totalPageCount = settings.totalPageCount;
            var totalRecordCount = settings.totalRecordCount;

            var currentPage = settings.currentPage;

            element.empty();

            var nextPage = Math.min(settings.pagesToShow, settings.totalPageCount);
            var lastPage = Math.max(settings.pagesToShow, settings.totalPageCount);

            var $results = $("<span class='results'></span>");

            if (totalPageCount > 1) {

                var firstRecordOfCurrentPage = ((currentPage - 1) * settings.recordsPerPage) + 1;
                var lastRecordOfCurrentPage = currentPage * settings.recordsPerPage > totalRecordCount ? totalRecordCount : currentPage * settings.recordsPerPage;

                $results.append(firstRecordOfCurrentPage + '-' + lastRecordOfCurrentPage + ' of ' + totalRecordCount + ' results found.');

            } else {

                $results.append(totalRecordCount + " results");
            }

            element.append($results);

            if (totalPageCount > 1) {

                // setup $pagerControls to hold render
                var $pagerControls = $('<ul pageSize=\'' + settings.recordsPerPage + '\' currentPage=\'' + currentPage + '\' totalRecordCount=\'' + totalRecordCount + '\' totalPageCount=\'' + totalPageCount + '\'></ul>');

                //navigation controls

                if (currentPage > 1) {

                    var firstButton = $('<li class="prev"><a href="javascript:void(0);">' + settings.firstButtonText + '</a></li>');
                    firstButton.click(function () { settings.pagerButtonClickCallback(1) });
                    $pagerControls.append(firstButton);

                    var prevButton = $('<li class="prev"><a href="javascript:void(0);">' + settings.prevButtonText + '</a></li>');
                    prevButton.click(function () { settings.pagerButtonClickCallback(currentPage - 1) });
                    $pagerControls.append(prevButton);
                }

                var half = Math.floor(nextPage / 2);

                var startPage = currentPage - half;
                if (currentPage <= nextPage / 2) {
                    startPage = 1;
                }
                else if (currentPage > (totalPageCount - half)) {
                    startPage = totalPageCount - (nextPage - 1);
                }

                // loop thru visible pages and render buttons
                for (var page = startPage; page < startPage + nextPage; page++) {
                    var currentButton = $('<li class="number' + (currentPage == page ? ' current' : '') + '"><a href="javascript:void(0);">' + (page) + '</a></li>');
                    currentButton.bind("click", page, function (e) { settings.pagerButtonClickCallback(e.data); });
                    currentButton.appendTo($pagerControls);
                }

                // render in the next and last buttons before returning the whole rendered control back.
                if (currentPage < totalPageCount) {
                    var nextButton = $('<li class="next"><a href="javascript:void(0);">' + settings.nextButtonText + '</a></li>');
                    nextButton.click(function () { settings.pagerButtonClickCallback(currentPage + 1) });
                    $pagerControls.append(nextButton);

                    var lastButton = $('<li class="next"><a href="javascript:void(0);">' + settings.lastButtonText + '</a></li>');
                    lastButton.click(function () { settings.pagerButtonClickCallback(lastPage) });
                    $pagerControls.append(lastButton);
                }

                element.append($pagerControls);
            } else if (totalPageCount == 1) {
                element.append("Pages: 1");
            }
        };
    };

    $.fn.pager = function (options) {

        //top and bottom pager
        this.each(function () {

            var element = $(this);

            // pass options to plugin constructor
            var pager = new Pager($(this), options);
            //pager.SetDisplay();

            // Store plugin object in this element's data
            element.data('pager', pager);

            return pager;
        });
    };

    $.fn.pager.defaults = {
        currentPage: 1,
        pagesToShow: 5,
        recordsPerPage: 20,
        recordTypeSingular: "result",
        recordTypePlural: "results",
        firstButtonText: " &lt;&lt; ",
        prevButtonText: " &lt; ",
        nextButtonText: " &gt; ",
        lastButtonText: " &gt;&gt; ",
        noResultsText: "No results were found",
        totalPageCount: 0,
        totalRecordCount: 0
    };

})(jQuery);


(function ($) {
    $.fn.hyphenate = function (language) {
        if (window['Hypher']['languages'][language]) {
            return this.each(function () {
                var i = 0, len = this.childNodes.length;
                for (; i < len; i += 1) {
                    if (this.childNodes[i].nodeType === 3) {
                        this.childNodes[i].nodeValue = window['Hypher']['languages'][language].hyphenateText(this.childNodes[i].nodeValue);
                    }
                }
            });
        }
    };
}(jQuery));
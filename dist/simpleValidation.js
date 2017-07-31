var sel = function (selector) { return document.querySelector(selector); };
var selAll = function (selector) { return document.querySelectorAll(selector); };
var Validation = (function () {
    function Validation(items) {
        for (var i = 0; i < items.length; i++) {
            this._items.push(items[i]);
        }
    }
    Validation.prototype.validate = function (form) {
        var message;
        this._items.forEach(function (item) {
            // Compare
            if (item.dataset.equalto && item.dataset.equaltoOther) {
                var other = sel('[name="' + item.dataset.equaltoOther + '"]');
                if (item.value !== other.value) {
                    message = item.dataset.equalto;
                }
            }
            if (item.dataset.required) {
                if (!item.value) {
                    message = item.dataset.required;
                }
            }
            if (message) {
                item.setCustomValidity(message);
            }
        });
        return !message;
    };
    return Validation;
}());
var validation;
(function () {
    var valItems = selAll('[data-val="true"]');
    if (valItems.length > 0) {
        validation = new Validation(valItems);
    }
})();
//# sourceMappingURL=validation.js.map
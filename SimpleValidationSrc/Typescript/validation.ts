var sel = (selector: string) => document.querySelector(selector) as HTMLElement;
var selAll = (selector: string) => document.querySelectorAll(selector) as NodeListOf<HTMLElement>;

class Validation {
    private _items: HTMLInputElement[];

    constructor(items: NodeListOf<HTMLElement>) {
        for (var i = 0; i < items.length; i++) {
            this._items.push(items[i] as HTMLInputElement);
        }
    }

    public validate(form: HTMLFormElement): boolean {
        let message :string;

        this._items.forEach(item => {
            // Compare
            if (item.dataset.equalto && item.dataset.equaltoOther) {
                let other = sel('[name="' + item.dataset.equaltoOther + '"]') as HTMLInputElement;
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
    }
}

var validation: Validation;
(function () {
    let valItems = selAll('[data-val="true"]');
    if (valItems.length > 0) {
        validation = new Validation(valItems);
    }
})();
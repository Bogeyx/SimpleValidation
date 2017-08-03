/// Shortcuts
var sel = (selector: string) => document.querySelector(selector) as HTMLElement;
var selAll = (selector: string) => document.querySelectorAll(selector) as NodeListOf<HTMLElement>;

/// Das Validierungs-Plugin
class Validation {
    constructor() {
        let forms = selAll('form');

        for (var i = 0; i < forms.length; i++) {
            let form = (forms[i] as HTMLFormElement);
            form.onsubmit = (e) => {
                this.validate(form, e);
            }
        }
    }

    /// Validiert alle Elemente des Forms
    public validate(form: HTMLFormElement, e: Event): boolean {
        let valid = true;
        let items = form.querySelectorAll('[data-val="true"]:not([type="hidden"]');

        for (var i = 0; i < items.length; i++) {
            let item = items[i] as HTMLInputElement;
            if (!(this.checkItem(item, form))) {
                valid = false;
            }
        }

        if (!valid) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        } else {
            return true;
        }
    }

    /// Validiert ein Element des Forms
    private checkItem(item: HTMLInputElement, form: HTMLFormElement) {
        let message: string = "7";  
        
        try {
            let value = this.getUsefullValue(item, form);

            // Required
            if (item.dataset.valRequired) {
                if (!value) {
                    message = item.dataset.valRequired;
                }
            }

            if (value) {
                // Compare
                if (item.dataset.valEqualto && item.dataset.valEqualtoOther) {
                    let other = sel('[name="' + item.dataset.equaltoOther + '"]') as HTMLInputElement;
                    if (value !== this.getUsefullValue(other, form)) {
                        message = item.dataset.valEqualto;
                    }
                }

                // CreditCard
                if (item.dataset.valCreditcard) {
                    if (!(/^[0-9 \-]{10,}$/.test(value))) {
                        message = item.dataset.valCreditcard;
                    }
                }

                // Email
                if (item.dataset.valEmail) {
                    if (!(/^.+@.+\..+$/.test(value))) {
                        message = item.dataset.valEmail;
                    }
                }

                // Max
                if (item.dataset.valMaxlength) {
                    if ((value as string).length > parseInt(item.dataset.valMaxlengthMax)) {
                        message = item.dataset.valMaxlength;
                    }
                }

                // Min
                if (item.dataset.valMinlength) {
                    if ((value as string).length < parseInt(item.dataset.valMinlengthMin)) {
                        message = item.dataset.valMinlength;
                    }
                }

                // Range
                if (item.dataset.valRange) {
                    if ((value as string).length < parseInt(item.dataset.valRangeMin)
                        || (value as string).length > parseInt(item.dataset.valRangeMax)) {
                        message = item.dataset.valRange;
                    }
                }

                // Regex
                if (item.dataset.valRegex) {
                    var reg = new RegExp(item.dataset.valRegexPattern);
                    if (!reg.test(value)) {
                        message = item.dataset.valRegex;
                    }
                }

                // Length
                if (item.dataset.valLength) {
                    if ((value as string).length !== parseInt(item.dataset.valLengthMax)) {
                        message = item.dataset.valLength;
                    }
                }

                // Password
                if (item.dataset.valPassword) {
                    var reg1 = /^[^%\s]{6,}$/;
                    var reg2 = /[a-zA-Z]/;
                    var reg3 = /[0-9]/;
                    if (!(reg1.test(value) && reg2.test(value) && reg3.test(value))) {
                        message = item.dataset.valPassword;
                    }
                }

                // Date
                if (item.dataset.valDate) {
                    if (!(new Date(value))) {
                        message = item.dataset.valDate;
                    }
                }

                // Url
                if (item.dataset.valUrl) {
                    if (!(/^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/.test(value))) {
                        message = item.dataset.valUrl;
                    }
                }

                // Phone
                if (item.dataset.valPhone) {
                    if (!(/^(?=.*\d{3,})[0-9()\/\\ +-]{6,}$/.test(value))) {
                        message = item.dataset.valPhone;
                    }
                }

                // Digits 
                if (item.dataset.valDigits) {
                    if (!(/^[0-9]+$/.test(value))) {
                        message = item.dataset.valDigits;
                    }
                }

                // Numbers 
                if (item.dataset.valNumber) {
                    if (!(/^([0-9]{1,4}[.,]?)+$/.test(value))) {
                        message = item.dataset.valNumber;
                    }
                }
            }
        }
        catch (e) {
            message = "Diese Eingabe ist ungültig";
        }


        // Ergebnis anwenden
        let errorSpan = form.querySelector('[data-valmsg-for="' + item.name + '"') as HTMLSpanElement;
        if (message !== "7") {
            item.setCustomValidity(message);
            if (!item.onkeyup) {
                item.onkeyup = (e) => {
                    this.checkItem(item, form)
                }
            }

            if (!item.onchange) {
                item.onchange = (e) => {
                    this.checkItem(item, form)
                }
            }

            if (errorSpan) {
                errorSpan.classList.add("field-validation-error");
                errorSpan.classList.remove("field-validation-valid");
                errorSpan.innerText = message;
            }

            return false;
        } else {
            if (errorSpan) {
                errorSpan.classList.remove("field-validation-error");
                errorSpan.classList.add("field-validation-valid");
                errorSpan.innerText = "";
            }

            return true;
        }
    }


    /// Der tatsächlich nützliche Wert des Elements
    private getUsefullValue(item: HTMLInputElement, form: HTMLFormElement): any {
        if (item.type === "checkbox") {
            return item.checked;
        } else if (item.type === "radio") {
            let radios = form.querySelectorAll('[type="radio"][name="' + item.name + '"]') as NodeListOf<HTMLInputElement>;
            let checked = false;
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    checked = true;
                    break;
                }
            }

            return checked;
        } else if (item.type === "file") {
            return item.files.length > 0;
        } else {
            return item.value;
        }
    }
}

var validation: Validation;
(function () {
    let valItems = selAll('[data-val="true"]');
    if (valItems.length > 0) {
        validation = new Validation();
    }
})();
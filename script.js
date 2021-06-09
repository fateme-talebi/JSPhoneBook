function ElementBuilder(name) {
    this.element = document.createElement(name);

    this.text = function(text) {
        this.element.textContent = text;
        return this;
    };

    this.placeHolder = function(placeHolder) {
        this.element.placeholder = placeHolder;
        return this;
    };

    this.type = function(type) {
        this.element.type = type;
        return this;
    };

    this.class = function(...classArray) {
        classArray.forEach(eachClasse => this.element.classList.add(eachClasse))
        return this;
    };

    this.id = function(id) {
        this.element.id = id;
        return this;
    };

    this.onEvent = function(eventName, func) {
        this.element.addEventListener(eventName, func);
        return this;
    }

    this.appendTo = function(parent) {
        parent.appendChild(this.element);
        return this;
    };

    this.prependTo = function(parent) {
        parent.prepend(this.element);
        return this;
    }

    this.build = function() {
        return this.element;
    };
}

const builder = {
    create: function(name) {
        return new ElementBuilder(name);
    },
};

function PhoneBookRecord(name, phone) {
    this.name = name;
    this.phone = phone;
}

function PhoneBook() {
    this.records = [];

    this.addContact = function(contact) {
        this.records.push(contact);
        return this.records
    };

    this.removeContact = function(selectedIndex) {
        this.records.splice(selectedIndex, 1);
        return this.records;
    };

    this.searchContact = function(inputValue) {
        let result = [];
        if (inputValue === '') {
            return this.records;
        }
        result = this.records.filter(item => item.name.toLowerCase().includes(inputValue.toLowerCase()));
        return result;
    }
}

function Render(container) {
    this.container = container;
    const phoneBook = new PhoneBook();

    this.init = function() {

        const content = builder
            .create("div")
            .class("content")
            .appendTo(this.container)
            .build();

        const h1 = builder
            .create("h1")
            .text("Phonebook App")
            .appendTo(content)
            .build();

        const phoneBookIcn = builder
            .create("i")
            .class("far", "fa-address-book")
            .appendTo(h1);

        const searchContainer = builder
            .create("div")
            .class("searchContainer")
            .appendTo(content)
            .build();

        const searchIcon = builder
            .create("i")
            .class("fa", "fa-search")
            .appendTo(searchContainer);

        const searchBox = builder
            .create("input")
            .placeHolder("search")
            .onEvent("keyup", function() {
                const ulRecords = document.getElementsByClassName("record");
                const ulRecordsArray = Array.from(ulRecords);
                const noResultDiv = document.getElementById("noResult");
                const searchResults = phoneBook.searchContact(searchBox.value);

                if (searchResults.length === 0) {

                    noResultDiv.classList.remove("hidden");
                    ulRecordsArray.forEach(item => item.style.display = "none")

                } else {

                    noResultDiv.classList.add("hidden");
                    ulRecordsArray.forEach(ulItem => {
                        const found = searchResults.some(item => item.name === ulItem.childNodes[1].innerText);
                        if (found) {
                            ulItem.style.display = "block";
                        } else if (!found) {
                            ulItem.style.display = "none";
                        }
                    })

                }
            })
            .appendTo(searchContainer)
            .build();

        const labelAdd = builder
            .create("label")
            .text("Add new contact")
            .appendTo(content);

        const nameInput = builder
            .create("input")
            .type("text")
            .placeHolder("name")
            .appendTo(content)
            .build();

        const phoneInput = builder
            .create("input")
            .type("text")
            .placeHolder("phone")
            .appendTo(content)
            .build();

        const addButton = builder
            .create("Button")
            .text("Add")
            .onEvent("click", function() {
                const nameCheck = requieredInput(nameInput);
                const phoneCheck = requieredInput(phoneInput);

                if (nameCheck && phoneCheck) {
                    document.getElementById("noResult").classList.add("hidden");
                    const newContact = new PhoneBookRecord(nameInput.value, phoneInput.value);
                    phoneBook.addContact(newContact);

                    const mainUl = builder
                        .create("ul")
                        .class("record")
                        .prependTo(contactsContainer)
                        .build();

                    builder
                        .create("hr")
                        .appendTo(mainUl);

                    builder
                        .create("li")
                        .text(nameInput.value)
                        .appendTo(mainUl);

                    builder
                        .create("li")
                        .text(phoneInput.value)
                        .appendTo(mainUl);

                    builder
                        .create("li")
                        .class("fas", "fa-minus-circle")
                        .onEvent("click", function(event) {
                            phoneBook.removeContact(phoneBook.records.indexOf(newContact));
                            const selectedContact = event.target.parentElement;
                            selectedContact.remove();
                        })
                        .appendTo(mainUl)
                        .build();

                    nameInput.value = "";
                    phoneInput.value = "";
                }
            })
            .appendTo(content);

        const titlesContainer = builder
            .create("div")
            .appendTo(content)
            .build();

        const titleUl = builder
            .create("ul")
            .appendTo(titlesContainer)
            .build();

        const hr = builder
            .create("hr")
            .appendTo(titleUl);

        const nameHeader = builder
            .create("li")
            .text("Name")
            .class("tilte")
            .appendTo(titleUl);

        const phoneHeader = builder
            .create("li")
            .text("Phone")
            .class("tilte")
            .appendTo(titleUl);

        const contactsContainer = builder
            .create("div")
            .id("contactsContainer")
            .appendTo(content)
            .build();

        const noResult = builder
            .create("div")
            .class("hidden")
            .id("noResult")
            .text("no result !")
            .appendTo(content)
            .build();
    };
}

function requieredInput(input) {
    input.addEventListener("keyup", function() {
        if (input.className.indexOf('requiredInput') !== -1) {
            input.classList.remove("requiredInput");
        }
    });

    if (input.value === "" || input.value.trim() === "") {
        input.classList.add("requiredInput");
        return false;
    } else {
        input.classList.remove("requiredInput");
        return true
    }
}

const phoneBookContainer = document.getElementById("phone-book-container");
const app = new Render(phoneBookContainer);
app.init();

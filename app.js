// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    //create a public method that will allow other modules to add a new item to our data structure
    return {                // will contain all our public methods
        addItem: function(type, des, val) {
            var newItem, ID;

            // create new id ()
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;    // makes the id = the id of the last entry + 1
            } else {
                ID = 0;
            }

            // create new item based on 'inc' or 'exp' type
            if (type === 'exp') {                           // input type in getInput will be either exp or inc
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // push it into our data structure
            data.allItems[type].push(newItem);   // adds the new element to the array either exp or inc from above

            // return the new element
            return newItem; // the other function that will call this one will have access to item we just created

        },

        testing: function() {               // testing to see in console
            console.log(data);
        }
    };

})();


// UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }
    
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {


    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }  

        });
    };


    var ctrlAddItem = function() {
        var input, newItem;

        // this function will need to: 
        // 1. Get the field input data
        input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the new item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    };

    return  {
        init: function() {
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init(); 
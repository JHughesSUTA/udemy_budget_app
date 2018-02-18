// BUDGET CONTROLLER
var budgetController = (function() {
    // Some code
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


    // creating a function in which all our event listeners will be placed
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
        // this function will need to: 
        // 1. Get the field input data
        var input = UICtrl.getInput();

        // 2. Add the item to the budget controller

        // 3. Add the new item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    };

    // we create an init function because we want to have a place to put all the code that we want to be executed when the application starts. 
    // we moved the listener logic atove (setupEventListeners) we need to call it
    // we do this with an intialization function:
    return  {
        init: function() {
            console.log('Application has started.'); // this line for testing purposes
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init(); // without this line of code nothing would happen because there would be no event listeners
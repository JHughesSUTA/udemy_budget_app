// BUDGET CONTROLLER
var budgetController = (function() {
    // Some code
})();


// UI CONTROLLER
var UIController = (function() {
    
    //not a private function, because we want to use it in the other controllers
    return {
        getInput: function(){
            // capture the values for the three parts of the form
            return {
                type: document.querySelector('.add__type').value, //value will be 'inc' or 'exp' (look at the html)
                description: document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value
            };
        }
    };

})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function() {
        // this function will need to: 
        // 1. Get the field input data
        var input = UICtrl.getInput();
        console.log(input);

        // 2. Add the item to the budget controller

        // 3. Add the new item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }  

    });

})(budgetController, UIController);
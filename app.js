// BUDGET CONTROLLER
var budgetController = (function() {
    // Some code
})();


// UI CONTROLLER
var UIController = (function() {
    //code goes here
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {


    var ctrlAddItem = function() {
        // this function will need to: 
        // 1. Get the field input data
        // 2. Add the item to the budget controller
        // 3. Add the new item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI
        console.log('test');
    }



    /* event listener for clicking the add button. We can get rid of the anonymous function, because we can now pass in the functionw defined above, ctrlAddItem,  as an argument: */
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);



    /* event listener for hitting enter (we don't need a query selector because it's global, rather than for a certain element). 
    'keypress' event is for ANY key, so we need to put an if statement so it only works if enter is pressed. 13 is the keycode for ENTER... some browsers use 'which' instead of keycode - so we add the 'or'
    */
    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }        
    });

})(budgetController, UIController);
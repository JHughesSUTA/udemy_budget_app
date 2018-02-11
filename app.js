

var budgetController = (function() {
    
    var x = 23;
    var add = function(a) {
        return x + a; 
    }

    return {
        publicTest: function(b) {
            return add(b);
        } 
    }

})();



var UIController = (function() {

    // code goes here

})();

    
/* 
the two modules above are completely separate and there will never be interaction, because they need to be independant. If we wanted to create a more complex budget app, we can take the budget controller module and expand it, and not have to think of the UI controller. This is called SEPARATION OF CONCERNS.

But we need a way for them to connect, for example to read data from the UI, and add the data as a new expense in the budgetController, so we create the module below: 
*/

var controller = (function(budgetCtrl, UICtrl) {

    var z = budgetCtrl.publicTest(5);

    return {
        anotherPublic: function() {
            console.log(z);
        }
    }


})(budgetController, UIController);

/* we pass the other two modules as arguments, so that it knows about the other two modules and can connect them. In the above, we assign two arguments, and then when we immediately call the function, we use the other two modules as the arguments (for budgetCtrl, and UICtrl) -- they can technically be named the same thing. 

controller module has test data that will show '28' if we do 'controller.anotherPublic();' on the console. 
*/
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',       // element we want to select if we have income
        expensesContainer: '.expenses__list'      // element we want to select if we have expense
    }
    
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // Create HTML string with placholder text (from html file)
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);   // replace the placeholder text in above html with the id from the function constructor
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);  // 'beforeend' comes from insertAdjacentHTML method, look at documentation
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
        UICtrl.addListItem(newItem, input.type); // call addListItem method

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
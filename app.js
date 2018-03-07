// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    /*
    calculate percentage method added to prototype rather than function constructor above
    so any  objectes created through expense prototype will inherit the method
    */
    // calculates percentages
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    // returns percentages
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // created here because we want this part to be private
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {    // will contain all our public methods
        addItem: function(type, des, val) {
            var newItem, ID;

            // create new id ()
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // push it into our data structure
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;

        },

        deleteItem: function(type, id) {
            var ids, index;

            // create an array with all the id numbers that we have:
            // map also receives a callback function that has access to current element, current index and entire array
            // difference between map and forEach is that map returns a brand new array
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            // find the index the id we are looking for 
            index = ids.indexOf(id);  // will return -1 if it is not in the array

            if (index !== -1) {
                data.allItems[type].splice(index, 1); // splice(position number, # of elements we want to delete)
            }
        },

        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we've spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            // calculate percentage on each expense in the array 
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc); 
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;  
        },

        testing: function() {               // testing to see in console
            console.log(data);
        },
 
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    var formatNumber = function(num, type) {
        var numSPlit, int, dec, sign;
        // abs = absolute, gives absolute number (removes a negative). This line basically overrides the 'num' argument
        num = Math.abs(num);
        num = num.toFixed(2);       // gives the number two decimals, but as a string 
        numSplit = num.split('.')
        int = numSplit[0];

        if (int.length > 3) {
            // substr allows us to take just part of a string - first argument is where to start, 2nd is how many chars we want
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1]; 
        // type === 'exp' ? sign = '-' : sign = '+'
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    // moved here to make it accessible to other methods in this controller
    var nodeListForEach = function(list, callback) {  // receives a node list and callback function
        for (var i = 0; i < list.length; i++) {        // simply a for loop that calls the callback function with each iteration
            callback(list[i], i);     // (list[i], i) = (current, index): this passes the parameters into the callback function          
        }
    };  
    
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // Create HTML string with placholder text (from html file)
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {  // selectorID comes from itemID in 'ctrlDeleteItem'
            var el = document.getElementById(selectorID);
            // JS only lets us remove a child element, so we need to go up to the parent and then remove the child element from there
            el.parentNode.removeChild(el); 
        },

        //public method for clearing fields
        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";

                fieldsArr[0].focus();
            });
        },

        displayBudget: function(obj) {

            var type; 

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

         displayPercentages: function(percentages) {    // percentages argument is the percentage array that we have stored in the app controller
            // querySelectorAll in order to grab all of them rather than just the first, with 'querySelector'
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);   // this returns a 'node list' which can be iterated through

            nodeListForEach(fields, function(current, index) {      // use callback function with 'current, index', just like forEach but this time for a list
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },   

        displayMonth: function() {
            var now, month, months, year; 
            now = new Date();   // if we don't pass anything in, it will return todays date
            // var christmas = new Date(2018, 11, 25)  -- this would return christmas of this year, month is '0' based
            months = ['January', 'February', 'March', 'April', 'May',
                    'June', 'July', 'August', 'September', 'October',
                    'November', 'December']

            month = now.getMonth();
            year = now.getFullYear();     // 'getFullYear' will return the year
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' +  year;
        },

        changedType: function() {
            var fields;
            fields = document.querySelectorAll(         // this returns a node list
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');          // will toggle the 'red-focus' css class 
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');    // changes check icon to red when expense selected
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

        /* 
        What we want to grab here is the 'item__delete--btn', but there are multiple
        and some in both the income and expense sections.
        Since we want the handler to handle any of the buttons selected, we use event delagation
        and select the first common parent element 'container'
        */
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };


    var updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };


    var updatePercentages = function() {
        // 1. calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the user interface with new percentages
        UICtrl.displayPercentages(percentages);     // 'percentages' comes from step 2 above
    };


    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) { 
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the new item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. calculate and update percentages
            updatePercentages(); 

        } 
    };


    var ctrlDeleteItem = function(event) {          // 'event' argument needed so we know the target element, callback function of addEventListener always has access to the event object. comes from setupEventListeners in this case
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;      // parentNode needed for DOM Traversal

        if (itemID) {           // no 'id's used anywhere else on the app, so if there's an ID they would have clicked the 'x'
            splitID = itemID.split('-');     // splits the id to an array ('id-1' = [id, 1])x
            type = splitID[0];
            ID = parseInt(splitID[1]);      // get the ID and convert it to an integer

            // 1. Delete Item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete Item from UI
            UICtrl.deleteListItem(itemID);

            // 3. Updatate and show new budget
            updateBudget();

            // 4. calculate and update percentages
            updatePercentages();

        }

    };


    return  {
        init: function() {
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init(); 
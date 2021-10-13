const modelController = (function(){

    
    const Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    const Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function(totalIncome){
        return this.percentage;
    }
    
    function addItem(type, desc, value){
        let id, newItem;
        
        //Генерируем ID
        if(data.allItems[type].length > 0){
           const lastIndex = data.allItems[type].length - 1;

            id = data.allItems[type][lastIndex].id + 1;
        } else {
            id = 0;

        }



        //Создаем объект через конструктор в зависимости от типа записи
        if(type === "inc"){
            newItem = new Income(id, desc, parseFloat(value));
        } else if (type === "exp"){
            newItem = new Expense(id, desc, parseFloat(value));
        }
        

        //Записываем "запись" как объект в структуру данных
        data.allItems[type].push(newItem);
        
        return newItem;
        
    }

    function deleteItem(type, id){
        //inc, id-4
        //data.allItems[inc][item]

        //id = [1,2,4,11]
        //index = 2;


        //1. Найти запись по ID в массиве с доходами и расходами
        const ids = data.allItems[type].map(function(item){
            return item.id;
        });
        
        //Находим индекс записи
        index = ids.indexOf(id);

        //Удаляем запись по индексу из массива
        if(index != -1){
        data.allItems[type].splice(index, 1);
        }

        return deleteItem;

    }

    function calculateTotalSum(type){
        let sum = 0;

        data.allItems[type].forEach(function(item){
            sum = sum + item.value;
        })

        return sum;

    }

    function calculateBudget(){
        //Посчитать все доходы
        data.totals.inc = calculateTotalSum("inc");

        //Посчитать все расходы
        data.totals.exp = calculateTotalSum("exp");

        //Посчитать общий буюджет
        data.budget = data.totals.inc - data.totals.exp;


        //Посчитать % для расходов 
        if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
            data.percentage = -1;
        }
    }
    
    function getBudget(){
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
        }
    }
   
    function calculatePercentages(){

        data.allItems.exp.forEach(function(item){
            item.calcPercentage(data.totals.inc);
        });
    }

    function getAllIdsAndPercentages(){
        //[[0,15], [1,25], [2,50]]
        const allPerc = data.allItems.exp.map(function(item){
            return [item.id, item.getPercentage()];
        });

        return allPerc;
    }


    const data = {

        allItems: {
            inc: [],
            exp: []
        },

        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    }
    

    return {
        addItem: addItem,
        test: function(){
            console.log(data);
        },
        calculateBudget: calculateBudget,
        
        getBudget: getBudget,

        deleteItem: deleteItem,
        
        calculatePercentages: calculatePercentages,
        
        getAllIdsAndPercentages: getAllIdsAndPercentages
    }

})();




const controller = (function(budgetCtrl, uiCtrl){

    

    const setupEventListeners = function(){

        const DOM = uiCtrl.getDomStrings();
        document.querySelector(DOM.form).addEventListener("submit", ctrlAddItem);

        document.querySelector(DOM.budgetTable).addEventListener("click",ctrlDeleteItem)
    }

    //Обновляем проценты у каждой записи
    function updatePercentages(){

        //1. Посчитать проценты для каждой записи Expense
        budgetCtrl.calculatePercentages();
        budgetCtrl.test();


        //2. Получить данные по процентам из модели
        const idsAndPercents = budgetCtrl.getAllIdsAndPercentages();
        console.log(idsAndPercents)


        //3. Обновить UI
        uiCtrl.updateItemPercentages(idsAndPercents);

    }


    //Функция, которая срабатывает при отправке формы(submit)
    function ctrlAddItem(event){
        event.preventDefault();
        insertInUi();

        //1. Получить данные из формы
        const input = uiCtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){

            
            //2. Добавить полученные данные в модель
            const newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            budgetCtrl.test();
    
            //3. Добавить "запись" в UI на страницу
            uiCtrl.renderListItem(newItem, input.type);
            uiCtrl.clearFields();
    
            //4. Посчитать бюджет
            updateBudget();
            updatePercentages()
    
            //5. Отобразтить бюджет в UI
        }


    }

    function ctrlDeleteItem(event){

        let type, ID, itemID, splitID;
        
        if(event.target.closest(".item__remove")){

            //Находим ID, который надо удалить
            itemID = event.target.closest("li.budget-list__item").id;//inc-0
            
            splitID = itemID.split("-"); //[inc,0]
    
            type = splitID[0];
            ID = parseInt(splitID[1]);
    
            //Удаляем запись из модели
            budgetCtrl.deleteItem(type, ID);

            //Удаляем запись из шаблона
            uiCtrl.deleteListItem(itemID);

            //Пересчитываем бюджет
            updateBudget();
            updatePercentages();
            
       }
    }

    function updateBudget(){
        //1. Рассчитать бюджет в модели
        budgetCtrl.calculateBudget();

        //2. Получить рассчитанный бюджет из модели
       const budgetObj = budgetCtrl.getBudget();

        //3. Отобразить итог на сайте
        uiCtrl.updateBudget(budgetObj);
    }



    return {
        init: function(){
            console.log("app started");

            uiCtrl.displayMonth();
            setupEventListeners();

            uiCtrl.updateBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
        }
    }
    


})(modelController, viewController);

controller.init();
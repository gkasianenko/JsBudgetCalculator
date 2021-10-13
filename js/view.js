const viewController = (function(){
    
    const DOMstrings = {
        inputType: "#input__type",
        inputDescription: "#input__description",
        inputValue: "#input__value",
        form: "#budget-form",
        incomeContainer: "#income__list",
        expensesContainer: "#expenses__list",
        budgetLabel: "#budget-value",
        incomeLabel: "#income-label",
        expensesLabel: "#expense-label",
        expensesPercentLabel: "#expense-percent-value",
        budgetTable: "#budget-table",
        monthLabel: "#month",
        yearLabel: "#year"

    }

    function getInput(){
        return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
        }
    }

    function formatNumber(num, type){

        let numSplit, int, dec, newInt, resultNumber;
        //+ или - перед числом в зависимости от типа числа
        
        //приводим число по модулю
        num = Math.abs(num);
        //два знака после точки
        num = num.toFixed(2);

        numSplit = num.split(".");//45.78 = [45, 78]
        
        int = numSplit[0];//целая часть 45
        dec = numSplit[1];//десятичная часть 78

        //Расставляем запятые
        //Исходя из длины числа делим его на части по 3 цифры
        //Начиная с правой крайней цифры проставялем запятые каждые три цифры
        if(int.length > 3){
            newInt = "";

            for(let i = 0; i < int.length / 3; i++){
                //формируем новую строку с номером
                newInt = 
                //Добавляем запятую каждые 3 числа
                "," + 
                //Вырезанный кусок из исходной строки
                int.substring(int.length - 3 * (i + 1), int.length - 3*i) + 
                //Конец строки, правая часть
                newInt;

                

               
            }
            if(newInt[0] === ","){
                newInt = newInt.substring(1);
            }
        //если исходное число равно нулю    
        } else if (int === "0"){
            newInt = "0";
        //Если исходное число имеет 3 и меньше символов
        } else {
            newInt = int;
        }

        resultNumber = newInt + "." + dec;

        if(type === "exp"){
            resultNumber = "- " + resultNumber;
        } else if(type === "inc"){
            resultNumber = "+ " + resultNumber;
        }

        return resultNumber;

    }

    function renderListItem(object, type){
        let containerElement, html, newHtml;

        if(type === "inc"){
            containerElement = DOMstrings.incomeContainer;
            html = `<li id="inc-%id%" class="budget-list__item item item--income">
            <div class="item__title">%description%</div>
            <div class="item__right">
                <div class="item__amount">%value%</div>
                <button class="item__remove">
                    <img
                        src="./img/circle-green.svg"
                        alt="delete"
                    />
                </button>
            </div>
        </li>`;
        } else {
            containerElement = DOMstrings.expensesContainer;
            html = `<li id="exp-%id%"          class="budget-list__item item item--expense">
            <div class="item__title">%description%</div>
            <div class="item__right">
                <div class="item__amount">
                    %value%
                    <div class="item__badge">
                        <div class="item__percentage badge badge--dark">
                            15%
                        </div>
                    </div>
                </div>
                <button class="item__remove">
                    <img src="./img/circle-red.svg" alt="delete" />
                </button>
            </div>
        </li>`;
        }

        //Работаем серез placeholder
        newHtml = html.replace("%id%", object.id);
        newHtml = newHtml.replace("%description%", object.description);
        newHtml = newHtml.replace("%value%", object.value);
        


        document.querySelector(containerElement).insertAdjacentHTML("beforeEnd", newHtml);



    }

    function clearFields(){
        let inputDesc, inputValue;

        inputDesc = document.querySelector(DOMstrings.inputDescription);
        inputValue = document.querySelector(DOMstrings.inputValue);

        inputDesc.value = "";
        inputDesc.focus();
        inputValue = "";
    }

    function updateBudget(obj){
    
        let type;

        if(obj.budget > 0){
            type = "inc";
        } else {
            type = "exp";
        }

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, "exp");

        if(obj.percentage > 0){
        document.querySelector(DOMstrings.expensesPercentLabel).textContent = obj.percentage;
        } else {
            document.querySelector(DOMstrings.expensesPercentLabel).textContent = "--";
        }
        
        //      budget: data.budget,
    //         totalInc: data.totals.inc,
    //         totalExp: data.totals.exp,
    //         percentage: data.percentage--
    }

    function deleteListItem(itemID){
        document.getElementById(itemID).remove();
    }

    function updateItemPercentages(items){
        items.forEach(function(item){
            //example [0,26]

           const el = document.getElementById(`exp-${item[0]}`).querySelector(".item__percentage");
           
           if(item[1] >= 0){

                //меняем контент внутри бейджа с процентами
               el.textContent = item[1] + "%";
               el.parentElement.style.display = "block";
               
           } else {
               el.parentElement.style.display = "none";
           }


        })
    }

    function displayMonth(){
        let now, year, month;

        now = new Date();
        year = now.getFullYear();//2021
        month = now.getMonth();//индекс месяца, начиная с нуля(январь - 0)

        monthArr = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

        month = monthArr[month];

        document.querySelector(DOMstrings.monthLabel).innerText = month;
        document.querySelector(DOMstrings.yearLabel).innerText = year;
    }

    return {
        getInput: getInput,

        getDomStrings: function(){
            return DOMstrings;
        },

        renderListItem: renderListItem,

        clearFields: clearFields,

        updateBudget: updateBudget,

        deleteListItem: deleteListItem,

        updateItemPercentages: updateItemPercentages,

        displayMonth: displayMonth

    }



})();
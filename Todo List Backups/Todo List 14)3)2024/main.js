
const taskSection = document.querySelector(".task-section");
const taskInput = document.querySelector(".task-input");
const addButton = document.querySelector(".add-button");
const taskForm = document.querySelector(".task-form");

const tasks = {

};


const updateTasksObj = (checkboxContainerLabel, taskText) => {
    const keysArray = Object.keys(tasks);
    const lastKey = Number(keysArray[keysArray.length - 1]);
    const newKey = lastKey + 1;
    
    console.log(tasks.length);
    if (newKey){
        tasks[newKey] = [false, taskText];
        checkboxContainerLabel.parentElement.classList.add(newKey);
    } 
    else if (!tasks.length) {
        
        // console.log("im the culprite:)")
        tasks[0] = [false, taskText];
        checkboxContainerLabel.parentElement.classList.add("0");
    }
}

const deleteTask = (parentContainer, id) => {

    delete tasks[id];
    
    parentContainer.remove();

    localStorage.setItem("taskStorage",  JSON.stringify(tasks));
    const localStorageTasks = JSON.parse(localStorage.getItem("taskStorage"));
    // console.log(localStorageTasks);
}


const addTaskToDom = (taskChecked, taskText, fromReload) => {
    
    const taskContainer = document.createElement("div");
    const checkboxContainerLabel = document.createElement("label");
    const checkBoxInput = document.createElement("input");
    const checkMarkSpan = document.createElement("span");
    // box icon
    const boxIconX = document.createElement("box-icon");
    boxIconX.setAttribute("color","#f3c969");
    boxIconX.setAttribute("size","cssSize");
    boxIconX.setAttribute("name", "x");
    //==========


    taskContainer.classList.add("task-container");
    checkboxContainerLabel.classList.add("checkbox-container");
    checkBoxInput.type = "checkbox";
    checkBoxInput.checked = taskChecked;
    checkMarkSpan.classList.add("checkmark");

    
    
    // ==================== When boxIconX is clicked
    boxIconX.addEventListener("click", (event) => {
        
        parentContainer = event.currentTarget.parentElement;
        deleteTask(parentContainer, 
            parentContainer.classList[parentContainer.classList.length-1]);
    })
    //==================



    checkboxContainerLabel.textContent = taskText;
    checkboxContainerLabel.appendChild(checkBoxInput);
    checkboxContainerLabel.appendChild(checkMarkSpan);
    taskContainer.appendChild(checkboxContainerLabel);
    taskContainer.appendChild(boxIconX);
    taskSection.appendChild(taskContainer);
    
    //add to tasks object

    // PROBLEM IS HERE
    updateTasksObj(checkboxContainerLabel, taskText);
 

    // =================== When task is checked
    checkBoxInput.addEventListener("change", (event)=>{
        parentLabel = event.currentTarget.parentElement;
        parentLabel.style.textDecoration = event.currentTarget.checked 
        ? "line-through" : "none";

        const parentContainer = parentLabel.parentElement;

        if( tasks.hasOwnProperty(parentContainer.classList[parentContainer.classList.length-1])){
            tasks[parentContainer.classList[parentContainer.classList.length-1]][0]
            = event.currentTarget.checked;
            // console.log(tasks);
            addToLocalStorage(tasks);
        }
        

    })
    // ====================


}

//updates the tasks object as well as adding to local storage
const addToLocalStorage = (tasks) => {

    localStorage.setItem("taskStorage",  JSON.stringify(tasks));
    const localStorageTasks = JSON.parse(localStorage.getItem("taskStorage"));
    // console.log("localStorageTasks: " );
    // console.log(localStorageTasks);

}   

const loadTasks = () => {
    const localStorageTasks = JSON.parse(localStorage.getItem("taskStorage"));

    if (localStorageTasks){

        for(let key in localStorageTasks){
            addTaskToDom(localStorageTasks[key][0], localStorageTasks[key][1]); 
            console.clear();
            console.log("tasks: before");
            console.log(tasks);
            // tasks[key] = localStorageTasks[key]; ///!!!!!!!!!!!
            console.log("tasks: after");
            console.log(tasks);
        }
    }
}
loadTasks();


taskForm.addEventListener("submit", (event)=>{
    event.preventDefault();

    if (taskInput.value){
        addTaskToDom(false, taskInput.value);
        addToLocalStorage(tasks);
    }
})

console.log(tasks);





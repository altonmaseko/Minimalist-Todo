
const taskSection = document.querySelector(".task-section");
const taskInput = document.querySelector(".task-input");
const addButton = document.querySelector(".add-button");
const taskForm = document.querySelector(".task-form");

const sideFolders = document.querySelector(".side-folders");

const newFolderButton = document.querySelector(".new-folder-button");
const clearButton = document.querySelector(".clear-button");

const bottomMenu = document.querySelector(".bottom-menu");

let currentFolder = "default";

// NOTES: Structure of a task on dom
// There are multiple tasks in the <section class="task-section"> 
// which is the container for the whole list of tasks.
// A single task in parent child order:
// taskContainer [div]:
    //boxIconX [X Icon from boxicon website]
    //checkboxContainerLabel [label]
        //checkBoxInput [input of type checkbox]
        //checkMarkSpan [span]
    

const getFromLocalStorage = () => {
    const tasks = JSON.parse(localStorage.getItem(currentFolder));
    return tasks;
}

const deleteTask = (parentContainer, id) => {

    const tasks = getFromLocalStorage();
    delete tasks[id];
    
    parentContainer.remove();

    localStorage.setItem(currentFolder,  JSON.stringify(tasks));
    const localStorageTasks = JSON.parse(localStorage.getItem(currentFolder));
    // console.log(localStorageTasks);
}


const addTaskToDom = (taskChecked, taskText) => {
    
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
        const parentContainer = event.currentTarget.parentElement;
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
    

    // =================== When task is checked
    checkBoxInput.addEventListener("change", (event)=>{
        const parentLabel = event.currentTarget.parentElement;
        parentLabel.style.textDecoration = event.currentTarget.checked 
        ? "line-through" : "none";

        const parentContainer = parentLabel.parentElement;

        const tasks = getFromLocalStorage();

        if( tasks.hasOwnProperty(parentContainer.classList[parentContainer.classList.length-1])){
            tasks[parentContainer.classList[parentContainer.classList.length-1]][0]
            = event.currentTarget.checked;
            // console.log(tasks);
            addToLocalStorage(tasks, currentFolder);
        }
        

    })
    // ====================


}

//adding to local storage
const addToLocalStorage = (tasks, folder) => {

    localStorage.setItem(folder,  JSON.stringify(tasks));
    const localStorageTasks = JSON.parse(localStorage.getItem(folder));
    // console.log("localStorageTasks: " );
    // console.log(localStorageTasks);

}   
const clearTasksOnDom = () => {
    taskSection.textContent = "";
}

console.log(typeof localStorage.key(2));


//get tasks from current folder's local storage and load onto dom 
const loadTasks = () => {

    clearTasksOnDom();

    const localStorageTasks = getFromLocalStorage();

    if (localStorageTasks){
        for(let key in localStorageTasks){
            addTaskToDom(localStorageTasks[key][0], localStorageTasks[key][1]); 
        }
        
        let div = taskSection.firstElementChild;
        for (let key in localStorageTasks ){
            div.classList.add(`${key}`);
            console.log(div);
            div = div.nextElementSibling;
        }

    }
}
loadTasks();

console.log(localStorage.key(1));


const assignClassKeys = (event) => {

    //The tasks object stored in local storage has property and value.
    //The property is a number, and value is an array: [isChecked, task text].
    //We keep track of which property in the object belongs to which html element
    //by adding the property value (a number) as a class to one of the containers of
    //a single task. That container is checkboxContainerLabel. Refer to structure of 
    //a task in terms of parent and child at beginning comments of this script.

    const checkboxContainerLabel = taskSection.lastElementChild.querySelector(".checkbox-container");
    let tasks = getFromLocalStorage();
    
    if(!tasks){ tasks = {} }

    const keysArray = Object.keys(tasks);
    const lastKey = Number(keysArray[keysArray.length - 1]);
    const newKey = lastKey + 1;
    
    console.log(tasks.length);
    if (newKey){
        tasks[newKey] = [false, taskInput.value];
        checkboxContainerLabel.parentElement.classList.add(newKey);
    } 
    else if (!tasks.length) {
        
        // console.log("im the culprite:)")
        tasks[0] = [false, taskInput.value];
        checkboxContainerLabel.parentElement.classList.add("0");
    }

    return tasks;

}

taskForm.addEventListener("submit", (event)=>{

    event.preventDefault();
    if (taskInput.value){
        addTaskToDom(false, taskInput.value);
        
        const tasks = assignClassKeys(event);

        addToLocalStorage(tasks, currentFolder);

        taskInput.value = "";

    }
})


// FOLDERS

const deleteFromLocalStorage = (localStorageName) => {
    for (let i = 0; i < localStorage.length; i++){
        if (localStorageName === localStorage.key(i)){
            localStorage.removeItem(localStorage.key(i));
        }
    }
}

const addFolder = (folderName) => {

    currentFolder = folderName;

    const div = document.createElement("div");
    const p = document.createElement("p");
    const boxIconX = document.createElement("box-icon");

    div.classList.add("folder")
    div.setAttribute("data-folder-name", folderName);
    // console.log(div.getAttribute("data-folder-name"));

    div.addEventListener("click", (event) => {
        currentFolder = event.currentTarget.getAttribute("data-folder-name");


        //remove selected style from all folders
        let parentElement = event.currentTarget.parentElement;
        for (let i = 0; i < parentElement.children.length; i++) {
            let childElement = parentElement.children[i];
            childElement.classList.remove("folder-selected");
        }

        event.currentTarget.classList.add("folder-selected");


        loadTasks();
    })

    boxIconX.addEventListener("click", (event) => {

        if (confirm("This will PERMANENTLY delete the folder. Continue?")){
            const parent = event.currentTarget.parentElement;
            deleteFromLocalStorage(parent.getAttribute("data-folder-name"));
            parent.remove();
        }

        
    })
    
    boxIconX.setAttribute("color","#f3c969");
    boxIconX.setAttribute("size","cssSize");
    boxIconX.setAttribute("name", "x");

    div.textContent = folderName;
    div.appendChild(p);
    div.appendChild(boxIconX);

    sideFolders.appendChild(div);

    let parentElement = div.parentElement;
    for (let i = 0; i < parentElement.children.length; i++) {
        let childElement = parentElement.children[i];
        childElement.classList.remove("folder-selected");
    }
    for (let i = 0; i < parentElement.children.length; i++) {
        let childElement = parentElement.children[i];
        if (childElement.getAttribute("data-folder-name") === folderName){
            childElement.classList.add("folder-selected");
        }
    }

    loadTasks();

}

newFolderButton.addEventListener("click", event => {
    const folderName = prompt("Please enter folder name");
    if(!folderName){
        alert("Please enter a value");
        return;
    }
    addFolder(folderName);
})

const loadLocalStorageKeys = () => {
    for(let i = 0; i < localStorage.length; i++){
        addFolder(localStorage.key(i));
    }
}
loadLocalStorageKeys();




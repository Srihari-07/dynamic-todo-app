let inputTask = document.getElementById("taskinput")  // The main Task input field to enter the Tasks
let button = document.querySelector(".Button");        // Button to add the Tasks 
let Tasks = document.querySelector(".taskContainer");  // Container which displays all the added tasks.
let error = document.getElementById("errorMessage");   // The error which must be displayed when no task in entered.

let saveButton = document.createElement("input");       // A simple Save button to save the users Tasks in Local Storage.
saveButton.type = "button"; saveButton.value = "Save"; saveButton.id = "saveButton";
saveButton.classList.add("Button");
saveButton.style.position = "relative"; saveButton.style.left = "188px"; saveButton.style.top = "0px";

let saveMessage = document.createElement("p");         // A Save message for the indication of the user to Remember to Save his/her Tasks.
saveMessage.textContent = "Remember to Save Your Tasks"; saveMessage.id = "saveMessage";
saveMessage.classList.add("saveMessage");

inputTask.addEventListener('keydown', function(event){   // A simple Keyboard "Enter" button listener, so that user can add tasks even by hitting the Enter Button.
    if (event.key === 'Enter') {
        // triggers the "add task" button click if the "Enter" button on the keyboard is pressed.
        button.click();
    }
});

loadNoTasksMessage(true); // A Function which display's a message when no tasks are added by the user. Argument "true" displays where as argument "false" hiddes the message.

let savedTasks = [];  // Array using which we will be manipulating the user's tasks in runtime and later Save them.

 // Event lister function for Add tasks button. Executes when the user clicks on the "Add task" Button.
function handleClick(){

    let task = inputTask.value.trim(); // Gets the current (latest) value of the input field excluding any white spaces.
    if(task.length === 0){         // Display's the Error Message to indicate the user to enter a task when no task in entered in the inputfield.
        error.style.visibility = "visible";
    }

    else{       // Executes when the user enters a task in the inputField.
        loadNoTasksMessage(false);  // Removing the "No task added" message.
        error.style.visibility = "hidden";  // Also hidding the Error message if displayed.

        const taskHeading = Tasks.firstElementChild;  // Caching the Tasks Main Heading.
        taskHeading.textContent = "Your Tasks For Today!";  // Setting the content of the Heading

        const container = Tasks.querySelector("#itemContainer");  // Caching the task elements from the main Tasks container.  <ol> 

        let index = savedTasks.length;  // Storing the length of the Array for tracking the individual Task items

        // Here i am representing the individual tasks in the form of objects.
        savedTasks.push({taskName : task, Description : "", checkboxStatus : false});  // Adding the object of the task, which include it's Name, Description and its completion Status.
        

        // Individual task items (including TaskName, Description and CheckBox).
        let item = document.createElement("li");
        item.classList.add("tasks");
        item.innerHTML = `
        <strong class = "taskName"> ${task} </strong> 
        <br> 
        <textarea class ="taskDescription" placeholder="Any Description of the Task!" data-index="${index}"></textarea> 
        <input type = "checkbox" class = "checkBox" data-index="${index}">
        `
        container.appendChild(item);  // Appending the individual Task item in the container of Tasks.

        // Caching the Task Description element and Adding an event lister to it to keep track of Descriptions.
        let description = item.querySelector('.taskDescription');  
        description.addEventListener('input', saveDescription);

        // Caching the Task CheckBox element and Adding an event lister to it to keep track of Completion Status of tasks.
        let checkBox = item.querySelector('.checkBox');
        checkBox.addEventListener('change', checkTask);

        // CheckBox Logic 
        function checkTask() {
        const boxId = this.getAttribute('data-index');  // Caching the Specific User Selected checkbox using it's specific unique Data-index attribute.
        if (this.checked) {   // Styles to apply when a task is checked
            item.style.textDecoration = "line-through";
            item.style.textDecorationColor = "black";
            item.style.opacity = "0.5";

            description.style.textDecoration = "line-through";
            description.style.textDecorationColor = "black";
            description.style.opacity = "0.5";

            savedTasks[boxId].checkboxStatus = true;  // Updating the Completion Status of Task in it's object.
        }
        else {   // Styles to apply when a task is unchecked
            item.style.textDecoration = "none";
            item.style.opacity = "1";

            description.style.textDecoration = "none";
            description.style.opacity = "1";

            savedTasks[boxId].checkboxStatus = false;
        }
    }
        // Finally Appending the 2 elements (Save button and the Save Message) when the user start's adding Tasks.
        taskHeading.appendChild(saveButton);  // Appending the save Button to the header section of the Tasks
        taskHeading.appendChild(saveMessage); // Appending a save Message for the indication of the user to remember to save his/her tasks.

        inputTask.value = ""; // making the input field Empty for the user so that he/she can start adding next Tasks.

    }
}



// Event lister on Task Descriptions :
function saveDescription(){
    let i = this.getAttribute('data-index');
    savedTasks[i].Description = this.value;
}


// Saving the tasks to local storage
function saveTasks(){  // Runs when the "Save Button" is clicked

    // Checking if the user has checked the checkBox for removing the completed task.
    savedTasks = savedTasks.filter(taskobj => taskobj.checkboxStatus === false);  // filter() creates a new array based on the condition given. And i directly again assigning it to my original array.

   // Than adding the final savedTasks array to the local Storage after converting it to a String data type.
   if (typeof Storage !== "undefined"){
        localStorage.setItem('todoTasks', JSON.stringify(savedTasks)); // Approach here : I am trying to store all the objects of the user's tasks into a single key in LocalStorage.
        showNotification("Task Saved Successfully!", 3000);  // Shows a Pop notification. 
        
        // Reloading the page automatically, hence making everthing up to date.
        setTimeout(() => {
            window.location.reload();
        }, 3000); 
   }
   else{
    console.log("Sorry, your browser does not support web storage."); // Message if by chance (Rarely) the local Storage is not supported by the user's browser.
   }
}

// Function Responsible for Displaying "No Tasks Added" Message.
function loadNoTasksMessage(input){
    let noTaskMessage = document.getElementById("noTaskMessage");
    if(input){
        if (!noTaskMessage) {  // Only create if it doesn't already exist
            noTaskMessage = document.createElement("p");
            noTaskMessage.textContent = "No Tasks Added!";
            noTaskMessage.id = "noTaskMessage";
            noTaskMessage.classList.add("noTaskMessage");
            document.body.appendChild(noTaskMessage);
        }
    }
    else{
        if (noTaskMessage) { // Only remove if it exists
            noTaskMessage.remove();
        }
    }
}

// Function to Notify the user when task's are added or Removed from the Local Storage. (Executes when "Save" button is clicked)
function showNotification(message, duration = 2000) {
    const notification = document.getElementById("notificationBanner");
    const messageBox = notification.querySelector("p");
    const progressBar = notification.querySelector(".progress-bar");
  
    messageBox.textContent = message;
  
    // Reset any previous state
    notification.classList.remove("hidden");
    notification.classList.add("show");

    progressBar.style.animation = "none";
    void progressBar.offsetWidth; // Force reflow to restart animation
    progressBar.style.animation = `progressAnimation ${duration}ms linear forwards`;
  
    // Hiding after duration (Logic to show the Animation of the notification pop up)
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.classList.add("hidden");
      }, 2000); 
    }, duration);
     
  }


// Loading the Tasks back from the Local Storage. Logic to Display all Stored Tasks to the user from the Local Storage.
function loadTasksFromStorage() {
    if (typeof Storage !== "undefined") {
        let storedTasks = localStorage.getItem('todoTasks');  // Returns the String data type of the Task object's array.

        if (storedTasks) {
            loadNoTasksMessage(false);
            
            savedTasks = JSON.parse(storedTasks);   // converting the String back to the original Array and putting back it to the original Array (savedTasks) for further manipaulations.

            if(savedTasks.length !== 0){
                // Rebuilding the DOM for showing the Already Saved Tasks.
                const container = Tasks.querySelector("#itemContainer"); 
                const taskHeading = Tasks.firstElementChild;
                taskHeading.textContent = "Your Tasks For Today!";
                taskHeading.appendChild(saveButton);
                taskHeading.appendChild(saveMessage);

                savedTasks.forEach((taskObj, index) => {  // rebuilding the individual Tasks on the DOM.
                    let item = document.createElement("li");
                    item.classList.add("tasks");
                    item.innerHTML = `
                        <strong class = "taskName">${taskObj.taskName}</strong>
                        <br>
                        <textarea class="taskDescription" placeholder="Any Description of the Task!" data-index="${index}">${taskObj.Description}</textarea>
                        <input type="checkbox" class="checkBox" data-index="${index}"  ${taskObj.checkboxStatus ? 'checked' : ''}>
                    `;

                    container.appendChild(item); // Once Again Appending the Task object (item here).

                    let description = item.querySelector('.taskDescription');  // Again an event listener on Description.
                    description.addEventListener('input', saveDescription);

                    let checkBox = item.querySelector('.checkBox');  // Again an event listener on CheckBox
                    checkBox.addEventListener('change', checkTask);

                    // CheckBox logic on the retrival of the Tasks from the local Storage. (similar as before)
                    function checkTask() {
                        const index = this.getAttribute('data-index');
                        savedTasks[index].checkboxStatus = this.checked;

                        if (checkBox.checked) {
                            item.style.textDecoration = "line-through";
                            item.style.textDecorationColor = "black";
                            item.style.opacity = "0.5";

                            description.style.textDecoration = "line-through";
                            description.style.textDecorationColor = "black";
                            description.style.opacity = "0.5";
                        } else {
                            item.style.textDecoration = "none";
                            item.style.opacity = "1";

                            description.style.textDecoration = "none";
                            description.style.opacity = "1";
                        }  
                    };
                });
            }
            else{
                loadNoTasksMessage(true); // If the Array in the local storage found Empty, than the message "No Task Added" will be displayed.
            }    
        }     
    }
    else{
        console.log("No Key in the Local Storage");  // it is just for readiablity of the code and there is no actual use in the application.
    }
}

// Basic Event listerners of the application.
button.addEventListener('click', handleClick); // Handles Click event of the "Add Task" button
saveButton.addEventListener('click', saveTasks); // Handles Click event of the "Save Task" button

window.onload = loadTasksFromStorage;  // This Loads the Tasks Stored in the local Storage back to the user when the Page is reloaded or refreshed.


// And if you have taken your valuable time to read my code than Thank You so much. 
// Please do let me know how it is on Twitter, it will mean alot to me. 
// Please do Provide your valuable feedback of any kind, it will help me grow!
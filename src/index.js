let tasks = [];

function search() {
  const input = document.getElementById('search');
  const searchString = input.value.toUpperCase();
  let rows = document.getElementsByClassName('list-group-item');
  // Loop through all list items, and hide those who don't match the search query
  for (let taskRow of rows) {
    let taskText = taskRow.getElementsByClassName('task-text')[0].textContent;
    if (taskText.toUpperCase().indexOf(searchString) > -1) {
      taskRow.style.display = '';
    } else {
      taskRow.style.display = 'none';
    }
  }
}

function addEventListeners() {
  // Add Task
  document.getElementById('addTask').addEventListener('keypress', event => {
    if (event.code === 'Enter') {
      addTask(event.target.value);
      event.target.value = '';
    }
  });
}

function addTaskClick() {
  let target = document.getElementById('addTask');
  addTask(target.value);
  target.value = '';
}

function addTask(task) {
  let newTask = {
    task,
    isComplete: false,
  };
  let parentDiv = document.getElementById('addTask').parentElement;
  if (task === '') {
    parentDiv.classList.add('has-error');
  } else {
    parentDiv.classList.remove('has-error');
    tasks.push(newTask);
    saveTasks();
    displayTasks();
  }
}

function toggleTaskStatus(index) {
  tasks[index].isComplete = !tasks[index].isComplete;
  saveTasks();
  displayTasks();
}

function deleteTask(event, taskIndex) {
  event.preventDefault();
  tasks.splice(taskIndex, 1);
  saveTasks();
  displayTasks();
}

function generateTaskHtml(task, index) {
  return `
        <li class="list-group-item">
          <div class="row">
            <div class="col-md-1 col-xs-1 col-lg-1 col-sm-1 form-check form-inline">
              <input id="toggleTaskStatus" type="checkbox" onchange="toggleTaskStatus(${index})" value="" class="" ${task.isComplete ? 'checked' : ''}>
            </div>
            <div class="col-md-10 col-xs-10 col-lg-10 col-sm-10 task-text">
              ${task.task}
            </div>
            <div class="col-md-1 col-xs-1 col-lg-1 col-sm-1 delete-icon-area">
              <a class="" href="/" onClick="deleteTask(event, ${index})">
              <i id="deleteTask" data-id="${index}" class="delete-icon fa fa-trash-o"></i>
              </a>
            </div>
          </div>
        </li>
      `;
}

function saveTasks() {
  localStorage.setItem('TASKS', JSON.stringify(tasks));
}

function fetchTasks() {
  const data = localStorage.getItem('TASKS');
  if (data === null) {
    tasks = JSON.parse(data);
  }
}

function displayTasks() {
  const toDoTaskList = document.getElementById('toDoTaskList');
  const completedTaskList = document.getElementById('completedTaskList');
  toDoTaskList.innerHTML = '';
  completedTaskList.innerHTML = '';
  tasks.forEach((task, index) => {
    if (task.isComplete) {
      completedTaskList.innerHTML += generateTaskHtml(task, index);
    } else {
      toDoTaskList.innerHTML += generateTaskHtml(task, index);
    }
  });
}

fetchTasks();
displayTasks();
addEventListeners();

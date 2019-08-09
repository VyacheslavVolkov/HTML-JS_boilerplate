let tasks = [];

//start sorting dropdown functionality
let sortOpenOptions = [
  {
    text: 'Text (asc)',
    sortFunction: (item1, item2) => item1.task.task.localeCompare(item2.task.task),
  },
  {
    text: 'Text (desc)',
    sortFunction: (item1, item2) => item2.task.task.localeCompare(item1.task.task),
  },
  {
    text: 'Creation date (asc)',
    sortFunction: (item1, item2) => new Date(item1.task.creationDate) - new Date(item2.task.creationDate),
  },
  {
    text: 'Creation date (desc)',
    sortFunction: (item1, item2) => new Date(item2.task.creationDate) - new Date(item1.task.creationDate),
  },
];
let sortDoneOptions = [
  {
    text: 'Text (asc)',
    sortFunction: (item1, item2) => item1.task.task.localeCompare(item2.task.task),
  },
  {
    text: 'Text (desc)',
    sortFunction: (item1, item2) => item2.task.task.localeCompare(item1.task.task),
  },
  {
    text: 'Completion date (asc)',
    sortFunction: (item1, item2) => new Date(item1.task.completionDate) - new Date(item2.task.completionDate),
  },
  {
    text: 'Completion date (desc)',
    sortFunction: (item1, item2) => new Date(item2.task.completionDate) - new Date(item1.task.completionDate),
  },
];
let sortOpen = 0;
let sortDone = 0;

function changeSortOpen() {
  sortOpen = document.getElementById('sortOpen').value;
  saveSortOpen();
  displaySortOptions('sortOpen', sortOpenOptions, sortOpen);
  displayTasks();
}

function changeSortDone() {
  sortDone = document.getElementById('sortDone').value;
  saveSortDone();
  displaySortOptions('sortDone', sortDoneOptions, sortDone);
  displayTasks();
}

function displaySortOptions(dropDown, options, selection) {
  console.log(selection);
  const selector = document.getElementById(dropDown);
  selector.options.length = 0;
  options.forEach((option, index) => {
    const element = document.createElement('option');
    element.text = option.text;
    if (index === parseInt(selection)) {
      element.setAttribute('selected', 'selected');
    }
    element.value = index;
    selector.add(element);
  });
}

//end sorting dropdown functionality

//start search functionality
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

//end search functionality

//start task management functions
function addTaskInput(event) {
  if (event.code === 'Enter') {
    addTask(event.target.value);
    event.target.value = '';
  }
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
    creationDate: new Date(),
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
  let task = tasks[index];
  if (task.isComplete) {
    task.completionDate = undefined;
    task.isComplete = false;
  } else {
    task.completionDate = new Date();
    task.isComplete = true;
  }
  saveTasks();
  displayTasks();
}

function deleteTask(taskIndex) {
  tasks.splice(taskIndex, 1);
  saveTasks();
  displayTasks();
  return false;
}

function changeText(element, index) {
  let input = document.createElement('input');
  input.setAttribute('onkeypress', `submitText(this, event, ${index})`);
  input.value = element.innerHTML;
  element.parentNode.replaceChild(input, element);
}

function submitText(ele, event, index) {
  if (event.keyCode === 13) {
    tasks[index].task = ele.value;
    saveTasks();
    displayTasks();
  }
}

//end task management functions

//start local storage communication
function saveTasks() {
  localStorage.setItem('TASKS', JSON.stringify(tasks));
}

function saveSortOpen() {
  localStorage.setItem('SORT_OPEN', sortOpen);
}

function saveSortDone() {
  localStorage.setItem('SORT_DONE', sortDone);
}

function fetchData() {
  const data = localStorage.getItem('TASKS');
  if (data !== null) {
    tasks = JSON.parse(data);
  }
  const sortOpenData = localStorage.getItem('SORT_OPEN');
  if (sortOpenData !== null) {
    sortOpen = sortOpenData;
  }
  const sortDoneData = localStorage.getItem('SORT_DONE');
  if (sortDoneData !== null) {
    sortDone = sortDoneData;
  }
}

//end local storage communication

//start tasks display functionality
function generateTaskHtml(task, index) {
  return `
        <li class="list-group-item">
          <div class="row">
            <div class="col-md-1 col-xs-1 col-lg-1 col-sm-1 form-check form-inline">
              <input id="toggleTaskStatus" type="checkbox" onchange="toggleTaskStatus(${index})" value="" class="" ${
    task.isComplete ? 'checked' : ''
  }>
            </div>
            <div class="col-md-10 col-xs-10 col-lg-10 col-sm-10 task-text">
              <span ondblclick="changeText(this, ${index})">${task.task}</span>
            </div>
            <div class="col-md-1 col-xs-1 col-lg-1 col-sm-1 delete-icon-area">
              <a class="" href="/" onClick="return deleteTask(${index});">
              <i id="deleteTask" data-id="${index}" class="delete-icon fa fa-trash-o"></i>
              </a>
            </div>
          </div>
        </li>
      `;
}

function displayTasks() {
  const toDoTaskList = document.getElementById('toDoTaskList');
  const completedTaskList = document.getElementById('completedTaskList');
  toDoTaskList.innerHTML = '';
  completedTaskList.innerHTML = '';
  let completedTasks = [];
  let toDoTasks = [];
  tasks.forEach((task, index) => {
    if (task.isComplete) {
      completedTasks.push({ task: task, index: index });
    } else {
      toDoTasks.push({ task: task, index: index });
    }
  });
  toDoTasks.sort(sortOpenOptions[sortOpen].sortFunction);
  // completedTasks.sort(sortDoneOptions[sortDone].sortFunction);
  toDoTasks.forEach(taskWrapper => {
    toDoTaskList.innerHTML += generateTaskHtml(taskWrapper.task, taskWrapper.index);
  });
  completedTasks.forEach(taskWrapper => {
    completedTaskList.innerHTML += generateTaskHtml(taskWrapper.task, taskWrapper.index);
  });
}

//end task display functionality

fetchData();
displaySortOptions('sortOpen', sortOpenOptions, sortOpen);
displaySortOptions('sortDone', sortDoneOptions, sortDone);
displayTasks();
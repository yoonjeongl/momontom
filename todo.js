const toDoList = document.getElementById("js-toDo"),
  doneList = document.getElementById("js-done"),
  toDoForm = document.getElementById("js-form"),
  toDoInput = toDoForm.querySelector("input");

const PENDING = "PENDING";
const FINISHED = "FINISHED";

let toDoTasks, doneTasks;

function getTaskObject(text) {
  return {
    id: String(Date.now()),
    text
  };
}

function saveToDoTask(task) {
  toDoTasks.push(task);
}

function findInDone(taskId) {
  return doneTasks.find(function(task) {
    return task.id === taskId;
  });
}

function findInToDo(taskId) {
  return toDoTasks.find(function(task) {
    return task.id === taskId;
  });
}

function removeFromToDo(taskId) {
  toDoTasks = toDoTasks.filter(function(task) {
    return task.id !== taskId;
  });
}

function removeFromDone(taskId) {
  doneTasks = doneTasks.filter(function(task) {
    return task.id !== taskId;
  });
}

function addToDone(task) {
  doneTasks.push(task);
}

function addToToDo(task) {
  toDoTasks.push(task);
}

function deleteTask(e) {
  const li = e.target.parentNode;
  li.parentNode.removeChild(li);
  removeFromDone(li.id);
  removeFromToDo(li.id);
  saveState();
}

function handleDoneClick(e) {
  const li = e.target.parentNode;
  li.parentNode.removeChild(li);
  const task = findInToDo(li.id);
  removeFromToDo(li.id);
  addToDone(task);
  paintDoneTask(task);
  saveState();
}

function handleBackClick(e) {
  const li = e.target.parentNode;
  li.parentNode.removeChild(li);
  const task = findInDone(li.id);
  removeFromDone(li.id);
  addToToDo(task);
  paintToDoTask(task);
  saveState();
}

function buildList(task) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const deleteBtn = document.createElement("button");
  span.innerText = task.text;
  deleteBtn.innerText = "❌";
  deleteBtn.addEventListener("click", deleteTask);
  li.append(span, deleteBtn);
  li.id = task.id;
  return li;
}

function paintToDoTask(task) {
  const buildDefaultList = buildList(task);
  const completeBtn = document.createElement("button");
  completeBtn.innerText = "✅";
  completeBtn.addEventListener("click", handleDoneClick);
  buildDefaultList.append(completeBtn);
  toDoList.append(buildDefaultList);
}

function paintDoneTask(task) {
  const buildDefaultList = buildList(task);
  const backBtn = document.createElement("button");
  backBtn.innerText = "⏪";
  backBtn.addEventListener("click", handleBackClick);
  buildDefaultList.append(backBtn);
  doneList.append(buildDefaultList);
}

function saveState() {
  localStorage.setItem(PENDING, JSON.stringify(toDoTasks));
  localStorage.setItem(FINISHED, JSON.stringify(doneTasks));
}

function loadState() {
  toDoTasks = JSON.parse(localStorage.getItem(PENDING)) || [];
  doneTasks = JSON.parse(localStorage.getItem(FINISHED)) || [];
}

function restoreState() {
  toDoTasks.forEach(function(task) {
    paintToDoTask(task);
  });
  doneTasks.forEach(function(task) {
    paintDoneTask(task);
  });
}

function handleFormSubmit(event) {
  event.preventDefault();
  const taskObj = getTaskObject(toDoInput.value);
  toDoInput.value = "";
  paintToDoTask(taskObj);
  saveToDoTask(taskObj);
  saveState();
}

function init() {
  toDoForm.addEventListener("submit", handleFormSubmit);
  loadState();
  restoreState();
}
init();

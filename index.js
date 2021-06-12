const form = document.querySelector(".js-form"),
    input = form.querySelector("input"),
    greeting = document.querySelector(".js-greetings"),
    clockContainer = document.querySelector(".js-clock"),
    clockTitle = clockContainer.querySelector("h1");

const USER_LS = "currentUser",
SHOWING_CN = "showing";

const weather = document.querySelector(".js-weather");
const API_KEY = "0af4719b1ab974c2d779438b5c6bd191";
const COORDS = "coords";

const toDoForm = document.querySelector(".js-toDoForm"),
toDoInput = toDoForm.querySelector("input"),
toDoAsk = document.querySelector(".js-toDoAsk"),
toDoList = document.querySelector(".js-toDoList"),
doneList = document.querySelector(".js-doneList"),
toDoArea = document.querySelector(".js-toDoArea");

const TODO = "TODO";
const DONE = "DONE";

let toDoTasks, doneTasks;

// ----------------------------------------------- get time -------------------------------------------------------- //
function getTime(){
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    clockTitle.innerText = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

// -------------------------------- greetings ----------------------------------- // 
function saveName(text){
    localStorage.setItem(USER_LS, text);
}

function handleNameSumit(e){
    //e.preventDefault();
    const currentValue = input.value;
    paintGreeting(currentValue);
    saveName(currentValue);
}

function askForName(){
    form.classList.add(SHOWING_CN);
    form.addEventListener("submit", handleNameSumit);
}

function paintGreeting(text){
    const date = new Date();
    const nowH = date.getHours();

    form.classList.remove(SHOWING_CN);
    greeting.classList.add(SHOWING_CN);

    if (nowH >= 18)
    {
        greeting.innerText = `Gentle night, ${text}`;
    }
    else if (nowH >= 12 && nowH < 18 ){
        greeting.innerText = `Good afternoon, ${text}`;
    }
    else if (nowH > 5 && nowH < 12){
        greeting.innerText = `Calm morning, ${text}`;
    }
    else {
        greeting.innerText = `Soft dawn, ${text}`;
    }

}

function loadName(){
    const currentUser = localStorage.getItem(USER_LS);
    if( currentUser === null ){
        // she is not
        askForName();
        hideTodos();
    } else{
        // she is
        paintGreeting(currentUser);
        loadCoords();
        getTime();
        setInterval(getTime, 1000);
        toDoAsk.innerText = "Tell me what you're gonna do today: ";
        loadState();
        restoreState();
        toDoForm.addEventListener("submit", handleToDoSubmit);
    }
}

// ------------------------------------ get weather after login ---------------------------------------//
function getWeather(lat, lng){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
    ).then(function(response){
        return response.json();
        })
        .then(function(json){
            const temperature = json.main.temp;
            const place = json.name;
            weather.innerText = `< Now > \n ${temperature}ºC \n @${place}`
        });
}
function saveCoords(coordsObj){
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}
function handleGeoSuccess(position){
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
        latitude,
        longitude
    };
    saveCoords(coordsObj);
    getWeather(latitude, longitude);
}

function handleGeoError(){
    console.log("Can't get the weather information");
}
function askForCoords(){
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}

function loadCoords() {
    const loadedCoords = localStorage.getItem(COORDS);
    if(loadedCoords === null){
        askForCoords();
    }else{
        // getWeather
        const parsedCoords = JSON.parse(loadedCoords);
        getWeather(parsedCoords.latitude, parsedCoords.longitude);
    }
}

// ---------------------------- ToDo Actions ------------------------
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
    const delList = document.createElement("del");
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
    localStorage.setItem(TODO, JSON.stringify(toDoTasks));
    localStorage.setItem(DONE, JSON.stringify(doneTasks));
  }
  
  function loadState() {
    toDoTasks = JSON.parse(localStorage.getItem(TODO)) || [];
    doneTasks = JSON.parse(localStorage.getItem(DONE)) || [];
  }
  
  function restoreState() {
    toDoTasks.forEach(function(task) {
      paintToDoTask(task);
    });
    doneTasks.forEach(function(task) {
      paintDoneTask(task);
    });
  }
  
  function handleToDoSubmit(event) {
    event.preventDefault();
    const taskObj = getTaskObject(toDoInput.value);
    toDoInput.value = "";
    paintToDoTask(taskObj);
    saveToDoTask(taskObj);
    saveState();
  }

function hideTodos(){
    toDoForm.remove(input);
    toDoArea.style.display = 'none';
}

function init(){
    loadName();
}

init();

document.addEventListener('DOMContentLoaded',function(){
    fetch('http://'+ip+':'+port+'/getAll')
    .then(response => response.json())
    .then(data => loadHTML(data['data']));
});
const log = document.getElementById("debug");
const message = document.getElementById("message");
const addBut = document.getElementById("addBut");

const nameInput = document.getElementById("user");
const passInput = document.getElementById("password");

nameInput.addEventListener("change", (event) => {
    message.innerHTML="";
});
passInput.oninput = (event) => {
    message.innerHTML="";
};

addBut.onclick = async function (){
    const nameInput = document.getElementById("user");
    const name = nameInput.value;
    //nameInput.value="";
    //alert(name);
    await fetch("http://"+ip+":"+port+"/insertUser",{
        headers:{
            'Content-Type': 'application/json',
            //'Access-Control-Allow-Origin':'*',
            //'Access-Control-Allow-Credentials': 'true',
            //'Access-Control-Allow-Methods': 'GET,POST',
            //'Access-Control-Allow-Headers': 'x-requested-with,content-type',
        },
        method: 'POST',
        body: JSON.stringify({ name: name})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

const loginBut = document.getElementById("loginBut");
loginBut.onclick = async function (){
    const name = nameInput.value;
    const pass = passInput.value;
    //nameInput.value="";
    //alert(name);
    if (IsLoginVaild()){
        await fetch("http://"+ip+":"+port+"/login",{
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ name: name, pass: pass})
        })
        .then(response => response.json())
        .then(data => login(data['data']));
    }else{
        message.innerHTML=Message.LOGIN_IS_EMPTY;
    }
    
}

function insertRowIntoTable(data){
    console.log(data.success);
}
function login(data){
    //console.log(data.data[0].name);
    if(data.success){
        message.innerHTML=formatString(Message.LOGIN_WELCOME_F,JSON.parse(data.data).name);
        sessionStorage.setItem("currentUser", data.data);
        //console.log(JSON.parse(sessionStorage.getItem("currentUser")).name+"--"+data.data);
        window.location.href = mainPage;
    }else{
        message.innerHTML=Message.LOGIN_ISNOT_MATCH;
    }
}

function loadHTML(data){
    
    console.log(data);
    if(data.length === 0){
        message.innerHTML = "<div>no data</div>";
        return;
    }
    let tableHtml = "";
    data.forEach(function ({user,pass,position,level,createDate}){
        tableHtml += user + ", "+pass + ", "+position + ", "+level + ", "+new Date(createDate).toLocaleDateString();
    });
    log.innerHTML=tableHtml;
}

function IsLoginVaild(){
    const name = nameInput.value;
    const pass = passInput.value;
    return user != "" && pass != "";
}



//console.log(JSON.stringify(columns));
fetch("http://"+ip+":"+port+"/createTable",{
    headers:{
        'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ table: "cases", columns:columns})
})
.then(response => response.json())
.then(data => {console.log(data);});
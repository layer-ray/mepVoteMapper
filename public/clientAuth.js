const loginForm = document.getElementById('loginForm');
const updateMepsBtn = document.getElementById('updateMeps');
const updateRcvsBtn = document.getElementById('updateRcvs');
const updateTextsBtn = document.getElementById('updateTexts');
const createGroupsBtn = document.getElementById('createGroups'); 
const logoutBtn = document.getElementById('logout');
const logPanel = document.getElementById('logPanel');

const baseUrl = "https://mep-vote-mapper.herokuapp.com";

function submitForm (){
    
    const formData = new FormData(loginForm);
    // to avoid handling multipart on backend
    let jsonFormObj = {};
    for (v of formData) {
        jsonFormObj[v[0]] = v[1];
    }

    const reqUrl = baseUrl + "/direct-login"
    const reqOpt = {
        method: 'post',
        headers: {'content-type':'application/json'},
        body: JSON.stringify(jsonFormObj)
    };

    fetch(reqUrl, reqOpt)
        .then(res => res.json())
        .then(data => {
            if(data.error){
                console.error(data.error);
            } else {
                window.location.href = baseUrl + "/dashboard";
            };
        });
};

function updateMeps () {
    fetch(baseUrl + '/update-meps')
        .then(logData);
};

function updateRcvs () {
    fetch(baseUrl + '/update-rcvs')
        .then(logData);
};

function updateTexts () {
    fetch(baseUrl + '/update-texts')
        .then(logData);
};

function createGroups() {
    fetch(baseUrl + '/create-groups')
        .then(logData);  
}

function logout() {
    fetch(baseUrl + '/logout')
        .then(logData)
        .then(() => 
            window.location.replace(baseUrl)
        );
}

function logData(res) {
    res.json()
        .then(data => {
            return data.error
                ? displayMsg(data.error)
                : displayMsg(data.message);
        });        
};

function displayMsg(msg) {
    const logEntry = document.createElement('div');

    const logTime = document.createElement('time');    
    const logMsg = document.createElement('p');

    const currentTime = new Date().toISOString();
    const rebuiltStr = currentTime.replace('T', '<br/>');
    logTime.innerHTML = rebuiltStr;
    logMsg.innerHTML = msg;
    
    logEntry.classList.add('entry');
    logEntry.appendChild(logTime);
    logEntry.appendChild(logMsg);

    logPanel.appendChild(logEntry);
}

updateMepsBtn.addEventListener('click', updateMeps);
updateRcvsBtn.addEventListener('click', updateRcvs);
updateTextsBtn.addEventListener('click', updateTexts);
createGroupsBtn.addEventListener('click', createGroups);
logoutBtn.addEventListener('click', logout);
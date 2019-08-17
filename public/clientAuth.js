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
        .then(res => res.json())
        .then(data => displayMsg(data));
};

function updateRcvs () {
    fetch(baseUrl + '/update-rcvs')
        .then(res => res.json())
        .then(data => displayMsg(data));
};

function updateTexts () {
    fetch(baseUrl + '/update-texts')
        .then(res => res.json())
        .then(data => displayMsg(data));
};

function createGroups() {
    fetch(baseUrl + '/create-groups')
        .then(res => res.json())
        .then(data => displayMsg(data));    
}

function logout() {
    fetch(baseUrl + '/logout')
        .then(res => res.json())
        .then( data => {
            data.error
                ? displayMsg(data.error)
                : displayMsg(data.message);

        window.location.replace(baseUrl);
        })
}

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
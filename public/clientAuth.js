const loginForm = document.getElementById('loginForm');
const updateMepsBtn = document.getElementById('updateMeps');
const updateRcvsBtn = document.getElementById('updateRcvs');
const updateTextsBtn = document.getElementById('updateTexts');
const createGroupsBtn = document.getElementById('createGroups'); 

function submitForm (){
    
    const formData = new FormData(loginForm);
    // to avoid handling multipart on backend
    let jsonFormObj = {};
    for (v of formData) {
        jsonFormObj[v[0]] = v[1];
    }

    const reqUrl = "http://localhost/direct-login"
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
                localStorage.setItem('auth', data.fetchResponse);
                window.location.href = "http://localhost/dashboard";
            };
        });
};

function updateMeps () {
    fetch('http://localhost/update-meps')
        .then(res => res.json())
        .then(data => console.log('data', data));
};

function updateRcvs () {
    fetch('http://localhost/update-rcvs')
        .then(res => res.json())
        .then(data => console.log('data', data));
};

function updateTexts () {
    fetch('http://localhost/update-texts')
        .then(res => res.json())
        .then(data => console.log('data', data));
};

function createGroups() {
    fetch('http://localhost/create-groups')
        .then(res => res.json())
        .then(data => console.log('data', data));    
}

updateMepsBtn.addEventListener('click', updateMeps);
updateRcvsBtn.addEventListener('click', updateRcvs);
updateTextsBtn.addEventListener('click', updateTexts);
createGroupsBtn.addEventListener('click', createGroups);
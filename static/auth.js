// Requires submit.js

let tokenLookup = 'user-token';
let electionIdLookup = 'election-id';

function loadToken() {
  let token = sessionStorage.getItem(tokenLookup);
  return token;
}

function loadElectionId() {
  let electionId = sessionStorage.getItem(electionIdLookup);
  return electionId;
}

function setTokenAndId(token, electionId) {
  sessionStorage.setItem(tokenLookup, token);
  sessionStorage.setItem(electionIdLookup, electionId);
}

async function obtainUserId(electionId, email, passcode) {
  let body = {
    'electionId': electionId, 'email': email, 'passcode': passcode
  };
  let response = await postJSONData('/', body, false);
  return response.ok ? response.user_id : 0;
}

async function obtainToken(userId, passcode) {
  let body = {
    'username': userId, 'password': passcode
  };
  let response = await postJSONData('/auth', body, false);
  return response.ok ? response.access_token : '';
}

async function authenticate(path, formId) {
  let form = document.forms[formId];
  // TODO: Form validation
  let electionId = form['election-id'].value;
  let passcode = form['passcode'].value;
  let email = form['email'].value;
  let userId = await obtainUserId(electionId, email, passcode);
  if (userId === 0) {
    alert('Invalid Data');
    return;
  }
  let token = await obtainToken(userId, passcode);
  if (token) {
    setTokenAndId(token, electionId);
    redirect(path);
  } else {
    alert('Invalid Data');
  }
}

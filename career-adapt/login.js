// JavaScript source code

const txtEmail = document.getElementById("txtEmail");
const txtPassword = document.getElementById("txtPassword");
const btnLogin = document.getElementById("btnLogin");
const btnSignUp = document.getElementById("btnSignUp");
const btnLogout = document.getElementById("btnLogout");
const labelLoginMessage = document.getElementById("loginMessage");
const labelErrorLoginMessage = document.getElementById("errorLoginMessage");
const manageContent = document.getElementById("manage-content");
const accountMessage = document.getElementById("account-message");

function pressLogin() {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => {
        labelErrorLoginMessage.innerText = e.message
    });
}

function pressSignUp() {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => {
        labelErrorLoginMessage.innerText = e.message
    });
}

function pressLogout() {
    firebase.auth().signOut();
    window.location.reload();
}

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {

        btnLogout.classList.remove("hide");
        btnLogin.classList.add("hide");
        btnSignUp.classList.add("hide");
        txtEmail.classList.add("hide");
        txtPassword.classList.add("hide");
        txtEmail.value = "";
        txtPassword.value = "";
        labelErrorLoginMessage.innerText = "";
        labelLoginMessage.innerText = "You are logging in as " + firebaseUser.email;

        fbRef.child('Admin').on('value', snap => {
            snap.forEach(function (ssnap) {
                if (ssnap.key == firebaseUser.uid) {
                    manageContent.classList.remove("hide");
                    accountMessage.classList.add("hide");
                }
            });
        });
        
        fbTrialRef.on('value', snap => { onRetrieveTrialData(snap) });
        
    } else {
        btnLogout.classList.add("hide");
        btnLogin.classList.remove("hide");
        btnSignUp.classList.remove("hide");
        txtEmail.classList.remove("hide");
        txtPassword.classList.remove("hide");
        labelLoginMessage.innerText = "You logged out!";
        manageContent.classList.add("hide");
        accountMessage.classList.add("hide");
    }
});

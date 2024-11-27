// const value
const regExName = /^[a-zA-Z]+$/;
const regExEmail = /([\w\.+]+)@northeastern.edu/;
const regExPhone = /^\d{3}-?\d{3}-?\d{4}$/;
const sCode = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0,q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m";


//const signUpGarphVerificationCodeField = document.getElementById("sign-up-garph-verification-code-field");


//text input controller
const email = document.getElementById("email");
const garphVerificationCode = document.getElementById("garph-verification-code");
const emailVerificationCode = document.getElementById("email-verification-code");
const passwordSet = document.getElementById("password-set");
const passwordConfirm = document.getElementById("password-confirm");

// button controller
const sendEmailButton = document.getElementById("send-email-button");
const signUp1ContinueButton = document.getElementById("sign-up-1-continue-button");
const signUp2ContinueButton = document.getElementById("sign-up-2-continue-button");

// alert controller
const errorHappened = new bootstrap.Modal(document.getElementById("error-happened"));
const emailSentSuccess = new bootstrap.Toast(document.getElementById("email-sent-success"));
const emailCodeIncorrect = new bootstrap.Toast(document.getElementById("email-code-incorrect"));
const emailConfirmedSuccess = new bootstrap.Modal(document.getElementById("email-confirmed-success"));
const confirmBackToLog = new bootstrap.Modal(document.getElementById("confirm-back-to-log"));
const signUpSuccess = new bootstrap.Modal(document.getElementById("sign-up-success"));

// feedback controller
const emailVerificationCodeSent = document.getElementById("email-verification-code-sent");
const errorEmailVerificationCode = document.getElementById("error-email-verification-code");
// const a = document.getElementById("email-confirmed-success");
const errorPasswordConfirm = document.getElementById("error-password-confirm");
const passwordSetCheck = document.getElementById("password-set-check");


//variate section
let show_num = []; // graph verification code
let email_code = [];// email verification code
let email_has_sent=false
let isEmailValid = false, isGarphVerificationCodeValid = false, isPasswordConfirmValidValid  = false, isPasswordSetValid  = false
let emailInput=""
let passwordInput=""


//email send module
function sendEmail() {
    sendEmailButton.innerHTML = '<img src="resource/imgage/rolling.svg" class="loading-icon"></img>'
    generateEmailCode(email_code)
    emailjs.init("efeIpbvvbrvnvcVBj");
    emailjs.send("service_12iga5f", "template_dza1quk", {
    to_name: email.value,
    from_name: "INFO6150 Project Team",
    message: "Thanks for your sign up. There is are Email Verification Code:\n\n"+email_code.join('')+"\n\nPlease do not tall anyone this code",
    to_email: email.value,
    }).then(function(response) {
        console.log("Email sent successfully!", response.status, response.text);
        emailSentSuccess.show()
        emailSendLock()
        signUp1ContinueButton.disabled=false
        garphVerificationCode.value=null
        refreshCode()
        email_has_sent=true
        sendEmailButton.innerHTML = 'Send'
    }, function(error) {
        console.log("Email sending failed...", error);
        errorHappened.show()
        sendEmailButton.innerHTML = 'Send'
    });
}

function generateEmailCode(email_code){
    let aCode = sCode.split(",");
    let aLength = aCode.length;
    for(let i = 0;i < 5;i ++){
        let j = Math.floor(Math.random() * aLength);
        let txt = aCode[j];
        email_code[i] = txt;
    }
}

// call this wehn email sent
// use to disbale sen button for 60 s
function emailSendLock(){
    sendEmailButton.disabled = true
    emailVerificationCodeSent.style.display = "block"
    let time = 60;

    let  sendLockTimeLimit = setInterval(function() {
        emailVerificationCodeSent.innerHTML = "Your code has sent. Please wait " + time + " seconds for a new one."
        time --;
      }, 1000);

    setTimeout(function() {
        clearInterval(sendLockTimeLimit)
        validateEmailAndGarphVerificationCode()
        emailVerificationCodeSent.style.display="none"
    }, 60000);
}


// verification code generated section 
draw(show_num);
// generate verification code when js imported

generateEmailCode(email_code)
// generate email code 
//if users refresh the page, email code should also be refresh
//or else users can use "" as email verification code to sign up


function refreshCode(){
    draw(show_num);   
}// generate v code

function draw(show_num) {
    let canvas_width = document.getElementById('canvas').clientWidth;
    let canvas_height = document.getElementById('canvas').clientHeight;
    let canvas = document.getElementById("canvas");//get the canvas object, the actor
    let context = canvas.getContext("2d");//get the environment of canvas drawing and the stage of actors performing
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    let aCode = sCode.split(",");
    let aLength = aCode.length;
        
    for (let i = 0; i <= 3; i++) {
        let j = Math.floor(Math.random() * aLength);//produces a random radian between 0 and aLength
        let deg = Math.random() * 30 * Math.PI / 180;//produces a random radian between 0 and 30
        let txt = aCode[j];//get a random piece of content
        show_num[i] = txt;
        let x = 10 + i * 20;//The x coordinate of the text on the canvas
        let y = 20 + Math.random() * 8;//The y coordinate of the text on the canvas
        context.font = "bold 23px 微软雅黑";

        context.translate(x, y);
        context.rotate(deg);

        context.fillStyle = randomColor();
        context.fillText(txt, 0, 0);

        context.rotate(-deg);
        context.translate(-x, -y);
    }
    for (let i = 0; i <= 5; i++) { //generate lines on verification code
        context.strokeStyle = randomColor();
        context.beginPath();
        context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.stroke();
    }
    for (let i = 0; i <= 30; i++) { //generate dots on verification code
        context.strokeStyle = randomColor();
        context.beginPath();
        let x = Math.random() * canvas_width;
        let y = Math.random() * canvas_height;
        context.moveTo(x, y);
        context.lineTo(x + 1, y + 1);
        context.stroke();
    }
}

function randomColor() {// get random color
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
}


//event listener
email.addEventListener("input",validateLoginInFormControl)
garphVerificationCode.addEventListener("input",validateLoginInFormControl)
passwordSet.addEventListener("input",validateLoginInFormControl)
passwordConfirm.addEventListener("input",validateLoginInFormControl)

emailVerificationCode.addEventListener("input",hideEmailVerificationCodeError)


// function

// page junp
function junmToSignUp(){
    location.href=("sign-up.html")
}

function signUpBack(){
    clearSignUp()
    location.href=("log-in.html")
}

function showConfirmBackToLog(){
    confirmBackToLog.show()
}

function signUp1Continue(){
    if(emailVerificationCode.value != email_code.join('')){
        emailCodeIncorrect.show()
        errorEmailVerificationCode.style.display="block"
        return
    }
    emailInput=email.value
    clearSignUp()
    emailConfirmedSuccess.show()
    showPage(3)
}

function showPage(pageNumber) {
    let pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
      page.classList.remove('active');
    });
    document.getElementById('page' + pageNumber).classList.add('active');
  }

// clean page input
function clearSignUp(){
    email.value="";
    emailVerificationCode.value=""
    garphVerificationCode.value="";
    passwordConfirm.value=""
    passwordSet.value=""
}

// validate input
function validateLoginInFormControl(event){

    const htmlPage=window.location.pathname.toString().split("/").pop()// get name of current page
    
    const value = event.target.value;

    const targetId = event.target.id;

    const errorFieldId = `error-${targetId}`;

    const errorField = document.getElementById(errorFieldId)
    
    if(targetId === "email"){
        isEmailValid = value.trim().match(regExEmail) != null;
        errorField.style.display = isEmailValid ? "none" : "block";
        signUp1ContinueButton.disabled = email_has_sent && isEmailValid ? false : true;
    }

    if(targetId === "garph-verification-code"){
        isGarphVerificationCodeValid = value.toLowerCase() === show_num.join('').toLowerCase()
        errorField.style.display = value.toLowerCase() === show_num.join('').toLowerCase() ? "none" : "block";
    }

    if(targetId === "password-set"){
        passwordSetCheck.style.display="block"
        let ifPasswordLengthCorrect = validatePasswordSet("password-length",(value.length >= 8 && value.length <= 20))
        let ifUppercaseLettersCorrect = validatePasswordSet("uppercase-letters",value.match(/[A-Z]/) != null)
        let ifLowercaseLettersCorrect = validatePasswordSet("lowercase-letters",value.match(/[a-d]/) != null)
        let ifpasswordDigitCorrect = validatePasswordSet("password-digit",value.match(/\d/)  != null)
        
        isPasswordSetValid = ifPasswordLengthCorrect && ifUppercaseLettersCorrect && ifLowercaseLettersCorrect && ifpasswordDigitCorrect
    }

    if(targetId === "password-confirm"){
        isPasswordConfirmValidValid=passwordConfirm.value === passwordSet.value
        errorPasswordConfirm.style.display = isPasswordConfirmValidValid ? "none" : "block"
    }

    switch(htmlPage){
        case "sign-up.html" : validateEmailAndGarphVerificationCode()
    }

}

// change password check field style
function validatePasswordSet(fieldName,ifCorrect){
    const field = document.getElementById(fieldName)
    const fieldIcon = document.getElementById(fieldName+"-icon")
    field.style.backgroundColor = ifCorrect ? "#7FFFAA":"#FFB6C1"
    fieldIcon.innerHTML = ifCorrect ? '<img class="sign-up-icon" src="resource/imgage/tick.svg"></img>' : '<img class="sign-up-icon" src="resource/imgage/exclamation.svg"></img>'
    return ifCorrect
}


function validateEmailAndGarphVerificationCode(){
    sendEmailButton.disabled = !(isEmailValid && isGarphVerificationCodeValid)
    signUp2ContinueButton.disabled = !(isPasswordSetValid && isPasswordConfirmValidValid)
}


function hideEmailVerificationCodeError(){
    errorEmailVerificationCode.style.display="none"
}

function signUp2Continue(){
    passwordInput=passwordSet.value
    fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email:emailInput,
            password: passwordInput,
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        signUpSuccess.show()
    })
    .catch(error => {
        console.error('Error:', error);
        errorHappened.show()
    });
}






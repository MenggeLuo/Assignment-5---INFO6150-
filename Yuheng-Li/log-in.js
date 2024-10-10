// const value
const regExName = /^[a-zA-Z]+$/;
const regExEmail = /([\w\.+]+)@northeastern.edu/;
const regExPhone = /^\d{3}-?\d{3}-?\d{4}$/;
const sCode = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0,q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m";


//text input controller
const email = document.getElementById("email");
const password = document.getElementById("password");
const garphVerificationCode = document.getElementById("garph-verification-code");

// feedback controller
const emailVerificationCodeSent = document.getElementById("email-verification-code-sent");

const emailPasswordWbrong = new bootstrap.Toast(document.getElementById("email-password-wrong"));
const errorHappened = new bootstrap.Modal(document.getElementById("error-happened"));

const logInContinueButton = document.getElementById("log-in-continue-button");

//variate section
let show_num = []; // graph verification code
let emailInput=""
let passwordInput=""

let isEmailValid = false, isGarphVerificationCodeValid = false

// verification code generated section 

draw(show_num);
// generate verification code when js imported


function refreshCode(){
    draw(show_num);   
}// generate verification code

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

// function

// page jump

function junmToSignUp(){
    location.href=("sign-up.html")
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
    }

    if(targetId === "garph-verification-code"){
        isGarphVerificationCodeValid = value.toLowerCase() === show_num.join('').toLowerCase()
        errorField.style.display = value.toLowerCase() === show_num.join('').toLowerCase() ? "none" : "block";
    }

    switch(htmlPage){
        case "log-in.html" : validateEmailAndGarphVerificationCode()
    }

}

function validateEmailAndGarphVerificationCode(){
    logInContinueButton.disabled = !(isEmailValid && isGarphVerificationCodeValid)
}

function getUsers() {
    
    let url='http://localhost:5000/users?email='+email.value+'&&password='+password.value   
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(res => res.json()).then(res => {
        console.log(res[0])
        if(res[0]!=null){
            location.href=("../home.html")
        }else{
            emailPasswordWbrong.show()
        }
    })  
    .catch(error => {
        console.error('Error:', error);
        errorHappened.show()
    });

}

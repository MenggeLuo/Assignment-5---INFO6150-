// Constants
const regExEmail = /([\w\.+]+)@northeastern.edu/;
const sCode = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0,q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m";

// DOM Elements
const email = document.getElementById("email");
const garphVerificationCode = document.getElementById("garph-verification-code");
const sendResetEmailButton = document.getElementById("send-reset-email-button");
const newPassword = document.getElementById("new-password");
const confirmNewPassword = document.getElementById("confirm-new-password");
const resetPasswordButton = document.getElementById("reset-password-button");
const emailForm = document.getElementById("email-form");
const newPasswordForm = document.getElementById("new-password-form");

// Toast Elements
const resetEmailSentToast = new bootstrap.Toast(document.getElementById("reset-email-sent"));
const resetErrorToast = new bootstrap.Toast(document.getElementById("reset-error"));

// Variables
let show_num = [];
let reset_code = [];
let isEmailValid = false;
let isGarphVerificationCodeValid = false;
let isNewPasswordValid = false;
let isConfirmNewPasswordValid = false;

// Event Listeners
email.addEventListener("input", validateResetPasswordForm);
garphVerificationCode.addEventListener("input", validateResetPasswordForm);
newPassword.addEventListener("input", validateResetPasswordForm);
confirmNewPassword.addEventListener("input", validateResetPasswordForm);
sendResetEmailButton.addEventListener("click", sendResetEmail);
resetPasswordButton.addEventListener("click", resetPassword);

// Initialize
draw(show_num);

// Functions
function validateResetPasswordForm(event) {
    const value = event.target.value;
    const targetId = event.target.id;
    const errorFieldId = `error-${targetId}`;
    const errorField = document.getElementById(errorFieldId);

    switch (targetId) {
        case "email":
            isEmailValid = value.trim().match(regExEmail) !== null;
            errorField.style.display = isEmailValid ? "none" : "block";
            break;
        case "garph-verification-code":
            isGarphVerificationCodeValid = value.toLowerCase() === show_num.join('').toLowerCase();
            errorField.style.display = isGarphVerificationCodeValid ? "none" : "block";
            break;
        case "new-password":
            isNewPasswordValid = value.length >= 8;
            errorField.style.display = isNewPasswordValid ? "none" : "block";
            break;
        case "confirm-new-password":
            isConfirmNewPasswordValid = value === newPassword.value;
            errorField.style.display = isConfirmNewPasswordValid ? "none" : "block";
            break;
    }

    sendResetEmailButton.disabled = !(isEmailValid && isGarphVerificationCodeValid);
    resetPasswordButton.disabled = !(isNewPasswordValid && isConfirmNewPasswordValid);
}

function refreshCode(){
    draw(show_num);   
}// generate verification code

function sendResetEmail() {
    sendResetEmailButton.innerHTML = '<img src="resource/imgage/rolling.svg" class="loading-icon"></img>';
    generateResetCode(reset_code);
    
    emailjs.send("service_12iga5f", "template_dza1quk", {
        to_name: email.value,
        from_name: "INFO6150 Project Team",
        message: `Your password reset code is: ${reset_code.join('')}. Please use this code to reset your password.`,
        to_email: email.value,
    }).then(function(response) {
        console.log("Reset email sent successfully!", response.status, response.text);
        resetEmailSentToast.show();
        emailForm.style.display = "none";
        newPasswordForm.style.display = "block";
        sendResetEmailButton.innerHTML = 'Send Reset Email';
    }, function(error) {
        console.log("Reset email sending failed...", error);
        resetErrorToast.show();
        sendResetEmailButton.innerHTML = 'Send Reset Email';
    });
}

function resetPassword() {
    // Here you would typically send a request to your backend to update the password
    // For this example, we'll just show a success message
    fetch('http://localhost:5000/users', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: newPassword.value,
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Password reset successful:', data);
        resetEmailSentToast.show();
        setTimeout(() => {
            window.location.href = "log-in.html";
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        resetErrorToast.show();
    });
}

function generateResetCode(reset_code) {
    let aCode = sCode.split(",");
    let aLength = aCode.length;
    for(let i = 0; i < 6; i++) {
        let j = Math.floor(Math.random() * aLength);
        let txt = aCode[j];
        reset_code[i] = txt;
    }
}

// Reuse the draw and randomColor functions from the existing code
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
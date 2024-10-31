
function showPassword() {
    let passwd = document.querySelector("#account_password");
    if (passwd.type === "password") {
      passwd.type = "text";
    } else {
      passwd.type = "password";
    }
  }
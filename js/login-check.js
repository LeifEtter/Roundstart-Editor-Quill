window.onload = function() {
    if(!checkLogin()) {
        window.location = "../pages/login.html";
    }
}
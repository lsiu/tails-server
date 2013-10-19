
var qrcode = new QRCode("test", {
    text: "http://jindo.dev.naver.com/collie",
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});


var passhash = CryptoJS.MD5(password);

    $.post(
      'includes/login.php', 
      { user: username, pass: passhash },
      onLogin, 
      'json' );

qrcode.clear(); // clear the code.
qrcode.makeCode("http://naver.com"); // make another code.


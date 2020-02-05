document.getElementById('inp').onchange = function(e) {
    var img = new Image();
    img.onload = draw;
    img.onerror = failed;
    img.src = URL.createObjectURL(this.files[0]);
};
function draw() {
    var canvas = document.getElementById('sourceImg');
    canvas.width = this.width;
    canvas.height = this.height;

    var MAX_WIDTH = 150;
    var MAX_HEIGHT = 150;
    var width = this.width;
    var height = this.height;

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(this, 0,0, width, height);
    hacked();
}
function failed() {
    console.error("The provided file couldn't be loaded as an Image media");
}

function imageToChars(){

    var text = document.getElementById("text");
    text.innerText = "";
    var asciiStr = "";
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var img = document.getElementById("sourceImg");
    var randomChar;
    c.width = img.clientWidth;
    c.height = img.clientHeight;
    ctx.drawImage(img, 0, 0, img.clientWidth, img.clientHeight);

    var imgData = ctx.getImageData(0, 0, c.width, c.height);

    charImage = new Array();
    lenCharAnimation = new Array();

    for (var i = 0; i < imgData.data.length; i += 4) {

        // Get the pixel of the red channel.
        r = imgData.data[i]
        // Get the pixel of the green channel.
        g = imgData.data[i+1]
        // Get the pixel of the blue channel.
        b = imgData.data[i+2]
        // Get the pixel of the alpha channel.
        a = imgData.data[i+3]
        // Transform RGB color space to gray scale.
        gray =  (0.299 * r + 0.587 * g + 0.114 * b)

        if ( gray > 120 )
        {
            // Set the pixel is white.
            imgData.data[i] = 255;
            imgData.data[i+1] = 255;
            imgData.data[i+2] = 255;
            imgData.data[i+3] = a;
        }
        else
        {
            // Set the pixel is black.
            imgData.data[i] = 0;
            imgData.data[i+1] = 0;
            imgData.data[i+2] = 0;
            imgData.data[i+3] = a;
        }

        if (i%(img.clientWidth*4)==0 && i > 0){
            asciiStr += "\n";
            charImage.push("\n");
            lenCharAnimation.push(0);
        }
        if (imgData.data[i] > 250 && imgData.data[i+1] > 250 && imgData.data[i+2] > 250){
            randomChar = String.fromCharCode(Math.floor(Math.random() * (+126 - +33)) + +33);
            charImage.push(randomChar);
            asciiStr += randomChar;
            lenCharAnimation.push(Math.floor(Math.random() * (10 - 1)) + 1);
        }
        else {
            charImage.push(" ");
            lenCharAnimation.push(0);
            asciiStr += " ";
        }
        console.log(i);
    }

    // text.innerText = asciiStr;
    ctx.putImageData(imgData, 0, 0);

    return [charImage, lenCharAnimation];
}

function hacked() {
    var returnArr = imageToChars();
    var complete = false;
    var i = 0;
    var j = 0;
    var randChar;

    //przygotowanie pustej tablicy odwzorowanego obrazu
    var listCharIndex = Array();
    var animationArr = Array();
    var lenCharAnimation = Array();
    for (var x = 0; x <= returnArr[0].length; x++){
        if (returnArr[0][x] !== "\n"){
            animationArr.push(" ");
            if (returnArr[0][x] !== " "){
                listCharIndex.push(x);
                lenCharAnimation.push(Math.floor(Math.random() * (10 - 1)) + 1);
                //console.log(x);
            }
        }
        else {
            animationArr.push(returnArr[0][x]);
            console.log(x);
        }
    }
    //console.log(asciiStr.join(""));
    //console.log(returnArr[0][150]);
    //console.log(lenCharAnimation);

    var arrAnimating = Array();
    var constantAnimatedChars = Array();
    var temp = 0;
    var id = setInterval(animation, 50);
    function animation(){

        for (var y = 0; y < 20; y++){
            if (constantAnimatedChars.length < 100){

                randChar = Math.floor(Math.random() * (+listCharIndex.length - +0)) + +0;
                constantAnimatedChars.push(randChar);
                if (lenCharAnimation[randChar] > 0){
                    animationArr[listCharIndex[randChar]] = String.fromCharCode(Math.floor(Math.random() * (+126 - +33)) + +33);
                    lenCharAnimation[randChar]--;
                }
                else {
                    animationArr[listCharIndex[randChar]] = returnArr[0][listCharIndex[randChar]];
                    listCharIndex.splice(randChar, 1);
                    lenCharAnimation.splice(randChar, 1);
                    constantAnimatedChars.splice(randChar, 1);
                }

            }
            else {
                randChar = Math.floor(Math.random() * (+constantAnimatedChars.length - +0)) + +0;

                if (lenCharAnimation[constantAnimatedChars[randChar]] > 0){
                    animationArr[listCharIndex[constantAnimatedChars[randChar]]] = String.fromCharCode(Math.floor(Math.random() * (+126 - +33)) + +33);
                    lenCharAnimation[constantAnimatedChars[randChar]]--;
                }
                else {
                    animationArr[listCharIndex[constantAnimatedChars[randChar]]] = returnArr[0][listCharIndex[constantAnimatedChars[randChar]]];
                    listCharIndex.splice(constantAnimatedChars[randChar], 1);
                    lenCharAnimation.splice(constantAnimatedChars[randChar], 1);
                    constantAnimatedChars.splice(randChar, 1);
                }
            }
        }
        text.innerText = animationArr.join("");
        console.log(i+" - length: "+listCharIndex.length);
        i++;
        if (listCharIndex.length === 0) {
            clearInterval(id);
        }
        //return listCharIndex.length;
    }
    console.log('flaga'+i);
}
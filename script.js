let model;
var canvasLineJoin          = "round";
var canvasStrokeStyle       = "white";
var canvasLineWidth         = 5;
var canvasWidth             = 1000;
var canvasHeight            = 130;
var clickX = new Array();
var clickY = new Array();
var clickD = new Array();
var drawing;

var cv = document.getElementById('cv');
cv.setAttribute("width", canvasWidth);
cv.setAttribute("height", canvasHeight);

if(typeof G_vmlCanvasManager != 'undefined') {
  cv = G_vmlCanvasManager.initElement(cv);
}
ctx = cv.getContext("2d");

$("#cv").mousedown(function(e) {
    var rect = cv.getBoundingClientRect();
    var mouseX = e.clientX- rect.left;
    var mouseY = e.clientY- rect.top;
    //var mouseX = e.clientX;
    //var mouseY = e.clientY;
    drawing = true;
    addUserGesture(mouseX, mouseY);
    drawOnCanvas();
});

cv.addEventListener("touchstart", function (e) {
    if (e.target == cv) {
        e.preventDefault();
    }
 
    var rect = cv.getBoundingClientRect();
    var touch = e.touches[0];
 
    var mouseX = touch.clientX - rect.left;
    var mouseY = touch.clientY - rect.top;
    //var mouseX = touch.clientX;
    //var mouseY = touch.clientY;
 
    drawing = true;
    addUserGesture(mouseX, mouseY);
    drawOnCanvas();
 
}, false);
 

$("#cv").mousemove(function(e) {
    if(drawing) {
        var rect = cv.getBoundingClientRect();
        var mouseX = e.clientX- rect.left;;
        var mouseY = e.clientY- rect.top;
        //var mouseX = e.clientX;
        //var mouseY = e.clientY;
        addUserGesture(mouseX, mouseY, true);
        drawOnCanvas();
    }
});

cv.addEventListener("touchmove", function (e) {
    if (e.target == cv) {
        e.preventDefault();
    }
    if(drawing) {
        var rect = cv.getBoundingClientRect();
        var touch = e.touches[0];
 
        var mouseX = touch.clientX - rect.left;
        var mouseY = touch.clientY - rect.top;

        //var mouseX = touch.clientX;
        //var mouseY = touch.clientY;
 

        addUserGesture(mouseX, mouseY, true);
        drawOnCanvas();
    }
}, false);


$("#cv").mouseup(function(e) {
    drawing = false;
});

cv.addEventListener("touchend", function (e) {
    if (e.target == cv) {
        e.preventDefault();
    }
    drawing = false;
}, false);

$("#cv").mouseleave(function(e) {
    drawing = false;
});

cv.addEventListener("touchleave", function (e) {
    if (e.target == cv) {
        e.preventDefault();
    }
    drawing = false;
}, false);

function addUserGesture(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickD.push(dragging);
}

function drawOnCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
 
    ctx.strokeStyle = canvasStrokeStyle;
    ctx.lineJoin    = canvasLineJoin;
    ctx.lineWidth   = canvasLineWidth;
 
    for (var i = 0; i < clickX.length; i++) {
        ctx.beginPath();
        if(clickD[i] && i) {
            ctx.moveTo(clickX[i-1], clickY[i-1]);
        } else {
            ctx.moveTo(clickX[i]-1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.closePath();
        ctx.stroke();
    }
}

$("#clear-btn").click(async function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    clickX = new Array();
    clickY = new Array();
    clickD = new Array();
    $('#out-c').empty();
});
function downloadImage(data, filename = 'untitled.jpeg') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}
$("#pred-btn").click(async function () {
    var imageData = ctx.getImageData(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    var url = cv.toDataURL("image/jpeg", 1.0);
    downloadImage(url, 'img.jpeg')
    /*$.ajax({
        url:'python.py'
    })*/
});
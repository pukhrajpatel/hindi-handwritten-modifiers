let model;
var canvasLineJoin          = "round";
var canvasStrokeStyle       = "white";
var canvasLineWidth         = 5;
var canvasWidth             = 400;
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

var img_top = document.getElementById('img_top')
var img_mid = document.getElementById('img_mid')
var img_bottom = document.getElementById('img_bottom')

var p1 = document.getElementById('p1')
var p2 = document.getElementById('p2')
var p3 = document.getElementById('p3')

$("#clear-btn").click(async function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    clickX = new Array();
    clickY = new Array();
    clickD = new Array();
    img_top.setAttribute('src', '');
    img_mid.setAttribute('src', '');
    img_bottom.setAttribute('src', '');
    p1.innerHTML = "";
    p2.innerHTML = "";
    p3.innerHTML = "";
    //$('#out-c').empty();
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
    //console.log(url)
    //console.log(imageData.data);
    //console.log(imageData)
    //downloadImage(url, 'img.jpeg')

    //const spaw = require('child_process').spawn;
    //const python_process = spaw('python', ['python.py', imageData]);
    fd = new FormData()
    fd.append('url',url);
    $.ajax({
      url: '',
      type: 'post',
      //data: {'images': url},
      data: fd,
      dataType: 'json',
      async: false,
      cache: false,
      timeout: 3000,
      contentType: false,
      processData: false,
      success: function(response){
        console.log("hellodhsi")
        $(img_top).attr('src', 'static/uploads/top.jpg' + '?' + new Date().getTime())
        $(img_mid).attr('src', 'static/uploads/middle.jpg' + '?' + new Date().getTime())
        $(img_bottom).attr('src', 'static/uploads/bottom.jpg' + '?' + new Date().getTime())
        p1.innerHTML = "Upper modifiers";
        p2.innerHTML = "Characters and middle modifiers";
        p3.innerHTML = "Bottom modifiers";
        /*console.log(response)
        img_top.setAttribute('src', 'static/uploads/top.jpg');
        img_mid.setAttribute('src', 'static/uploads/middle.jpg');
        img_bottom.setAttribute('src', 'static/uploads/bottom.jpg')*/
      },
    });
    /*img_top.setAttribute('src', 'static/uploads/top.jpg');
    img_mid.setAttribute('src', 'static/uploads/middle.jpg');
    img_bottom.setAttribute('src', 'static/uploads/bottom.jpg');*/
});

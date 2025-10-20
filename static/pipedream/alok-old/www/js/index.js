var gWatchID = null;
var gFileEntry = null;

var gAngleOffset = 0.0;
var gAngle = 0.0;
var gCompassCurrentValue = 0.0;
var gCompassPreviousValue = 0.0;
var gMeasurementCount = 0;

var gManholeRadius = 50;

document.addEventListener("deviceready", onDeviceReady, false);

function onLoad()
{
    jump('startpage');
    clearManhole();
    accelClear();
}

function onDeviceReady()
{
    navigator.compass.getCurrentHeading(compassUpdate, doNothing);
    gWatchID = navigator.compass.watchHeading(compassUpdate, doNothing, { frequency: 100 } );
   
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
            createFile(dirEntry, "test.txt");
        });
}

function jump(newpage)
{
    var pages = document.getElementsByClassName('page');
    for (var i = 0; i < pages.length; i++)
    {
        pages[i].style.display = 'none';
        //document.getElementById(pages[i]).style.height = '0px';
    }
    document.getElementById(newpage).style.display = 'block';
}

function compassUpdate(heading)
{
    gCompassPreviousValue = gCompassCurrentValue;
    if (Math.abs(gCompassPreviousValue-heading.magneticHeading) > 90)
    {
        gCompassCurrentValue = heading.magneticHeading;
    }
    else
    {
        gCompassCurrentValue = gCompassPreviousValue*0.75 + heading.magneticHeading*0.25;
    }
    gAngle = normalizeAngle(gCompassCurrentValue - gAngleOffset);
    document.getElementById('heading').innerHTML = gAngle.toFixed(1);
}

function compassOff()
{
    navigator.compass.clearWatch(gWatchID);
}

function compassClear()
{
    document.getElementById('meaurementtablebody').innerHTML = '';
    gMeasurementCount = 0.0;
    gAngleOffset = 0.0;
    clearManhole();
}

function compassMeasure()
{
    if (gMeasurementCount >= 26)
    {
        navigator.notification.alert('You can only have 26 items, sorry.', doNothing);
        return;
    }
    if (gMeasurementCount == 0)
    {
        gAngleOffset = gAngle;
        gAngle = 0.0;
    }
    // Generate new table entry
    var newRow = document.getElementById('meaurementtablebody').insertRow(-1);
    var rowPoint = newRow.insertCell(0);
    rowPoint.innerHTML = letterFromA(gMeasurementCount);
    rowPoint.className = 'leftcolumn';
    var rowAngle = newRow.insertCell(1);
    rowAngle.innerHTML = gAngle.toFixed(1) + '&deg;';
    rowAngle.className = 'middlecolumn';
    var rowClass = newRow.insertCell(2);
    var inputLine = document.getElementById('item').value;
    rowClass.innerHTML = inputLine;
    // Scroll down if necessary
    var objDiv = document.getElementById("measurements");
    objDiv.scrollTop = objDiv.scrollHeight;
    // Draw manhole
    drawManhole(gAngle-90);
    gMeasurementCount += 1;
}

function drawManhole(angle)
{
    var canvas = document.getElementById("compass");
    var context = canvas.getContext("2d");
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius_near   =  gManholeRadius-5;
    var radius_far    =  gManholeRadius+5;
    var radius_letter =  gManholeRadius+12;
    var xn = centerX + radius_near   * Math.cos(angle*Math.PI / 180.0);
    var yn = centerY + radius_near   * Math.sin(angle*Math.PI / 180.0);
    var xf = centerX + radius_far    * Math.cos(angle*Math.PI / 180.0);
    var yf = centerY + radius_far    * Math.sin(angle*Math.PI / 180.0);
    var xl = centerX + radius_letter * Math.cos(angle*Math.PI / 180.0);
    var yl = centerY + radius_letter * Math.sin(angle*Math.PI / 180.0);
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(xn,yn);
    context.lineTo(xf,yf);
    context.stroke();
    context.font = '12px Arial';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(letterFromA(gMeasurementCount),xl,yl);
}

function clearManhole()
{
    var canvas  = document.getElementById("compass");
    var context = canvas.getContext("2d");
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius  =  gManholeRadius;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "black";
    context.beginPath();
    context.lineWidth = 1;
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.stroke();
}

function writeTest()
{
    gFileEntry.createWriter(function (fileWriter) {
    
    fileWriter.seek(fileWriter.length);
    
    var blob = new Blob(['BOB DOLE'], {type:'text/plain'});
    fileWriter.write(blob);
    }, doNothing);
}

function createFile(dirEntry, fileName)
{
    dirEntry.getFile(fileName, {create: true}, function(fileEntry) {
        gFileEntry = fileEntry; });

}

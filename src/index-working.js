// throw "hello";

// //
// // Get the camera and have it records what it is seeing.
// // Have it for a n number of seconds.
// // I want to timestamp the filee.
// //

import hackrf from 'hackrf';
import cv from 'opencv';
import fs from 'fs';
import { ExitStatus } from 'typescript';
const {performance} = require('perf_hooks');

// // // fs.writeFile("data", data, (err) => {
// // //   if (err) console.log(err);
// // //   console.log("Successfully Written to File.");
// // // });

// try {
//   var camera = new cv.VideoCapture(0);
//   var window = new cv.NamedWindow('Video', 0);

//   var counter = 0;
  
//   setInterval(function() {

//     console.log(counter)

//     camera.read(function(err, im) {
//       if (err) throw err;
//       // console.log(im.size())
//       if (im.size()[0] > 0 && im.size()[1] > 0){
//         // console.log(im);
//         // window.show(im);
//       }
//       window.blockingWaitKey(0, 50);

//       counter = counter + 1;
//     });
//   }, 20);
  
// } catch (e){
//   // console.log("Couldn't start camera:", e)
// }


// // throw 'Error: Invalid device index';


// var state: 
//  0 = 'All devices'
//  1 = 'Only Camera'
//  2 = 'Only SDR'


// var devices = hackrf();

// var state = 1;

// try {
//   try {

//   } catch(e) {
//     var camera = new cv.VideoCapture(0);
//     var counter = 0;

//     var device = devices.open(0)
//     var version = device.getVersion();

//     device.setFrequency(24000000,  function(data) {
//         console.log("done: setFrequency");
//     });
//   }

// debug camera and sdr times
// states: start, end
// Adding timestamps on files

function getFormattedTime() {
  var today = new Date();
  var y = today.getFullYear();
  // JavaScript months are 0-based.
  var m = today.getMonth() + 1;
  var d = today.getDate();
  var h = today.getHours();
  var mi = today.getMinutes();
  var s = today.getSeconds();
  return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
}


function saveBoth() {
  var camera = new cv.VideoCapture(0);
  var window = new cv.NamedWindow('Video', 0);

  var devices = hackrf();
  var device = devices.open(0)

  // always read but only save every second
  var today = new Date();
  var current = today.getSeconds();
  device.startRx(function (data, cb) {
    // console.log(data);

    var today = new Date();
    var s2 = today.getSeconds();

    // save every second
    if(current != s2) {
      const filename = getFormattedTime();

      camera.read(function(err, im) {
        if (err) throw err;
        fs.writeFile("uploads/"+filename+"-pic", im, function(err) {
          if(err)
            console.log(err);
        });
      });
      fs.writeFile("uploads/"+filename+"-sdr", data, function(err) {
        if(err){
          console.log(err);
        }
      });

      current = s2;
    }

    cb();
  });

}

function showSDR() {
  var devices = hackrf();
  var device = devices.open(0)

  // always read but only save every second
  var today = new Date();
  var current = today.getSeconds();
  device.startRx(function (data, cb) {
    var today = new Date();
    var s2 = today.getSeconds();

    // save every second
    if(current != s2) {
      const filename = getFormattedTime();
      fs.writeFile("uploads/sdr/"+filename+"-sdr", data, function(err) {
        if(err){
          console.log(err);
        }
      });
      // console.log(data);
      current = s2;
    }

    cb();
  });
}

function showCamera () {
  const displayCamera = false;
  var camera = new cv.VideoCapture(0);
  var window = new cv.NamedWindow('Video', 0);

  camera.read(function(err, im) {
    if (err) throw err;

    fs.writeFile("uploads/"+getFormattedTime(), im, 'base64', function(err) {
      if(err){
        console.log(err);
        }else{
        // res.send(JSON.stringify({'status': 1, 'msg': 'Image Uploaded'}));
      }
    });

    if(Debug) {
      console.log(im);
    }

    if (im.size()[0] > 0 && im.size()[1] > 0){

      if(displayCamera)
        window.show(im);
    }
    if(displayCamera)
      window.blockingWaitKey(0, 50);
    counter = counter + 1;
  });
}

var Debug = true;


// displayName();

var state = 0;
if(state === 1 ) {
  console.log("State: 1\nOnly Camera");
  var counter = 0;
  setInterval(function() {
    showCamera();
  }, 20);
} else if(state === 0) {
  console.log("State: 0\nAll Devices");
  saveBoth();
} else if(state == 2) {
  console.log("State: 2\nOnly SDR");
  showSDR();
}


import hackrf from 'hackrf';
import cv from 'opencv';
import fs from 'fs';

const DEBUG = true;
const SAVE = true;

function getFormattedTime() {
  var today = new Date();
  var y = today.getFullYear();
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

  device.startRx(function (data, callback) {
    // console.log(data);

    const filename = getFormattedTime();
    // console.log(filename);

    camera.read(function(err, image) {
      if (err) throw err;
      image.save('uploads/'+filename+'-pic.jpg');
      fs.writeFile("uploads/"+filename+"-matrixPic", image, function(err) {
        if(err)
          console.log(err);
      });

      if (image.size()[0] > 0 && image.size()[1] > 0){
        if(DEBUG)
          window.show(image);
      }
      if(DEBUG)
        window.blockingWaitKey(0, 50);
    });
    fs.writeFile("uploads/"+filename+"-sdr", data, function(err) {
      if(err){
        console.log(err);
      }
    });

    setTimeout(function(){
      callback();
    },100);

  });

}

saveBoth();

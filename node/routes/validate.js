var express = require('express');
var tf = require('@tensorflow/tfjs');
var tfn = require("@tensorflow/tfjs-node");
const fs = require('fs');

var router = express.Router();

var mainPath = './t_datas/validate';

// 初始化tensorflow
var initModel = async function() {
  var start = +new Date()
  const handler = tfn.io.fileSystem(`${mainPath}/js/model.json`);
  model = await tf.loadLayersModel(handler);
  model = tf.sequential({
    layers: [
      model,
      tf.layers.softmax()
    ]
  });
  console.log(`完成耗时：${+new Date()-start}`);

  // 顺便初始化文件，为了保证后面学习没有偏差
  for(var i=0; i<10; i+=1) {
    var path = `${mainPath}/nums/${i}`;
    if(!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }

  // var start = +new Date()
  // var ddd = fs.readFileSync('./aa.png');
  // const tfimage = tfn.node.decodeImage(ddd, 1);
  // var tensor = tfimage.expandDims(0);
  // tensor = tensor.div(tf.scalar(255));
  // const predictions = await model.predict([tensor]);
  // predictions.print();
  // console.log(`验证耗时：${+new Date()-start}`);  
}
initModel();

router.post('/check', async function(req, res, next) {
  var imgURL = decodeURIComponent(req.body['img']);
  // 从session中去取
  var num = req.body['num'];
  var regex = /^data:.+\/(.+);base64,(.*)$/;
  var matches = imgURL.match(regex);
  var ext = matches[1];
  var data = matches[2];
  var buffer = Buffer.from(data, 'base64');

  var path = `${mainPath}/nums/${num}`;

  var fileName = path+'/'+(+new Date())+'.' + ext;

  fs.writeFileSync(fileName, buffer); //if you do not need to save to file, you can skip this step.
  var start = +new Date();

  var ddd = fs.readFileSync(fileName);
  // An optional int. Defaults to 0. Accepted values are 0: use the number of channels in the PNG-encoded image. 1: output a grayscale image. 3: output an RGB image. 4: output an RGBA image.
  var tfimage = tfn.node.decodeImage(ddd, 1);
  tfimage = tf.cast(tfimage, 'float32');
  var tensor = tfimage.expandDims(0);
  tensor = tensor.div(tf.scalar(255));
  var predictions = await model.predict([tensor]);
  var dataShow = predictions.arraySync()[0]
  console.log(dataShow)
  var max = 0;
  var counts = 0;
  for(var i=0; i<dataShow.length; i+=1) {
      if(dataShow[i] > counts) {
          max = i;
          counts = dataShow[i];
      }
  }
  counts = (counts * 100.0).toFixed(2);
  console.log(`验证耗时：${+new Date()-start}`); 
  res.send({code:0, data:{num:num,numRes:(dataShow[num] * 100.0).toFixed(2),max:max,res:counts}});
});

function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
}

router.get('/pick', async function(req, res, next) {
  var num = randomNum(0, 9);
  res.send({code:0, data:{num:num}});
});

module.exports = router;
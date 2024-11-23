const canvasSelector = "canvas";
let canvasElem = $(canvasSelector)[0];
const BLOCK_COLS = 8;
const BLOCK_ROWS = 4;

function triggerClick(posX, posY) {
  if (!canvasElem) {
    canvasElem = $(canvasSelector)[0];
  }

  if (posX > canvasElem.width) {
    posX = canvasElem.width - 10;
  }
  if (posY > canvasElem.height) {
    posY = canvasElem.height - 10;
  }

  canvasElem.dispatchEvent(
    new MouseEvent("mousedown", { clientX: posX, clientY: posY, bubbles: true })
  );
  canvasElem.dispatchEvent(
    new MouseEvent("mouseup", { clientX: posX, clientY: posY, bubbles: true })
  );
}

function triggerClickBlock(blockX, blockY){
  if (!canvasElem) {
    canvasElem = $(canvasSelector)[0];
  }
  let blockWidth = canvasElem.width / BLOCK_COLS;
  let blockHeight = canvasElem.height /  BLOCK_ROWS;
  if(blockX < 1){
    blockX = 1;
  }
  if(blockX > BLOCK_COLS){
    blockX = BLOCK_COLS;
  }
  if(blockY < 1){
    blockY = 1;
  }
  if(blockY > BLOCK_ROWS){
    blockY = BLOCK_ROWS;
  }
  let clientX = blockWidth / 2 + blockWidth * ( blockX - 1);
  let clientY = blockHeight / 2 + blockHeight * ( blockY - 1);
  canvasElem.dispatchEvent(
    new MouseEvent("mousedown", { clientX: clientX, clientY: clientY, bubbles: true })
  );
  canvasElem.dispatchEvent(
    new MouseEvent("mouseup", { clientX: clientX, clientY: clientY, bubbles: true })
  );

}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function randomInRange(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function bpmPlay(bpm, fn){
  return setInterval(() => {
    fn()
  }, 60 * 1000 / bpm);
}

function testBpmPlay(bpm = 130, measures = 16, beats = 4){
  let counter = measures * beats;
  let index = 0;
  let timer = bpmPlay(bpm, function(){
    triggerClickBlock(randomInRange(1, BLOCK_COLS), randomInRange(1, BLOCK_ROWS));
    index++;
    console.log(index);
    if(index > counter){
      clearInterval(timer);
    }
  });

}

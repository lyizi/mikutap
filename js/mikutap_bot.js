const canvasSelector = "#view > canvas";
let canvasElem = $(canvasSelector)[0];
const textSelector = "#text";
const textCanvasSelector = "#text > canvas";
let textCanvasElem = $(canvasSelector)[0];
const BLOCK_COLS = 8;
const BLOCK_ROWS = 4;

function getBlockWidthHeight() {
  if (!canvasElem) {
    canvasElem = $(canvasSelector)[0];
  }
  let blockWidth = canvasElem.width / BLOCK_COLS;
  let blockHeight = canvasElem.height / BLOCK_ROWS;

  return { blockWidth, blockHeight };
}

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
  // sleep(3000);
  // clearText();
}

function triggerClickBlock(blockX, blockY) {
  let { blockWidth, blockHeight } = getBlockWidthHeight();
  if (blockX < 1) {
    blockX = 1;
  }
  if (blockX > BLOCK_COLS) {
    blockX = BLOCK_COLS;
  }
  if (blockY < 1) {
    blockY = 1;
  }
  if (blockY > BLOCK_ROWS) {
    blockY = BLOCK_ROWS;
  }
  let clientX = blockWidth / 2 + blockWidth * (blockX - 1);
  let clientY = blockHeight / 2 + blockHeight * (blockY - 1);
  triggerClick(clientX, clientY);
}

function createOrGetTextCanvas(width, height) {
  if (!textCanvasElem) {
    textCanvasElem = $("<canvas>")[0];
    const dpr = window.devicePixelRatio;
    textCanvasElem.width = Math.round(width * dpr);
    textCanvasElem.height = Math.round(height * dpr);
    textCanvasElem.style.width = width + "px";
    textCanvasElem.style.height = height + "px";
    let ctx = textCanvasElem.getContext("2d");
    ctx.scale(dpr, dpr);
    $(textSelector).html(textCanvasElem);
  }
  return textCanvasElem;
}

function drawText(posX, posY, text = "HI", font = "48px serif") {
  if (!canvasElem) {
    canvasElem = $(canvasSelector)[0];
  }
  let elem = createOrGetTextCanvas(canvasElem.width, canvasElem.height);
  let ctx = elem.getContext("2d");
  ctx.font = font;
  ctx.fillText(text, posX, posY);
}

function clearText(posX, posY, text = "HI", font = "48px serif") {
  // TODO
}

function clearTextAll() {
  if (!canvasElem) {
    canvasElem = $(canvasSelector)[0];
  }
  let elem = createOrGetTextCanvas(canvasElem.width, canvasElem.height);
  let ctx = elem.getContext("2d");
  ctx.clearRect(0, 0, textCanvasElem.width, textCanvasElem.height);
}

function drawTextBlock(blockX, blockY, text = "HI", font = "48px serif") {
  let { blockWidth, blockHeight } = getBlockWidthHeight();
  if (blockX < 1) {
    blockX = 1;
  }
  if (blockX > BLOCK_COLS) {
    blockX = BLOCK_COLS;
  }
  if (blockY < 1) {
    blockY = 1;
  }
  if (blockY > BLOCK_ROWS) {
    blockY = BLOCK_ROWS;
  }
  let clientX = blockWidth / 2 + blockWidth * (blockX - 1) - parseInt(font) / 2;
  let clientY =
    blockHeight / 2 + blockHeight * (blockY - 1) + parseInt(font) / 2;
  drawText(clientX, clientY, text, font);
}

function clearTextBlock(blockX, blockY) {
  if (!canvasElem) {
    canvasElem = $(canvasSelector)[0];
  }
  let { blockWidth, blockHeight } = getBlockWidthHeight();
  let elem = createOrGetTextCanvas(canvasElem.width, canvasElem.height);
  let ctx = elem.getContext("2d");
  if (blockX < 1) {
    blockX = 1;
  }
  if (blockX > BLOCK_COLS) {
    blockX = BLOCK_COLS;
  }
  if (blockY < 1) {
    blockY = 1;
  }
  if (blockY > BLOCK_ROWS) {
    blockY = BLOCK_ROWS;
  }
  let clientX = blockWidth * (blockX - 1);
  let clientY = blockHeight * (blockY - 1);
  ctx.clearRect(clientX, clientY, blockWidth, blockHeight);
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function bpmPlay(bpm, fn) {
  return setInterval(() => {
    fn();
  }, (60 * 1000) / bpm);
}

function testBpmPlay(bpm = 130, measures = 16, beats = 4) {
  let counter = measures * beats;
  let index = 0;
  let timer = bpmPlay(bpm, function () {
    let x = randomInRange(1, BLOCK_COLS);
    let y = randomInRange(1, BLOCK_ROWS);
    clearTextBlock(x, y);
    triggerClickBlock(x, y);
    drawTextBlock(x, y, index);
    setTimeout(function(){
      clearTextBlock(x, y);
    }, 3000);
    index++;
    console.log(index);
    if (index > counter) {
      clearInterval(timer);
    }
  });
}

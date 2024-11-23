const canvasSelector = "#view > canvas";
let canvasElem = $(canvasSelector)[0];
const textSelector = "#text";
const textCanvasSelector = "#text > canvas";
let textCanvasElem = $(canvasSelector)[0];
const BLOCK_COLS = 8;
const BLOCK_ROWS = 4;

const DEFAULT_FONT = "64px serif";

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

function drawText(posX, posY, text = "HI", font = DEFAULT_FONT) {
  if (!canvasElem) {
    canvasElem = $(canvasSelector)[0];
  }
  let elem = createOrGetTextCanvas(canvasElem.width, canvasElem.height);
  let ctx = elem.getContext("2d");
  ctx.font = font;
  ctx.fillText(text, posX, posY);
}

function clearText(posX, posY, text = "HI", font = DEFAULT_FONT) {
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

function drawTextBlock(blockX, blockY, text = "HI", font = DEFAULT_FONT) {
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

function isBlockAdjoining(block1, block2) {
  if (!block1 || !block2 || block1.length < 2 || block2.length < 2) {
    return false;
  } else {
    return block1[0] == block2[0] || block1[1] == block2[1];
  }
}

function isBlockInList(block, blockList) {
  var hasBlock = blockList.find(function (item) {
    return item[0] === block[0] && item[1] === block[1];
  });
  return !!hasBlock;
}

function isDeadend(block, blockList) {
  return (
    isBlockInList([block[0] - 1, block[1]], blockList) &&
    isBlockInList([block[0] + 1, block[1]], blockList) &&
    isBlockInList([block[0], block[1] - 1], blockList) &&
    isBlockInList([block[0], block[1] + 1], blockList)
  );
}

function isLoop(blockList) {
  // TODO
}

function getRandomAdjoiningBlock(block, currentBlockList, depth = 0) {
  if (depth > currentBlockList.length) {
    if (currentBlockList.length > BLOCK_COLS * BLOCK_ROWS) {
      return [randomInRange(1, BLOCK_COLS), randomInRange(1, BLOCK_ROWS)];
    } else {
      var newBlock = [
        randomInRange(1, BLOCK_COLS),
        randomInRange(1, BLOCK_ROWS),
      ];
      while (isBlockInList(newBlock, currentBlockList)) {
        newBlock = [randomInRange(1, BLOCK_COLS), randomInRange(1, BLOCK_ROWS)];
      }
      return newBlock;
    }
  }
  // TODO dead loop
  var coin = Math.random();
  if (coin < 0.25) {
    // x+1
    var newX = block[0] + 1;
    if (newX <= BLOCK_COLS) {
      var newBlock = [newX, block[1]];
      if (
        !isBlockInList(newBlock, currentBlockList) &&
        !isDeadend(newBlock, currentBlockList.concat(block))
      ) {
        return newBlock;
      } else {
        return getRandomAdjoiningBlock(block, currentBlockList, depth + 1);
      }
    } else {
      return getRandomAdjoiningBlock(block, currentBlockList, depth + 1);
    }
  } else if (coin < 0.5) {
    // x-1
    var newX = block[0] - 1;
    if (newX >= 1) {
      var newBlock = [newX, block[1]];
      if (
        !isBlockInList(newBlock, currentBlockList) &&
        !isDeadend(newBlock, currentBlockList.concat(block))
      ) {
        return newBlock;
      } else {
        return getRandomAdjoiningBlock(block, currentBlockList, depth + 1);
      }
    } else {
      return getRandomAdjoiningBlock(block, currentBlockList, depth + 1);
    }
  } else if (coin < 0.75) {
    // y+1
    var newY = block[1] + 1;
    if (newY <= BLOCK_ROWS) {
      var newBlock = [block[0], newY];
      if (
        !isBlockInList(newBlock, currentBlockList) &&
        !isDeadend(newBlock, currentBlockList.concat(block))
      ) {
        return newBlock;
      } else {
        return getRandomAdjoiningBlock(block, currentBlockList, depth + 1);
      }
    } else {
      return getRandomAdjoiningBlock(block, currentBlockList, depth + 1);
    }
  } else {
    // y-1
    var newY = block[1] - 1;
    if (newY >= 1) {
      var newBlock = [block[0], newY];
      if (
        !isBlockInList(newBlock, currentBlockList) &&
        !isDeadend(newBlock, currentBlockList.concat(block))
      ) {
        return newBlock;
      } else {
        return getRandomAdjoiningBlock(block, currentBlockList, depth + 1);
      }
    } else {
      return getRandomAdjoiningBlock(block, currentBlockList, depth + 1);
    }
  }
}

function randomBlockList(length) {
  var randomFirstBlock = [
    randomInRange(1, BLOCK_COLS),
    randomInRange(1, BLOCK_ROWS),
  ];
  var blockList = [randomFirstBlock];
  var maxBlock = BLOCK_COLS * BLOCK_ROWS;
  for (var i = 1; i < length; i++) {
    if (i < maxBlock) {
      var newBlock = getRandomAdjoiningBlock(blockList[i - 1], blockList);
      blockList.push(newBlock);
    } else {
      blockList.push([
        randomInRange(1, BLOCK_COLS),
        randomInRange(1, BLOCK_ROWS),
      ]);
    }
  }
  return blockList;
}

async function drawTextOnConsecutiveBlockList(text, isTrigger = false, triggerTime = 200) {
  if(!text){
    return;
  }
  var length = text.length;
  var blockList = randomBlockList(length);
  for (var i in blockList) {
    clearTextBlock(blockList[i][0], blockList[i][1]);
    if(isTrigger){
      triggerClickBlock(blockList[i][0], blockList[i][1]);
      await sleep(triggerTime);
    }
    drawTextBlock(blockList[i][0], blockList[i][1], text.charAt(i));
  }
}

async function sleep(time) {
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

function testBpmPlay(lyrics = TEST_LYRICS, bpm = 120, measures = TEST_LYRICS.length, beats = 4) {
  let counter = measures * beats;
  let index = 0;
  let timer = bpmPlay(bpm, function () {
    if(index % beats === 0){
      drawTextOnConsecutiveBlockList(TEST_LYRICS[Math.round(index/beats)], true);
      setTimeout(function () {
        clearTextAll();
      }, 3000);
      console.log(TEST_LYRICS[Math.round(index/beats)]);
    }
    /*
    let x = randomInRange(1, BLOCK_COLS);
    let y = randomInRange(1, BLOCK_ROWS);
    clearTextBlock(x, y);
    triggerClickBlock(x, y);
    drawTextBlock(x, y, TEST_LYRICS[index]);
    */
    index++;
    if (index > counter) {
      clearInterval(timer);
    }
  });
}

// https://moegirl.uk/%E6%99%AE%E9%80%9A%E4%B8%8D%E8%BF%87%E7%9A%84%E4%B8%96%E7%95%8C%E5%BE%81%E6%9C%8D
const TEST_LYRICS = [
  "狭窄教室中的蜗牛",
  "我咂着嘴哼着那旋律",
  "欺负人的孩子 被欺负的孩子",
  "不管哪个都讨厌青椒 重大发现",
  "帅孩子也是 可爱的孩子也是 都是你的",
  "所以 不管是谎言还是真心话都可以的调查",
  "好痛好痛 因为讨厌疼痛",
  "所以不得不抗拒啊",
  "谢谢你 早上好 对不起 所有的话",
  "总有一天会变成让人怀念的话语",
  "不管十四岁还是四十岁 都跳舞吧 啦哒哒哒",
  "谁啊谁啊 来救救大家",
  "焦躁不安 到处乱扔 大奖赛 小孩子可爱的挖苦",
  "恋人也好 侵略者也好 哪个都是大肉块 大实验",
  "牛腰肉也好 燕窝也好 都是你的",
  "所以 间谍的通话记录是秘密啊",
  "好恐怖好恐怖 因为讨厌恐怖",
  "所以才想睡觉",
  "好开心 好难过 恶作剧 所以一切",
  "有一天会被一天到晚地监视",
  "佐藤先生 铃木先生 一起歌唱吧 啦啦啦啦",
  "有一天 有一天 甚至忘记姓名",
  "成为伙伴的话就是圆满结局吗",
  "被伙伴排斥的话去哪里呢",
  "沾满鲜血的护照",
  "选择的瞬间 马上马上 马上就来了",
  "再见 晚安 明天见 所有一切",
  "互不牵绊关系间断的那天会到来",
  "田中先生 高桥先生 开怀大笑吧 啊哈哈哈",
  "谁啊谁啊谁啊谁啊谁啊",
  "谢谢你 早上好 对不起 所有的话",
  "总有一天会变成让人怀念的话语",
  "阴谋论还是 煤气灶 跳舞吧 啦哒哒哒",
  "谁啊谁啊 来救救大家",
];

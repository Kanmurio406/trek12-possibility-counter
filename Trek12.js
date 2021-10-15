const dice1 = [1, 2, 3, 4, 5, 6];
const dice2 = [0, 1, 2, 3, 4, 5];
countOutcome = []; //存放36種骰子組合的計算結果

//五種不同計算功能
const getMax = (dice1, dice2) => {
  if (dice1 > dice2) {
    return dice1;
  } else if (dice2 > dice1) {
    return dice2;
  } else {
    return dice1;
  }
};

const getMin = (dice1, dice2) => {
  if (dice1 < dice2) {
    return dice1;
  } else if (dice2 < dice1) {
    return dice2;
  } else {
    return dice1;
  }
};

const getDifference = (dice1, dice2) => {
  return Math.abs(dice1 - dice2);
};

const getPlus = (dice1, dice2) => {
  return dice1 + dice2;
};

const getMulti = (dice1, dice2) => {
  return dice1 * dice2;
};

//五種功能的開關控制變數(預設開啟)
let maxActive = true;
let minActive = true;
let minusActive = true;
let plusActive = true;
let multiActive = true;

//將計算結果以物件存入countOutcome
//Clear Previous Data
function rawOutcomeCounting() {
  countOutcome = [];
  dice1.forEach((dice1Num) => {
    dice2.forEach((dice2Num) => {
      var outcome = new Object();
      outcome.dice = `${dice1Num}, ${dice2Num}`;
      outcome.value = [];
      //將五種計算分別加入陣列(運用開關變數來調整是否加入)
      if (maxActive) {
        outcome.value.push(getMax(dice1Num, dice2Num));
      }
      if (minActive) {
        outcome.value.push(getMin(dice1Num, dice2Num));
      }
      if (minusActive) {
        outcome.value.push(getDifference(dice1Num, dice2Num));
      }
      if (plusActive) {
        outcome.value.push(getPlus(dice1Num, dice2Num));
      }
      if (multiActive) {
        outcome.value.push(getMulti(dice1Num, dice2Num));
      }
      countOutcome.push(outcome);
    });
  });
}
rawOutcomeCounting(); //First time raw outcome counting

//計算14種數字出現的機率（在36組中出現幾組）
numsFoundInfo = [];
numsWanted = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; //有要尋找的有效數字(預設到12)

//計算機率的總功能
function rateCounting() {
  //Clear Previous Data
  numsFoundInfo = [];
  //給每個數字建立一個物件放入numsFoundInfo
  numsWanted.forEach((numWanted) => {
    var numInfo = new Object();
    numInfo.num = numWanted;
    numInfo.times = 0;
    numInfo.rates = 0;
    numsFoundInfo.push(numInfo);
  });
  //給超過最大尋找數字(12)的數字建立一個物件放入numsFoundInfo
  var aboveMax = new Object();
  aboveMax.num = `Higher than ${numsWanted[numsWanted.length - 1]}`;
  aboveMax.times = 0;
  aboveMax.rates = 0;
  numsFoundInfo.push(aboveMax);

  countOutcome.forEach((outcome) => {
    //遍歷countOutcome裡所有物件
    //計算0~12的出現次數
    numsWanted.forEach((numsWanted) => {
      //遍歷numsWanted的所有數字
      if (outcome.value.includes(numsWanted)) {
        //如果該物件value陣列中包含numsWanted此次的數字
        numsFoundInfo[numsWanted].times += 1; //用numsWanted當index，去增加對應的numsFoundInfo的times
      }
    });
    //計算大於12的數字出現次數
    let numAboveMaxExist = false;
    outcome.value.forEach((value) => {
      //遍歷該物件的每個value
      if (value > numsWanted[numsWanted.length - 1]) {
        numAboveMaxExist = true;
      }
    });
    if (numAboveMaxExist) {
      numsFoundInfo[numsFoundInfo.length - 1].times += 1;
    }
  });

  numsFoundInfo.forEach((num) => {
    num.rates = `${((num.times / (dice1.length * dice2.length)) * 100).toFixed(
      1
    )}%`;
  });
}
rateCounting(); //First time rate counting

//Create tbody Contents 數據資料顯示的功能
function dataDisplay() {
  let tBody = document.querySelector(".table").children[1];
  //Clear previous Data
  tBody.innerHTML = ``;
  //Create Contents
  numsFoundInfo.forEach((numInfo) => {
    let tbContentHTML = `
  <tr>`;
    tbContentHTML = `
  <td>${numInfo.num}</td>
  <td>${numInfo.rates}</td>
  <td>${numInfo.times}</td>
  `;
    tbContentHTML += `</tr>
  `;
    tBody.innerHTML += tbContentHTML;
  });
}
dataDisplay(); //First time Display

//RefreshData
function refreshData() {
  rawOutcomeCounting();
  rateCounting();
  dataDisplay();
}

//Button Function
let buttons = document.querySelector(".buttons");
buttons.addEventListener("click", (event) => {
  let targetClass = event.target.classList; //指派被按到的按鈕的classList被存入變數
  if (targetClass.contains("max")) {
    maxActive = !maxActive; //反轉指定開關變數的true/false
    refreshData(); //更新資料
    targetClass.toggle("checked"); //開關按鈕刪除樣式
  } else if (targetClass.contains("min")) {
    minActive = !minActive;
    refreshData();
    targetClass.toggle("checked");
  } else if (targetClass.contains("minus")) {
    minusActive = !minusActive;
    refreshData();
    targetClass.toggle("checked");
  } else if (targetClass.contains("plus")) {
    plusActive = !plusActive;
    refreshData();
    targetClass.toggle("checked");
  } else if (targetClass.contains("multi")) {
    multiActive = !multiActive;
    refreshData();
    targetClass.toggle("checked");
  }
});

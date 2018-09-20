let submit1 = document.getElementById('submit1');
let submit2 = document.getElementById('submit2');
let submit3 = document.getElementById('submit3');
let reset = document.getElementById('reset');
let rowsNum = document.getElementById('rowsNum');
let columnsNum = document.getElementById('columnsNum');
let splitColor = document.getElementById('splitColor');
let sameTime = document.getElementById('sameTime');
let x = document.getElementById('x');
let y = document.getElementById('y');
const bgColor = [0, 45, 152];
let bgcolorList;

submit1.onclick = () => {
  x.value = columnsNum.value;
  y.value = rowsNum.value;
  let h = y.value;
  let w = x.value;
  let text = "";
  let classN = "";
  bgcolorList = [
    [],
    []
  ];
  let splits = splitColor.value;
  let bglist = bgSplit_f(bgColor, splits);
  for (const rgb of bglist[0]) {
    bgcolorList[0].push(rgbSt(rgb));
  }
  for (const rgb of bglist[1]) {
    bgcolorList[1].push(rgbSt(rgb));
  }
  // テーブルの作成
  if (h && w) {
    let result = document.getElementById('result');
    if (h < 6 && w < 11) {
      classN = "small-table";
    } else if (h < 25 && w < 26) {
      classN = "mid-table";
    } else {
      classN = "large-table";
    }
    let count = 0;
    text += "<table id='testTB' class='" + classN + "'><tbody>";
    for (let i = 0; i < h; i++) {
      text += "<tr>";
      for (let j = 0; j < w; j++) {
        count++;
        text += "<td>" + count + "</td>";
      }
      text += "</tr>";
    }
    text += "</tbody></table>";
    result.innerHTML = text;
    colorlist(bgcolorList, result, document.getElementById('testTB'));
  }
  // テーブルの作成おわり
};

// 初期化
submit1.click();

submit2.onclick = () => {
  let maxElement = x.value * y.value;
  let table = document.getElementById('testTB');
  let resultEle = document.getElementById('Gets-counts');
  resultEle.style = '';
  resultEle.innerText =
    changeRandom(table, 1, maxElement, sameTime.value);

};

reset.onclick = () => {
  let table = document.getElementById('testTB');
  if (table !== 'undefined') {
    for (const iterator of table.rows) {
      for (const cell of iterator.cells) {
        cell.style = "";
      }
    }
  }
  document.getElementById('Gets-counts').innerHTML = "";
}

submit3.onclick = () => {
  reset.click();
  let maxElement = x.value * y.value;
  let text;
  let check;

  if (maxElement >= sameTime.value) {
    let table = document.getElementById('testTB');
    let i = 0;
    let wrapper = document.createElement('div');
    let resultTB = document.createElement("table");
    resultTB.className = "resultTB";
    document.getElementById('Gets-counts').appendChild(wrapper);
    wrapper.appendChild(resultTB);
    let loop = setInterval(() => {

      // テーブル上でスタイルが当たっていないものを探す。
      check = (() => {
        for (const iterator of table.rows) {
          for (const cell of iterator.cells) {
            if (cell.style.color == "") {
              return false;
            }
          }
        }
        return true;
      })();

      if (check) {
        let strNode = document.createTextNode('ループ実行回数：' + i);
        wrapper.insertBefore(strNode, resultTB);
        if (i < 1) {
          resultTB.remove();
        }
        clearInterval(loop);
      } else {
        text = changeRandom(table, 1, maxElement, sameTime.value);
        if (typeof text == 'String') {
          clearInterval(loop);
        }
        i++;
        let rowT = resultTB.insertRow(-1);
        rowT.insertCell(-1).innerText = i;
        rowT.insertCell(-1).innerText = text;
      }
    }, 50);
  } else {
    let errEle = document.createElement('div');
    errEle.style.color = "red";
    errEle.innerText = "ランダム抽出数がエレメントの数より多く設定されています";
    document.getElementById('Gets-counts').appendChild(errEle);
  }
}


/**
 * 決められた範囲からランダムにn個抽出する
 *
 * @param {Number} min 生成値の最小値
 * @param {Number} max 生成値の最大値
 * @param {Number} numn 同時に抽出する個数
 * @returns  {Number[]} 生成した値の配列 (順序は生成順)
 */
function getRandom(min, max, numn) {
  let length = max - min + 1;
  let array1 = new Array(length);
  let random;

  if (numn < 1 || numn > length) {
    return "";
  }


  for (let i = 0; i < length; i++) {
    array1[i] = min + i;
  }

  for (let i = length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array1[i], array1[j]] = [array1[j], array1[i]];
  }
  random = array1.slice(0, numn);
  return random;
}
/**
 * 対象のTableをランダムに1回塗りつぶす
 *
 * @param {HTMLTableElement} table 操作対象のTableElement
 * @param {Number} min 抽出の最小値
 * @param {Number} max 抽出の最大値
 * @param {Number} num 同時に抽出する数
 * @returns {String} カンマ区切りの塗りつぶしを行った番地、またはエラーメッセージ
 */
function changeRandom(table, min, max, num) {
  let Count = max - min + 1;

  if (Count >= num) {
    let row;
    let column;
    let element;
    let text;
    let i;
    let rdmArray = getRandom(min, max, num);
    for (let random of rdmArray) {
      column = (random - 1) % x.value;
      row = (random - column - 1) / x.value;
      element = table.rows[row].cells[column];
      if (element.style.backgroundColor == "") {
        element.style.backgroundColor = bgcolorList[0][0];
        element.style.color = bgcolorList[1][0];
      } else {
        i = bgcolorList[0].indexOf(element.style.backgroundColor);
        if (i < (bgcolorList[0].length - 1)) {
          element.style.backgroundColor = bgcolorList[0][i + 1];
          element.style.color = bgcolorList[1][i + 1];
        }
      };
    }
    text = rdmArray[0];
    for (let i = 1; i < rdmArray.length; i++) {
      text = text + ", " + rdmArray[i];
    }
    return text;
  }
  splitColor.focus();
  return "ランダム抽出数がエレメントの数より多く設定されています";
}

function rgbSt(rgb) {
  let a = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  return a;
}

function colorlist(clist, element, node) {
  let tmp;
  for (let index in clist[0]) {
    tmp = document.createElement('div');
    tmp.style.backgroundColor = clist[0][index];
    tmp.style.color = clist[1][index];
    tmp.style.display = 'inline-block';
    tmp.style.width = "20px";
    tmp.style.height = "20px";
    tmp.style.textAlign = "center";
    tmp.style.marginBottom = '10px';
    tmp.innerText = (Number(index) + 1);
    element.insertBefore(tmp, node);
  }
}

function bgSplit_f(rgb, split) {
  let hsl = rgb2hsl(rgb);
  let l = hsl[2];
  let diff = 0;
  let array = [
    [],
    []
  ];
  let hsl2 = hsl;

  if (l > 0) {
    diff = (1 - l) / split;
  } else {
    return [rgb];
  }

  for (i = 1; i <= split; i++) {
    hsl2[2] = 1 - i * diff;
    let tmp;
    if (hsl2[2] > 0.7) {
      tmp = "#3f3f3f";
    } else if (hsl2[2] > 0.55) {
      tmp = "#1d1d1d";
    } else if (hsl2[2] > 0.3) {
      tmp = '#dfdfdf';
    } else {
      tmp = '#efefef';
    }

    // array[0]に背景色
    // array[1]に文字色を格納。背景が濃ければ、明るく、薄ければ暗い文字色になる。
    array[0].push(hsl2rgb(hsl2));
    array[1].push(colorCode2RGB(tmp));
  }

  return array;

}

function rgbSplit(rgb, split) {
  let hsl = rgb2hsl(rgb);
  let l = hsl[2];
  let diff = 0;
  let rgbArray = new Array();
  let hsl2 = hsl;

  if (l > 0) {
    diff = l / split;
  } else {
    return [rgb];
  }

  for (i = 1; i <= split; i++) {
    hsl2[2] = 1 - i * diff;
    rgbArray.push(hsl2rgb(hsl2));
  }
  return rgbArray;

}

function colorcodeSplit(code, split) {
  let rgb = colorCode2RGB(code);
  let rgbArray = rgbSplit(rgb, split);
  return rgbArray.map(value => {
    return RGB2colorCode(value);
  });
}

function colorCode2RGB(code) {
  let color = code.substr(1);
  let rgb = [0, 0, 0];
  switch (color.length) {
    case 3:
      let array1 = color.split('');
      color = "" + array1[0] + array1[0] + array1[1] + array1[1] + array1[2] + array1[2];
    case 6:
      let num1 = color.substr(0, 2);
      let num2 = color.substr(2, 2);
      let num3 = color.substr(4, 2);
      rgb[0] = parseInt(num1, 16);
      rgb[1] = parseInt(num2, 16);
      rgb[2] = parseInt(num3, 16);
      break;
    default:
      break;
  }
  return rgb;
}

function RGB2colorCode(rgb) {
  return "#" + rgb[0].toString(16) + rgb[1].toString(16) + rgb[2].toString(16);
}

// h 0-360
// s 0-1
// l 0-1
function rgb2hsl(rgb) {
  let r = rgb[0] / 255;
  let g = rgb[1] / 255;
  let b = rgb[2] / 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let diff = max - min;

  let h = 0;
  let l = (max + min) / 2;
  let s = diff / (1 - (Math.abs(max + min - 1)));

  switch (min) {
    case max:
      h = 0;
      break;

    case r:
      h = (60 * ((b - g) / diff)) + 180;
      break;

    case g:
      h = (60 * ((r - b) / diff)) + 300;
      break;

    case b:
      h = (60 * ((g - r) / diff)) + 60;
      break;
  }

  return [h, s, l];
}

// h 0-360
// s 0-1
// l 0-1
function hsl2rgb(hsl) {

  let h = hsl[0];
  let s = hsl[1];
  let l = hsl[2];

  let max = l + (s * (1 - Math.abs((2 * l) - 1)) / 2);
  let min = l - (s * (1 - Math.abs((2 * l) - 1)) / 2);

  let rgb;
  let i = Math.floor(h / 60);

  switch (i) {
    case 0:
      rgb = [max, min + (max - min) * (h / 60), min];
      break;

    case 1:
      rgb = [min + (max - min) * ((120 - h) / 60), max, min];
      break;

    case 2:
      rgb = [min, max, min + (max - min) * ((h - 120) / 60)];
      break;

    case 3:
      rgb = [min, min + (max - min) * ((240 - h) / 60), max];
      break;

    case 4:
      rgb = [min + (max - min) * ((h - 240) / 60), min, max];
      break;

    case 6:
    case 5:
      rgb = [max, min, min + (max - min) * ((360 - h) / 60)];
      break;
  }

  for (let index in rgb) {
    let tmp = Math.round(rgb[index] * 255);
    if (tmp == -0) {
      tmp = 0;
    }
    rgb[index] = tmp;
  }
  return rgb;

}

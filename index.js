var nj = require("numjs");
const fs = require("fs");

function rle_to_mat(rle_array, inner_shape) {
  var mat = [];
  for (let i = 0; i < rle_array.length; i++) {
    const val = parseInt(rle_array[i]);
    mat = mat.concat(new Array(val).fill(i % 2));
  }

  var matNew = nj.array(mat);
  var anotherMat = matNew.reshape(inner_shape);
  return anotherMat;
}

function processLineByLine(textFile) {
  let rawdata = fs.readFileSync(textFile);
  const result = rawdata.toString().split(/\r?\n/);

  return result;
}

function compute_dice(mask1, mask2) {
  const multiplyMatrix = nj.multiply(mask1, mask2);
  const intersect = nj.sum(multiplyMatrix);
  console.log(intersect);

  const fsum = nj.sum(mask1);
  const ssum = nj.sum(mask2);
  var dice = (2 * intersect) / (fsum + ssum + 0.00001);
  dice = nj.mean(dice);
  dice = dice.toFixed(3);
  return dice;
}


const shape = [512, 512];
let rawdata = fs.readFileSync("ret.json");
let student = JSON.parse(rawdata);
const arr1 = student.result[0].data.mask;

const mask = rle_to_mat(arr1, shape);

const rle2 = processLineByLine("array2.txt");

// # mask1 = rle_to_mat(rle1, shape)
const mask2 = rle_to_mat(rle2, shape);

output = compute_dice(mask, mask2);
console.log(output);
// console.log(mask)
// console.log('aaaaaaaaaaaaaaaaaaa')

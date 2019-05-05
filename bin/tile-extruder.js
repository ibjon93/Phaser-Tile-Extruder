#!/usr/bin/env node

const program = require("commander");
const tileExtruder = require("../index");

const toInt = v => parseInt(v, 10);
const toHex = v => parseInt(v, 16);

program
  .version("1.0.0")
  .description("A simple Node module for extruding the edges of tiles to prevent tearing between frames in 2D tile-based game engines.")
  .option("-w, --tileWidth <integer>", "tile width in pixels", toInt)
  .option("-h, --tileHeight <integer>", "tile height in pixels", toInt)
  .option("-i, --input <path>", "the path to the tileset you want to extrude")
  .option("-o, --output <path>", "the path to output the extruded tileset image")
  .option("-c, --color [hex=0x00000000]", "RGBA hex color to use for the background color, only matters if there's margin or spacing (default: transparent)", toHex)
  .option("-m, --margin [integer=0]","number of pixels between tiles and the edge of the tileset image", toInt, 0)
  .option("-p, --padding [integer=0]", "number of pixels between neighboring tiles", toInt, 0)
  .option("-e, --extrudeAmt [integer=1]", "number of pixels to extrude each tile by", toInt, 1)
  .parse(process.argv);

const {
  tileWidth,
  tileHeight,
  margin,
  padding,
  color,
  extrudeAmt,
  input: inputPath,
  output: outputPath
} = program;

if (!tileWidth) {
  console.log("\nMissing tileWidth! See help below for usage information:");
  program.help();
}
if (!tileHeight) {
  console.log("\nMissing tileHeight! See help below for usage information:");
  program.help();
}
if (!inputPath) {
  console.log("\nMissing path to tileset image! See help below for usage information:");
  program.help();
}
if (!outputPath) {
  console.log("\nMissing path save extruded tileset image! See help below for usage information:");
  program.help();
}
if(!Number.isInteger(tileWidth)){
  console.error('Non-integer value specified for TILE WIDTH with value: ' + tileWidth +'. Please enter an integer value for this parameter.')
}
if(!Number.isInteger(tileHeight)){
  console.error('Non-integer value specified for TILE HEIGHT with value: ' + tileHeight +'. Please enter an integer value for this parameter.')
}
if(!Number.isInteger(margin)){
  console.error('Non-integer value specified for MARGIN with value: ' + margin +'. Please enter an integer value for this parameter.')
}
if(!Number.isInteger(padding)){
  console.error('Non-integer value specified for PADDING with value: ' + padding +'. Please enter an integer value for this parameter.')
}
if(!Number.isInteger(extrudeAmt)){
  console.error('Non-integer value specified for EXTRUDE AMOUNT with value: ' + extrudeAmt +'. Please enter an integer value for this parameter.')
}

tileExtruder(tileWidth, tileHeight, inputPath, outputPath, { margin, padding, color, extrudeAmt});
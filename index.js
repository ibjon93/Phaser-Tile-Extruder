var Jimp = require('jimp');

var extrudedTilemap;

var newImgWidth;
var newImgHeight;

var tw;
var th;

/**
  * Required Parameters
  * ------------------------------------------------------------------------------------------------------
  * @param {integer} tileWidth - tile width in pixels
  * @param {integer} tileHeight - tile height in pixels
  * @param {string} inputPath - the path to the tileset you want to extrude
  * @param {string} outputPath - the path to output the extruded tileset image
  *
  * Optional Parameters
  * ------------------------------------------------------------------------------------------------------
  * @param {object} [options] - optional settings
  * @param {integer} [options.margin=0] - number of pixels between tiles and the edge of the tileset image
  * @param {integer} [options.padding=0] - number of pixels between neighboring tiles
  * @param {number} [options.color=0x00000000] - RGBA hex color to use for the background color, only matters if there's margin or padding (default: transparent)
  * @param {integer} [options.extrudeAmt = 1] - numebr of pixels each tile should be extruded by
*/
module.exports = function tileExtruder(
	tileWidth, 
	tileHeight, 
	input, 
	output, 
	{
		margin = 0,
		padding = 0,
		color = 0x00000000,
		extrudeAmt = 1
	} = {}
){
	(async () => {
		
	tw = tileWidth;
	th = tileHeight;

	var image = await Jimp.read(input).catch(err =>{
		console.error(`Tileset image not loaded from: ${inputPath}`);
		process.exit(1);
	});

	const imgWidth = image.bitmap.width;
	const imgHeight = image.bitmap.height;

	//calculate the number of rows and columns of tiles in tilemap
	const numCols = (imgWidth - 2 * margin + padding) / (tileWidth + padding);
    const numRows = (imgHeight - 2 * margin + padding) / (tileHeight + padding);

	//Calculate new dimensions for extruded tiles
	var extrudedTileWidth = tileWidth + extrudeAmt * 2;
	var extrudedTileHeight = tileHeight + extrudeAmt * 2; 

	//Calculate the dimensions of the new tilemap
	const newWidth = margin * 2 + (numCols * extrudedTileWidth) + numCols * padding
	const newHeight = margin * 2 + (numRows * extrudedTileHeight) + numRows * padding

	//Create a new, empty image for the extruded tiles to be written to
	extrudedTilemap = new Jimp(newWidth, newHeight, color);

	for(let y = 0; y < numRows; y++){
  		for(let x = 0; x < numCols; x++){
			copyTiles(image, x, y, 1, 1, extrudedTileWidth, extrudedTileHeight);				
  		}
  	}
  	extrudedTilemap.write(output);
  })();
};
async function copyTiles(src,x,y, offsetX, offsetY, extrudedTileWidth, extrudedTileHeight){
	var srcX = x * tw;
	var srcY = y * th;
	var destX = x * extrudedTileWidth;
	var destY = y * extrudedTileHeight;
	try{
		//Original tile
		extrudedTilemap.blit(src, destX + offsetX , destY + offsetY, srcX ,srcY ,tw,th);

		//Edges: Top, Left, Right, Bottom
		extrudedTilemap.blit(src, destX + offsetX, destY, srcX , srcY , tw, 1);
		extrudedTilemap.blit(src, destX, destY + offsetY, srcX , srcY , 1, th);
		extrudedTilemap.blit(src, destX + offsetX + tw, destY + offsetY, srcX + tw - 1 ,srcY , 1, th);
		extrudedTilemap.blit(src, destX + offsetX, destY + offsetY + th, srcX ,srcY + th - 1 , tw, 1);

		// //Corners: Top-Left, Top-Right, Bottom-Left, Bottom-Right
		extrudedTilemap.blit(src, destX, destY, srcX ,srcY , 1, 1);
		extrudedTilemap.blit(src, destX + offsetX + tw, destY, srcX + tw - 1,srcY , 1, 1);
		extrudedTilemap.blit(src, destX, destY + offsetY + th, srcX ,srcY + th - 1, 1, 1);
		extrudedTilemap.blit(src, destX + offsetX + tw, destY + offsetY + th, srcX + tw - 1,srcY + th - 1, 1, 1);
		return "tile copied";
	}catch(err){
		console.log('something went wrong while copying tiles');
	}
}


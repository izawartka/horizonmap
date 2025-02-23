import Constants from './constants';

async function loadTilesInBounds(tileBounds, zoom) {
    const promises = [];
    const { northTile, southTile, eastTile, westTile } = tileBounds;

    for(let x = westTile; x <= eastTile; x++) {
        for(let y = northTile; y <= southTile; y++) {
            promises.push(loadTile(x, y, zoom).then(image => ({ x, y, image })));
        }
    }

    return await Promise.all(promises);
}

async function loadTile(x, y, z) {
    const url = Constants.heightmap.url(x, y, z);
    return await getImage(url);
}

const cachedImages = {};

function getImage(url) {
    return new Promise((resolve, reject) => {
        if(cachedImages[url]) {
            resolve(cachedImages[url]);
            return;
        }
        
        try {
            const image = new Image();
            image.crossOrigin = 'Anonymous';
            image.onload = () => {
                resolve(image);
                cachedImages[url] = image;
            };
            image.onerror = () => {
                resolve(null);
            };
            image.src = url;
        } catch (error) {
            resolve(null);
        }
    });
}

function combineTiles(tiles, tileBounds) {
    const width = (tileBounds.eastTile - tileBounds.westTile + 1) * Constants.heightmap.tileSize;
    const croppedWidth = width - tileBounds.westX - (Constants.heightmap.tileSize - tileBounds.eastX);
    const height = (tileBounds.southTile - tileBounds.northTile + 1) * Constants.heightmap.tileSize;
    const croppedHeight = height - tileBounds.northY - (Constants.heightmap.tileSize - tileBounds.southY);

    const canvas = new OffscreenCanvas(
        Math.ceil(croppedWidth),
        Math.ceil(croppedHeight)
    );
    const ctx = canvas.getContext('2d');

    for(const tile of tiles) {
        if(!tile.image) continue;

        const x = (tile.x - tileBounds.westTile) * Constants.heightmap.tileSize - tileBounds.westX;
        const y = (tile.y - tileBounds.northTile) * Constants.heightmap.tileSize - tileBounds.northY;
        ctx.drawImage(tile.image, x, y);
    }

    return ctx.getImageData(0, 0, croppedWidth, croppedHeight);
}

const Heightmap = {
    loadTilesInBounds,
    loadTile,
    getImage,
    combineTiles
};

export default Heightmap;
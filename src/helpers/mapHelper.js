import Constants from "./constants";

function getCircleBounds(lat, lng, radius) {
    const earthLatCircle = 40008;
    const earthLngCircle = 40075;

    const latDeg = (radius / earthLatCircle) * 360;
    const lngCircleHere = earthLngCircle * Math.cos(lat * Math.PI / 180);
    const lngDeg = (radius / lngCircleHere) * 360;

    return {
        north: lat + latDeg,
        south: lat - latDeg,
        east: lng + lngDeg,
        west: lng - lngDeg
    };
}

function latLngBoundsToPixel(bounds, zoom, map) {
    const { north, south, east, west } = bounds;
    const ne = map.project({ lat: north, lng: east }, zoom);
    const sw = map.project({ lat: south, lng: west }, zoom);

    return {
        north: ne.y,
        south: sw.y,
        east: ne.x,
        west: sw.x,
    };
}

function pixelBoundsToTileCoords(pixelBounds) {
    const { north, south, east, west } = pixelBounds;

    return {
        northTile: Math.floor(north / Constants.heightmap.tileSize),
        northY: north % Constants.heightmap.tileSize,
        southTile: Math.floor(south / Constants.heightmap.tileSize),
        southY: south % Constants.heightmap.tileSize,
        eastTile: Math.floor(east / Constants.heightmap.tileSize),
        eastX: east % Constants.heightmap.tileSize,
        westTile: Math.floor(west / Constants.heightmap.tileSize),
        westX: west % Constants.heightmap.tileSize,
    };
}

const mapHelper = {
    getCircleBounds,
    latLngBoundsToPixel,
    pixelBoundsToTile: pixelBoundsToTileCoords,
};

export default mapHelper;
const Constants = {
    startPos: [50.06, 19.93],
    startZoom: 10,
    marker: {
        startPos: {lat: 50.0617, lng: 19.9377},
        minRadius: 10,
        maxRadius: 50,
        defaultRadius: 10,
        radiusStep: 10,
        previewColor: '#4488ff',
        previewWeight: 2,
        previewOpacity: 0.2,
    },
    debug: {
        displayPosition: false,
    },
    heightmap: {
        url: (x, y, z) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`,
        tileSize: 256,
        minZoom: 10,
        maxZoom: 14,
        defaultZoom: 12,
    },
    horizon: {
        minRays: 360 * 2,
        maxRays: 360 * 8,
        defaultRays: 360 * 4,
        raysStep: 360,
        minHeightOffset: 0,
        maxHeightOffset: 100,
        defaultHeightOffset: 2,
        overlayAlpha: 0.7,
        defaultIncludeCurvature: true,
    }
};

export default Constants;
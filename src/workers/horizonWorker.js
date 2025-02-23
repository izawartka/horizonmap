/* eslint-disable no-restricted-globals */
import Horizon from "../helpers/horizon";

self.onmessage = function (event) {
    const { combinedTiles, heightOffset, rays, radius, includeCurvature } = event.data;

    Horizon.processTiles(combinedTiles, heightOffset, rays, radius, includeCurvature).then(imageData => {
        self.postMessage(imageData);
    });
};

export {};
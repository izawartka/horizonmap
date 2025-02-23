import { useRef, useContext, useEffect, useCallback, useState } from "react";
import MainContext from "../../contexts/MainContext";
import Heightmap from "../../helpers/heightmap";
import MapHelper from "../../helpers/mapHelper";
import Horizon from "../../helpers/horizon";

const createWorker = () => new Worker(new URL("../../workers/horizonWorker.js", import.meta.url), { type: "module" });

export default function HorizonManager() {
    const { map, markerPos, radius, setHorizonData, heightmapZoom, heightOffset, rays, includeCurvature, setInProgress } = useContext(MainContext);
    const horizonWorkerRef = useRef(null);
    const [firstStageData, setFirstStageData] = useState(null);

    const safeSetInProgress = useCallback((stage) => {
        if(stage <= 0) return setInProgress(stage);

        let alreadyInProgress = false;
        setInProgress((old) => {
            alreadyInProgress = old >= stage;
            return stage;
        });
        return alreadyInProgress;
    }, [setInProgress]);

    const loadHeightmaps = useCallback(async () => {
        if (!map) return;
        if (safeSetInProgress(1)) return;

        const circleBounds = MapHelper.getCircleBounds(markerPos.lat, markerPos.lng, radius);
        const pixelBounds = MapHelper.latLngBoundsToPixel(circleBounds, heightmapZoom, map);
        const tileBounds = MapHelper.pixelBoundsToTile(pixelBounds);
        const tiles = await Heightmap.loadTilesInBounds(tileBounds, heightmapZoom);
        const combinedTiles = Heightmap.combineTiles(tiles, tileBounds);

        setFirstStageData({ combinedTiles, circleBounds, radius });
    }, [map, markerPos, radius, heightmapZoom, setFirstStageData, safeSetInProgress]);

    const generateHorizon = useCallback(() => {
        if (!firstStageData || !firstStageData.combinedTiles) return;
        if (safeSetInProgress(2)) return;

        if (!horizonWorkerRef.current) {
            horizonWorkerRef.current = createWorker();
        }

        horizonWorkerRef.current.onmessage = (event) => {
            setHorizonData({
                dataUrl: Horizon.getDataUrlFromImageData(event.data),
                circleBounds: firstStageData.circleBounds,
            });
            safeSetInProgress(0);
        };

        horizonWorkerRef.current.postMessage({
            combinedTiles: firstStageData.combinedTiles,
            heightOffset,
            rays,
            radius: firstStageData.radius,
            includeCurvature
        });
    }, [firstStageData, heightOffset, rays, includeCurvature, setHorizonData, safeSetInProgress]);

    useEffect(() => {
        loadHeightmaps();
    }, [loadHeightmaps]);

    useEffect(() => {
        generateHorizon();

        return () => {
            horizonWorkerRef.current?.terminate();
            horizonWorkerRef.current = null;
        };
    }, [generateHorizon]);

    return null;
}

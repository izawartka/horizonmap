import L from "leaflet";
import { useEffect, useContext, useMemo } from "react";
import { useMap } from "react-leaflet";
import MainContext from "../../contexts/MainContext";

export default function HorizonOverlay() {
    const { horizonData } = useContext(MainContext);
    const map = useMap();

    const overlay = useMemo(() => {
        if (!map) return null;
        if (!horizonData) return null;
        
        return L.imageOverlay(horizonData.dataUrl, [
            [horizonData.circleBounds.north, horizonData.circleBounds.west],
            [horizonData.circleBounds.south, horizonData.circleBounds.east]
        ]);
    }, [map, horizonData]);

    useEffect(() => {
        if (overlay) {
            overlay.addTo(map);
        }

        return () => {
            if (overlay) {
                overlay.remove();
            }
        };
    }, [overlay, map]);

    return null;
};
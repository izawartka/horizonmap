import { useContext, useEffect, useMemo } from 'react';
import MainContext from '../../contexts/MainContext';
import L from 'leaflet';
import Constants from '../../helpers/constants';

export default function RadiusPreview() {
    const { map, markerPos, radius } = useContext(MainContext);

    const circle = useMemo(() => {
        if (!map) return null;
        return L.circle(markerPos, {
            latLng: markerPos,
            radius: radius * 1000,
            color: Constants.marker.previewColor,
            weight: Constants.marker.previewWeight,
            fillOpacity: Constants.marker.previewOpacity,
        });
    }, [map, markerPos, radius]);

    useEffect(() => {
        if (circle) {
            circle.addTo(map);
        }

        return () => {
            if (circle) {
                circle.remove();
            }
        };
    }, [circle, map]);

    return null;
}
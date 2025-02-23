import React, { useRef, useMemo, useContext } from "react";
import { Marker } from "react-leaflet";
import MainContext from "../../contexts/MainContext";

export default function DraggableMarker(props) {
    const { markerPos, setMarkerPos, inProgress } = useContext(MainContext);
    const markerRef = useRef(null);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    setMarkerPos(marker.getLatLng())
                }
            },
        }),
        [setMarkerPos]
    );
        
    return (
    <Marker
        draggable={inProgress === 0}
        eventHandlers={eventHandlers}
        position={markerPos}
        ref={markerRef} 
    />
    );
}
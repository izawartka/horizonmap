import { useCallback, useContext, useEffect, useState } from 'react';
import MainContext from '../../contexts/MainContext';

export default function MarkerMove() {
    const { map, markerPos, setMarkerPos, inProgress } = useContext(MainContext);
    const [position, setPosition] = useState(null);

    const moveMarker = useCallback(() => {
        if (position) {
            setMarkerPos(position);
        }
    }, [position, setMarkerPos]);

    const goToMarker = useCallback(() => {
        if (markerPos) {
            map.setView(markerPos);
        }
    }, [map, markerPos]);
    
    const onMove = useCallback(() => {
        setPosition(map.getCenter());
    }, [map]);

    useEffect(() => {
        map.on('move', onMove);
        return () => {
            map.off('move', onMove);
        };
    }, [map, onMove]);

    return (
        <>
        <button onClick={moveMarker} className='move-marker-here' disabled={inProgress !== 0}>
            Move the marker here
        </button>
        <button onClick={goToMarker} className='go-to-marker'>
            Go to the marker
        </button>
        </>
    );
}
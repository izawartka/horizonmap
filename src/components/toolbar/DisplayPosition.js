import { useState, useEffect, useCallback, useContext } from 'react'
import Constants from '../../helpers/constants'
import MainContext from '../../contexts/MainContext'

export default function DisplayPosition() {
    const { map } = useContext(MainContext);
    const [position, setPosition] = useState(() => map.getCenter());
    const [zoom, setZoom] = useState(() => map.getZoom());

    const onReset = useCallback(() => {
        map.setView(Constants.startPos, Constants.startZoom);
    }, [map]);

    const onMove = useCallback(() => {
        setPosition(map.getCenter());
    }, [map]);

    const onZoom = useCallback(() => {
        setZoom(map.getZoom());
    }, [map]);

    useEffect(() => {
        map.on('move', onMove)
        map.on('zoom', onZoom)
        return () => {
        map.off('move', onMove)
        map.off('zoom', onZoom)
        }
    }, [map, onMove, onZoom]);
    
    return (
        <div className='position'>
            latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{' '}, zoom: {zoom}
            <button onClick={onReset}>Reset</button>
        </div>
    );
}
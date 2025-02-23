import { useContext, useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import Constants from '../../helpers/constants';
import DraggableMarker from './DraggableMarker';
import RadiusPreview from './RadiusPreview';
import MainContext from '../../contexts/MainContext';
import './Map.css';
import HorizonOverlay from '../horizon/HorizonOverlay';

export default function Map(props) {
    const { setMap } = props;
    const { showOverlay, horizonData } = useContext(MainContext);

    const displayMap = useMemo(
        () => (
            <MapContainer 
                center={Constants.startPos} 
                zoom={Constants.startZoom} 
                scrollWheelZoom={true} 
                style={{ height: '100%' }} 
                ref={setMap}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                { showOverlay && horizonData && <HorizonOverlay />}
                <DraggableMarker />
            </MapContainer>
        ),
        [setMap, showOverlay, horizonData]
    );

    return (
        <div className='map'>
            {displayMap}   
            <RadiusPreview />
        </div>
    )
}
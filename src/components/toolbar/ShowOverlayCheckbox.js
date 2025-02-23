import { useContext } from 'react'
import MainContext from '../../contexts/MainContext'

export default function ShowOverlayCheckbox() {
    const { showOverlay, setShowOverlay, inProgress } = useContext(MainContext);

    return (
        <div className='toggle-heightmap'>
            <input type='checkbox' id="toggle-heightmap-input" disabled={inProgress !== 0} checked={showOverlay} onChange={() => setShowOverlay(!showOverlay)} />
            <label htmlFor="toggle-heightmap-input">Show overlay</label>
        </div>
    );
}
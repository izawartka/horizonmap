import { useContext } from 'react'
import MainContext from '../../contexts/MainContext'

export default function ToggleOverlay() {
    const { showOverlay, setShowOverlay, inProgress } = useContext(MainContext);

    return (
        <div className='toggle-overlay'>
            <input type='checkbox' id="toggle-overlay-checkbox" disabled={inProgress !== 0} checked={showOverlay} onChange={() => setShowOverlay(!showOverlay)} />
            <label htmlFor="toggle-overlay-checkbox">Show overlay</label>
        </div>
    );
}
import { useContext } from 'react'
import MainContext from '../../contexts/MainContext'

export default function ToggleCurvature() {
    const { includeCurvature, setIncludeCurvature, inProgress } = useContext(MainContext);

    return (
        <div className='toggle-curvature-checkbox'>
            <input type='checkbox' id="toggle-curvature-checkbox" disabled={inProgress !== 0} checked={includeCurvature} onChange={() => setIncludeCurvature(!includeCurvature)} />
            <label htmlFor="toggle-curvature-checkbox">Include Earth's curvature</label>
        </div>
    );
}
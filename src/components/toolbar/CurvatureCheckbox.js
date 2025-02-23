import { useContext } from 'react'
import MainContext from '../../contexts/MainContext'

export default function CurvatureCheckbox() {
    const { includeCurvature, setIncludeCurvature, inProgress } = useContext(MainContext);

    return (
        <div className='toggle-heightmap'>
            <input type='checkbox' id="toggle-heightmap-input" disabled={inProgress !== 0} checked={includeCurvature} onChange={() => setIncludeCurvature(!includeCurvature)} />
            <label htmlFor="toggle-heightmap-input">Include Earth's curvature</label>
        </div>
    );
}
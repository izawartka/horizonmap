import { useCallback, useContext } from "react";
import Constants from "../../helpers/constants";
import MainContext from "../../contexts/MainContext";

export default function RaysSlider() {
    const { rays, setRays, inProgress } = useContext(MainContext);

    const handleChange = useCallback((e) => {
        setRays(e.target.value);
    }, [setRays]);

    return (
        <div className='toolbar-slider rays-sldier'>
            <label>Rays: </label>
            <input
                type='range'
                min={Constants.horizon.minRays}
                max={Constants.horizon.maxRays}
                value={rays}
                onChange={handleChange}
                step={Constants.horizon.raysStep}
                disabled={inProgress !== 0}
            />
            <span>{rays}</span>
        </div>
    );
}

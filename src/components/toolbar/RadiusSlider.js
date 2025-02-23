import { useCallback, useContext } from "react";
import Constants from "../../helpers/constants";
import MainContext from "../../contexts/MainContext";

export default function RadiusSlider() {
    const { radius, setRadius, inProgress } = useContext(MainContext);

    const handleChange = useCallback((e) => {
        setRadius(e.target.value);
    }, [setRadius]);

    return (
        <div className='toolbar-slider radius-sldier'>
            <label>Radius: </label>
            <input
                type='range'
                min={Constants.marker.minRadius}
                max={Constants.marker.maxRadius}
                step={Constants.marker.radiusStep}
                value={radius}
                onChange={handleChange}
                disabled={inProgress !== 0}
            />
            <span>{radius} km</span>
        </div>
    );
}

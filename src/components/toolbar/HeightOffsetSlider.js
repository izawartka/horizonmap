import { useCallback, useContext } from "react";
import Constants from "../../helpers/constants";
import MainContext from "../../contexts/MainContext";

export default function HeightOffsetSlider() {
    const { heightOffset, setHeightOffset, inProgress } = useContext(MainContext);

    const handleChange = useCallback((e) => {
        setHeightOffset(e.target.value);
    }, [setHeightOffset]);

    return (
        <div className='toolbar-slider height-offset-sldier'>
            <label>Height offset: </label>
            <input
                type='range'
                min={Constants.horizon.minHeightOffset}
                max={Constants.horizon.maxHeightOffset}
                value={heightOffset}
                onChange={handleChange}
                disabled={inProgress !== 0}
            />
            <span>{heightOffset} m</span>
        </div>
    );
}

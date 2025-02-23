import { useCallback, useContext } from "react";
import Constants from "../../helpers/constants";
import MainContext from "../../contexts/MainContext";

export default function QualitySlider() {
    const { heightmapZoom, setHeightmapZoom, inProgress } = useContext(MainContext);

    const handleChange = useCallback((e) => {
        setHeightmapZoom(e.target.value);
    }, [setHeightmapZoom]);

    return (
        <div className='toolbar-slider quality-sldier'>
            <label>Heightmap quality: </label>
            <input
                type='range'
                min={Constants.heightmap.minZoom}
                max={Constants.heightmap.maxZoom}
                value={heightmapZoom}
                onChange={handleChange}
                disabled={inProgress !== 0}
            />
            <span>{heightmapZoom}</span>
        </div>
    );
}

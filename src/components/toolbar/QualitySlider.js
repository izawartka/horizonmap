import { useContext } from "react";
import Constants from "../../helpers/constants";
import MainContext from "../../contexts/MainContext";
import CustomSlider from "../inputs/CustomSlider";

export default function QualitySlider() {
    const { heightmapZoom, setHeightmapZoom, inProgress } = useContext(MainContext);

    return (
        <CustomSlider
            displayName='Heightmap quality'
            className='quality-slider'
            value={heightmapZoom}
            setValue={setHeightmapZoom}
            min={Constants.heightmap.minZoom}
            max={Constants.heightmap.maxZoom}
            disabled={inProgress !== 0}
        />
    );
}

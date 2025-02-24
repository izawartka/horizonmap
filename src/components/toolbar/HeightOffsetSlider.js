import { useContext } from "react";
import Constants from "../../helpers/constants";
import MainContext from "../../contexts/MainContext";
import CustomSlider from "../inputs/CustomSlider";

export default function HeightOffsetSlider() {
    const { heightOffset, setHeightOffset, inProgress } = useContext(MainContext);

    return (
        <CustomSlider
            displayName='Height offset'
            className='height-offset-slider'
            suffix=' m'
            value={heightOffset}
            setValue={setHeightOffset}
            min={Constants.horizon.minHeightOffset}
            max={Constants.horizon.maxHeightOffset}
            disabled={inProgress !== 0}
        />
    );
}

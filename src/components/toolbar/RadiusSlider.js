import { useContext } from "react";
import Constants from "../../helpers/constants";
import MainContext from "../../contexts/MainContext";
import CustomSlider from "../inputs/CustomSlider";

export default function RadiusSlider() {
    const { radius, setRadius, inProgress } = useContext(MainContext);

    return (
        <CustomSlider
            displayName='Radius'
            className='radius-slider'
            suffix=' km'
            value={radius}
            setValue={setRadius}
            min={Constants.horizon.minRadius}
            max={Constants.horizon.maxRadius}
            disabled={inProgress !== 0}
        />
    );
}

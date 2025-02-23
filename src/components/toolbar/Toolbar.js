import React, { useContext } from 'react';
import MainContext from '../../contexts/MainContext';
import './Toolbar.css';
import MarkerMove from './MakrerMove';
import RadiusSlider from './RadiusSlider';
import DisplayPosition from './DisplayPosition';
import Constants from '../../helpers/constants';
import ToggleOverlay from './ToggleOverlay';
import QualitySlider from './QualitySlider';
import RaysSlider from './RaysSlider';
import HeightOffsetSlider from './HeightOffsetSlider';
import ProgressIndicator from './ProgressIndicator';
import ToggleCurvature from './ToggleCurvature';

export default function Toolbar() {
    const { map } = useContext(MainContext);

    if(!map) return (
        <div className='toolbar'>
            Loading...
        </div>
    )

    return (
        <div className='toolbar-cont'>
            <div className='toolbar'>
                <MarkerMove />
                <RadiusSlider />
                <QualitySlider />
                <RaysSlider />
                <HeightOffsetSlider />
                <ToggleCurvature />
                { Constants.debug.displayPosition && <DisplayPosition /> }
                <ToggleOverlay />
            </div>
            <div className='progress-indicator-cont'>
                <ProgressIndicator />
            </div>
        </div>
    );
}
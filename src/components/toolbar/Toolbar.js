import React, { useContext } from 'react';
import MainContext from '../../contexts/MainContext';
import './Toolbar.css';
import MarkerMove from './MakrerMove';
import RadiusSlider from './RadiusSlider';
import DisplayPosition from './DisplayPosition';
import Constants from '../../helpers/constants';
import ShowOverlayCheckbox from './ShowOverlayCheckbox';
import QualitySlider from './QualitySlider';
import RaysSlider from './RaysSlider';
import HeightOffsetSlider from './HeightOffsetSlider';
import ProgressIndicator from './ProgressIndicator';
import CurvatureCheckbox from './CurvatureCheckbox';

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
                <CurvatureCheckbox />
                { Constants.debug.displayPosition && <DisplayPosition /> }
                <ShowOverlayCheckbox />
            </div>
            <div className='progress-indicator-cont'>
                <ProgressIndicator />
            </div>
        </div>
    );
}
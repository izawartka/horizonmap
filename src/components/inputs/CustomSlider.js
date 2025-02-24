import { useCallback, useEffect, useState } from "react";

export default function CustomSlider(props) {
    const { displayName, className, suffix, value, setValue, disabled, min, max, step } = props;
    const [inputValue, setInputValue] = useState(value);

    const handleChange = useCallback((e) => {
        setInputValue(e.target.value);
    }, [setInputValue]);

    const handleInputEnd = useCallback(() => {
        if(disabled) return;
        setValue(inputValue);
    }, [setValue, inputValue, disabled]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            handleInputEnd();
        }
    }, [handleInputEnd]);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    return (
        <div className={`custom-slider ${className}`}>
            <label>{displayName}: </label>
            <input
                type='range'
                min={min}
                max={max}
                value={inputValue}
                onChange={handleChange}
                onBlur={handleInputEnd}
                onMouseUp={handleInputEnd}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                step={step}
            />
            <span>{inputValue}{suffix}</span>
        </div>
    );
}

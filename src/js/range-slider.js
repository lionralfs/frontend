function getSliderWrapper() {
    const result = document.querySelector('.range-slider-wrapper');
    if (!result) throw new Error('Range Slider Wrapper not found!');
    return result;
}

function getElementWithinWrapper(wrapper, selector) {
    const result = wrapper.querySelector(selector);
    if (!result) throw new Error(`${selector} not found within wrapper!`);
    return result;
}

export function initRangeSlider(initialPosition, onChange) {
    const wrapper = getSliderWrapper();
    const slider = getElementWithinWrapper(wrapper, '.range-slider');
    const leftLabel = getElementWithinWrapper(wrapper, '.left');
    const middleLabel = getElementWithinWrapper(wrapper, '.now');
    const rightLabel = getElementWithinWrapper(wrapper, '.right');
    slider.value = initialPosition.toString();
    wrapper.style.opacity = '1';

    leftLabel.innerText = '0h';
    rightLabel.innerText = '24h';
    middleLabel.innerText = `${initialPosition}h`;

    /**
     * Eventlistener for the slider
     */
    slider.addEventListener('input', event => {
        const sliderPos = parseInt(event.target.value);

        middleLabel.innerText = `${sliderPos}h`;
        onChange(sliderPos);
    });
}

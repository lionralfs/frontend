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

export function initRangeSlider(onChange) {
  const wrapper = getSliderWrapper();
  const slider = getElementWithinWrapper(wrapper, '.range-slider');
  const leftLabel = getElementWithinWrapper(wrapper, '.left');
  const middleLabel = getElementWithinWrapper(wrapper, '.now');
  const rightLabel = getElementWithinWrapper(wrapper, '.right');
  slider.value = '24';
  wrapper.style.opacity = '1';

  leftLabel.innerText = '-24h';
  rightLabel.innerText = 'now';

  /*
  Eventlistener for the slider
  */
  slider.addEventListener('input', event => {
    const sliderPos = 24 - parseInt(event.target.value);

    middleLabel.innerText = `-${sliderPos}h`;
    onChange(sliderPos);
  });
}

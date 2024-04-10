import { useState } from 'react';

import { coinsIcon } from '../../assets/icons/icons';

import './Tip.css';

export default function Tip(props) {
  const { isTipEnable, updateTip } = props;
  const [tipOptions, setTipOptions] = useState([
    { value: 0, active: true },
    { value: 5, active: false },
    { value: 10, active: false },
    { value: 15, active: false },
    { value: 20, active: false },
  ]);
  const onClickTipOption = (tip) => {
    const newTipOptions = tipOptions.map((tipOption) => {
      if (tipOption.value === tip.value) {
        return { ...tipOption, active: true };
      } else if (tipOption.active) {
        return { ...tipOption, active: false };
      }
      return tipOption;
    });
    setTipOptions(newTipOptions);
    updateTip(tip.value);
  };

  return (
    <>
      {
        isTipEnable
        && <div className='tip__container'>
          <div className='tip__title'>
            <img src={coinsIcon} alt="tip" />
            <h2>¿Desea agregar propina?</h2>
          </div>
          <div className='tip__option-container'>
            {
              tipOptions.map((option, index) => (
                <button
                  key={`tip-option-${index}`}
                  className={`tip__option ${option.active ? 'tip__option--active' : ''}`}
                  onClick={() => onClickTipOption(option, index)}
                >{option.value}%</button>
              ))
            }
          </div>
        </div>
      }
    </>
  );
}
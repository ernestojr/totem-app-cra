import { logoTolivBlack } from '../../assets/imgs/images';

import './OrangePage.css';

export default function OrangePage (props) {
  const { onClickStart } = props;
  return (
    <div className="orange-page">
      <div className="orange-page__logo">
        <img src={logoTolivBlack} alt='Toliv' />
      </div>
      <button onClick={() => onClickStart()}>Empezar</button>
    </div>
  )
}
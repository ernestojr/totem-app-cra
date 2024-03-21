import { t, o, l, i, v } from '../../assets/imgs/images';

import './OrangePage.css';

export default function OrangePage (props) {
  const { onClickStart } = props;
  return (
    <div className="orange-page">
      <div className="orange-page__logo">
        <img src={t} alt='t' />
        <img src={o} alt='o' />
        <img src={l} alt='l' />
        <img src={i} alt='i' />
        <img src={v} alt='v' />
      </div>
      <button onClick={() => onClickStart()}>Empezar</button>
    </div>
  )
}
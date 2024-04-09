import { logoTolivBlack } from '../../assets/imgs/images';

import './Home.css';

export default function Home (props) {
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
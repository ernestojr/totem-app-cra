import numeral from 'numeral';

import Tip from '../Tip/Tip';

import './FooterCart.css';

export default function Footer(props) {
  const {
    totalAmount,
    isTipEnable,
    onClickPayAction,
    updateTip,
  } = props;
  
  return (
    <footer className="footer-cart">
      <Tip isTipEnable={isTipEnable} updateTip={updateTip} />
      <button
        className='footer-cart__button-pay'
        onClick={() => onClickPayAction()}
        disabled={!totalAmount}>Pagar ${numeral(totalAmount).format('0,0[,]0').replace(/,/g, '.')}</button>
    </footer>
  );
}
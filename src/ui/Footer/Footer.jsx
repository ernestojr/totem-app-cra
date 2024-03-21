import numeral from 'numeral';

import './Footer.css';

export default function Footer(props) {
  const { shoppingCart, onClickPayAction } = props;
  const getTotalAmount = () => {
    let total = 0;
    Object.keys(shoppingCart).forEach((key) => {
      total += shoppingCart[key].quantity * shoppingCart[key].price;
    });
    return total;
  }
  const total = getTotalAmount();
  return (
    <footer className="footer-app">
      <div className='footer-app__total'>
        <span className='footer-app_total__key'>Total</span>
        <span className='footer-app_total__value'>${numeral(total).format('0,0[,]0').replace(/,/g, '.')}</span>
      </div>
      <button
        className='footer-app__button-pay'
        onClick={() => onClickPayAction()}
        disabled={!total}>Pagar</button>
    </footer>
  );
}
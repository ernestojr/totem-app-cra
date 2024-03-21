import numeral from 'numeral';

import './FooterCart.css';

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
    <footer className="footer-cart">
      <button
        className='footer-cart__button-pay'
        onClick={() => onClickPayAction()}
        disabled={!total}>Pagar ${numeral(total).format('0,0[,]0').replace(/,/g, '.')}</button>
    </footer>
  );
}
import { Badge } from "antd";
import { arrowBackIcon, shoppingCartIcon } from '../../assets/icons/icons';

import './Header.css';

export default function Header(props) {
  const {
    shoppingCart = [],
    onClickBack,
    onClickPayAction,
    isCartPage = false,
    onEmptyCartClick,
  } = props;
  const getShoppingCartLength = () => {
    let length = 0;
    shoppingCart.forEach((product) => {
      length += product.quantity;
    });
    return length;
  };
  return (
    <header className="header-app">
      <button onClick={onClickBack}>
        <img src={arrowBackIcon} alt="back" />
      </button>
      { !isCartPage
        ? <button onClick={() => onClickPayAction && shoppingCart.length > 0 && onClickPayAction()}>
          <Badge count={getShoppingCartLength()}>
            <img src={shoppingCartIcon} alt="shopping_cart" />
          </Badge>
        </button>
        : <button className="btn-empty-cart" onClick={() => shoppingCart.length > 0 && onEmptyCartClick()}>
          Limpiar Selección
        </button>
      }
    </header>
  );
}
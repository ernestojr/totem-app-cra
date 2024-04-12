import { Badge, Modal } from "antd";
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
  const onClick = async () => {
    if (shoppingCart.length > 0) {
      Modal.confirm({
        title: '¡Confirme por favor!',
        content: '¿Confirmas que deseas vaciar el carrito?',
        cancelText: 'Cancelar',
        okText: 'Confirmar',
        footer: (_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn/>
            <OkBtn/>
          </>
        ),
        onOk: () => onEmptyCartClick(),
      });
    }
  }
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
        : <button className="btn-empty-cart" onClick={onClick}>
          Limpiar Selección
        </button>
      }
    </header>
  );
}
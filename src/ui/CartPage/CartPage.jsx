import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import numeral from 'numeral';

import Header from '../Header/Header';
import FooterCart from '../FooterCart/FooterCart';
import { shoppingCartIconBlack } from '../../assets/icons/icons';

import './CartPage.css';

export default function Cart(props) {
  const {
    shoppingCart,
    onClickBackAction,
    onRemoveProductClick,
    onAddProductClick,
    onClickPayAction,
  } = props;
  const shoppingCartArray = Object.values(shoppingCart);
  return (<div>
    <Header
      shoppingCart={shoppingCart}
      onClickBack={onClickBackAction} />
    <div className="cart-page">
      <div className='cart-page__title'>
        <img src={shoppingCartIconBlack} alt="cart" />
        <h1>Tu pedido</h1>
      </div>
      <p className='cart-page__sub-title'>Resumen Orden</p>
      {
        shoppingCartArray.map((product) => (
          <div className='cart-page__item'>
            <div className='cart-page__item__product'>
              <img src={product.product.products_images[0].thumbnail} alt={product.product.name} />
              <div className='cart-page__item__product__info'>
                <p className='cart-page__item__product__title'>{product.product.name}</p>
                <p className='cart-page__item__product__price'>${numeral(product.price).format('0,0[,]0').replace(/,/g, '.')}</p>
              </div>
            </div>
            <div className='cart-page__item__actions'>
              <Button
                className='card-button'
                type="primary"
                shape="circle"
                size="large"
                icon={<MinusOutlined />}
                onClick={(e) => onRemoveProductClick(product, e.stopPropagation())} />
              <p>{product.quantity}</p>
              <Button
                className='card-button'
                type="primary"
                shape="circle"
                size="large"
                icon={<PlusOutlined />}
                onClick={(e) => onAddProductClick(product, e.stopPropagation())} />
            </div>
          </div>
        ))
      }
    </div>
    <FooterCart
      shoppingCart={shoppingCart}
      onClickPayAction={onClickPayAction}
       />
  </div>);
}
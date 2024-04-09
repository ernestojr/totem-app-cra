import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Button, Collapse, Empty } from 'antd';
import numeral from 'numeral';

import Header from '../Header/Header';
import FooterCart from '../FooterCart/FooterCart';
import { shoppingCartIconBlack } from '../../assets/icons/icons';

import './CartPage.css';

export default function Cart(props) {
  const {
    shoppingCart = [],
    onClickBackAction,
    onRemoveProductClick,
    onAddProductClick,
    onClickPayAction,
  } = props;
  const buildItemsToCollapse = (product) => ([
    {
      key: `product-${product.id}-${Date.now()}`,
      label: `${product.allOptions.length}x ${product.allOptions.length > 1 ? 'Detalles' : 'Detalle'}`,
      children: <ul>{product.allOptions.map((option, index) => (
        <li key={`product-${Date.now()}-${index}`}>{option}</li>
      ))}</ul>,
    },
  ]);
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
        shoppingCart.map((product) => (
          <div className='cart-page__item'>
            <div className='cart-page__item__product'>
              <img src={product.product.products_images[0].thumbnail} alt={product.product.name} />
              <div className='cart-page__item__product__info'>
                <p className='cart-page__item__product__title'>{product.product.name}</p>
                <p className='cart-page__item__product__price'>${numeral(product.totalOrder).format('0,0[,]0').replace(/,/g, '.')}</p>
                {
                  product.allOptions.length > 0
                  && <Collapse className="group-option-collapse" ghost items={buildItemsToCollapse(product)} />
                }
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
                onClick={(e) => onAddProductClick({ ...product, fromCart: true }, e.stopPropagation())} />
            </div>
          </div>
        ))
      }
      {
        shoppingCart.length === 0
        && <Empty
          image="https://tolivmarket-production.s3.sa-east-1.amazonaws.com/static/images/empty_cart.png"
          description={<h2>Su carro de compra está vacío</h2>}
        >
          <Button type="primary" size='large' onClick={() => onClickBackAction()}>Agregue Productos</Button>
        </Empty>
      }
    </div>
    <FooterCart
      shoppingCart={shoppingCart}
      onClickPayAction={onClickPayAction}/>
  </div>);
}
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import numeral from 'numeral';

import './ProductCard.css';

export default function ProductCard(props) {
  const {
    product,
    quantity,
    onClick,
    onAddProductClick,
    onRemoveProductClick,
  } = props;
  const { product : productInfo } = product;
  const isDisabled = () => {
    return !product.is_active || (product.has_stock && product.stock < 1);
  }
  return (
    <>
      <div className='card-container' onClick={() => {
        onClick(product);
      }}>
        <div className='card-img'>
          {
            isDisabled() &&
              <div className='card-img-sold-out'>
                Agotado
              </div>
          }
          <img
            src={productInfo.products_images[0].thumbnail}
            alt={`${productInfo.name}`} />
        </div>
        <div className='card-actions'>
          <div className='cart-actions'>
            {
              quantity > 0 && <>
                <Button
                  className='card-button'
                  type="primary"
                  shape="circle"
                  size="large"
                  disabled={isDisabled()}
                  icon={<MinusOutlined />}
                  onClick={(e) => onRemoveProductClick(product, e.stopPropagation())} />
                <p>{quantity}</p>
              </>
            }
            <Button
              className='card-button'
              type="primary"
              shape="circle"
              size="large"
              disabled={isDisabled()}
              icon={<PlusOutlined />}
              onClick={(e) => onAddProductClick(product, e.stopPropagation())} />
          </div>
        </div>
        <p className='card-title'>{productInfo.name}</p>
        <p className='card-price'>${numeral(product.price).format('0,0[,]0').replace(/,/g, '.')}</p>
        <p className='card-message'>Válido hasta agotar stock</p>
      </div>
    </>
  );
}
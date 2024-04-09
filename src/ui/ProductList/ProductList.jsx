import { Tabs } from 'antd';

import ProductCard from "../ProductCard/ProductCard";

import './ProductList.css';

export default function ProductList(props) {
  const {
    categories,
    shoppingCart = [],
    onClickProduct,
    onAddProductClick,
    onRemoveProductClick,
  } = props;

  const onChange = (key) => {
  };

  const buildTabs = () => {
    return categories.map(category => ({
      key: category.id,
      label: category.name,
      forceRender: true,
      children: buildProductList(category.branch_office_products),
    }));
  };

  const buildProductList = (products) => {
    return <div className='product-list'>
      {
        products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={getQuantity(product)}
            onClick={onClickProduct}
            onAddProductClick={onAddProductClick}
            onRemoveProductClick={onRemoveProductClick}
          />
        ))
      }
    </div>;
  };

  const getQuantity = (product) => {
    const { id: pid } = product;
    let quantity = 0;
    shoppingCart.forEach(p => {
      if (p.id === pid) {
        quantity += p.quantity;
      }
    });
    return quantity;
  }

  return (
    <Tabs
      defaultActiveKey="1"
      items={buildTabs()}
      onChange={onChange}
    />);
}
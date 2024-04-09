import React, { useState } from 'react';
import { Button, Modal, Form, Alert, Checkbox, Radio, Select } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import numeral from 'numeral';

import './ProductDetailModal.css';

export default function ProductDetailModel(props) {
  const {
    shoppingCart = [],
    onAddProduct,
    onRemoveProduct,
    productSelected,
    setProductSelected,
    branchOfficeData,
    show,
    setShow,
  } = props;

  const [isOk, setIsOk] = useState(true);
  const [messageStock, setMessageStock] = useState(null);

  const isValidProductGroups = (groups) => {
    let validate = true;
    groups.forEach((group) => {
      if (get(group, 'type_of_groups_variation.code', '') === 'fixed_quantity'
        && group.count !== group.min_value) {
        validate = false;
      }
      if (get(group, 'type_of_groups_variation.code', '') === 'minimum_maximum'
        && !(group.count >= group.min_value && group.count <= group.max_value)) {
        validate = false;
      }
    });
    return validate;
  };

  const handleOk = (values) => {
    setMessageStock(null);
    const groups = get(productSelected, 'branch_offices_products_groups', []);
    if (groups.length > 0) {
      if (!isValidProductGroups(groups)) {
        setIsOk(false);
        return;
      }
      if (productSelected.stock > 0) {
        let stock = 0;
        shoppingCart.forEach((product) => {
          if (product.id === productSelected.id) {
            stock += product.quantity;
          }
        });
        stock += productSelected.quantity;
        if (stock > productSelected.stock) {
          setMessageStock(
            `Solo puedes agregar un máximo total de ${productSelected.stock} ${
              productSelected.stock === 1 ? "producto" : "productos"
            } `
          );
          return;
        }
      }
      const allOptions = [];
      groups.forEach((group, index) => {
        const options = get(group, 'branch_offices_products_groups_options', []);        
        const optionsMap = options.reduce((acc, option) => {
          acc[option.id] = option;
          return acc;
        }, {});
        console.log('allOptions', allOptions, index);
        if (group.optionsSelected && group.optionsSelected.length > 0) {
          group.optionsSelected.forEach((optionIdSelected) => {
            allOptions.push(`1x ${optionsMap[optionIdSelected].name}`);
          });
        } else if (group.radioSelected) {
          allOptions.push(`1x ${optionsMap[group.radioSelected].name}`);
        } else {
          options.forEach((option) => {
            if (option.value > 0) {
              allOptions.push(`${option.value}x ${option.name}`);
            }
          });
        }
        
      });
      productSelected.allOptions = allOptions;
    }
    productSelected.observations = ''; // TODO: No es necesario el totem
    onAddProduct(productSelected);
    setShow(false);
  };

  const onFinishFailedForm = (errorInfo) => {
    console.log('Here into onFinishFailedForm', errorInfo);
  };

  const handleCancel = () => {
    setShow(false);
    if (messageStock) {
      setMessageStock(null);
    }
  };

  const getProductImage = () => {
    return get(productSelected, 'product.products_images[0].image', null);
  };

  const image = getProductImage();

  const showCloseCommerceAlert = () => {
    return get(branchOfficeData, 'schedule.from') === '0001-01-01T00:00:00Z' || !get(branchOfficeData, 'schedule.is_online') && (
      <Alert
        message="Cerrado temporalmente, no es posible agregar productos."
        type="error"
        showIcon
      />
    );
  };

  const updateTotal = (newProductSelected) => {
    let finalPrice = 0;
    let subTotal = 0;
    const groups = get(newProductSelected, 'branch_offices_products_groups', []);
    groups.forEach((group) => {
      const options = get(group, 'branch_offices_products_groups_options', []);
      options.forEach((option) => {
        if (group.radioSelected && group.radioSelected === option.id) {
          if (get(option, 'type_of_products_option.code') === 'additional_price') {
            subTotal += option.price;
          }
          if (get(option, 'type_of_products_option.code') === 'final_price' && option.price > finalPrice) {
            finalPrice = option.price;
          }
        }
        const optionsSelected = get(group, 'optionsSelected', []);
        optionsSelected.forEach((optionIdSelected) => {
          if (optionIdSelected === option.id) {
            if (get(option, 'type_of_products_option.code') === 'additional_price') {
              subTotal += option.price;
            }
            if (get(option, 'type_of_products_option.code') === 'final_price' && option.price > finalPrice) {
              finalPrice = option.price;
            }
          }
        });
        if (get(group, 'type_of_groups_variation.code', '') === 'minimum_maximum'
            && get(option, 'type_of_products_option.code') === 'additional_price') {
          subTotal += option.value * option.price;
        }
      });
    });
    if (finalPrice > 0) {
      newProductSelected.totalOrder = finalPrice + subTotal;
    } else {
      newProductSelected.totalOrder = newProductSelected.price + subTotal;
    }
  };

  const updateCounters = (newProductSelected) => {
    const groups = get(newProductSelected, 'branch_offices_products_groups', []);
    groups.forEach((group) => {
      const options = get(group, 'branch_offices_products_groups_options', []);
      let count = 0;
      options.forEach((option) => {
        if (get(group, 'type_of_groups_variation.code', '') === 'minimum_maximum') {
          count += option.value;
        }
        if (get(group, 'radioSelected', '') === option.id) {
          count += 1;
        }
        const optionsSelected = get(group, 'optionsSelected', []);
        optionsSelected.forEach((optionIdSelected) => {
          if (optionIdSelected === option.id) {
            count += 1;
          }
        });
      });
      group.count = count;
    });
  }
  
  const updateCountersAndTotal = (newProductSelected) => {
    updateTotal(newProductSelected);
    updateCounters(newProductSelected);
    setProductSelected(newProductSelected);
  };

  const onChangeChexBoxOption = (checkedValues, group) => {
    const newProductSelected = { ...productSelected };
    const groupTarget = get(newProductSelected, 'branch_offices_products_groups')
      .find(currentGroup => currentGroup.id === group.id);
    groupTarget.optionsSelected = checkedValues;
    updateCountersAndTotal(newProductSelected);
  };

  const onChangeRadioOption = (event, group) => {
    const newProductSelected = { ...productSelected };
    const groupTarget = get(newProductSelected, 'branch_offices_products_groups')
      .find(currentGroup => currentGroup.id === group.id);
    groupTarget.radioSelected = event.target.value;
    updateCountersAndTotal(newProductSelected);
  };

  const onChangeSelectOption = (valueSelected, group, option) => {
    const newProductSelected = { ...productSelected };
    const groupTarget = get(newProductSelected, 'branch_offices_products_groups')
      .find(currentGroup => currentGroup.id === group.id);
    const optionTarget = get(groupTarget, 'branch_offices_products_groups_options')
      .find(currentOption => currentOption.id === option.id);
    optionTarget.value = valueSelected;
    updateCountersAndTotal(newProductSelected);
  };

  const onRemoveProductClick = () => {
    if (productSelected.quantity >= 2) {
      setProductSelected({ ...productSelected, quantity: productSelected.quantity - 1 });
    }
  };

  const onAddProductClick = () => {
    setProductSelected({ ...productSelected, quantity: productSelected.quantity + 1 });
  };

  const showGroups = () => get(productSelected, "branch_offices_products_groups", [])
  .map((group, groupIndex) => {
    return <>
      <div className="group-header">
        <p className="group-name">{group.name}</p>
        {
          get(group, 'type_of_groups_variation.code', '') === 'no_maximum'
            && <p className="group-optional">Opcional</p>
        }
        {
          get(group, 'type_of_groups_variation.code', '') === 'fixed_quantity'
            && <p className="group-required">Obligatorio</p>
        }
        {
          get(group, 'type_of_groups_variation.code', '') === 'minimum_maximum'
            && get(group, 'min_value', -1) === 0 
            && <p className="group-optional">Opcional</p>
        }
        {
          get(group, 'type_of_groups_variation.code', '') === 'minimum_maximum'
            && get(group, 'min_value', -1) > 0 
            && <p className="group-required">Obligatorio</p>
        }
      </div>
      <div className="group-criteria">
        {
          get(group, 'type_of_groups_variation.code', '') === 'no_maximum'
            && <p className="group-criteria__text">Elige alguna de estas opciones</p>
        }
        {
          get(group, 'type_of_groups_variation.code', '') === 'fixed_quantity'
            && <p className="group-criteria__text">
              {
                get(group, 'count') === 0
                && <span>
                  {`Elige ${get(group, 'min_value')} ${get(group, 'min_value') === 1? 'opción' : 'opciones'}`}
                </span>
              }
              {
                get(group, 'count') > 0
                  && get(group, 'min_value') - get(group, 'count') > 1
                  && <span>
                    {`Faltan ${get(group, 'min_value') - get(group, 'count')} más`}
                  </span>
              }
              {
                get(group, 'count') > 0
                  && get(group, 'min_value') - get(group, 'count') === 1
                  && <span>
                    {`Falta ${get(group, 'min_value') - get(group, 'count')} más`}
                  </span>
              }
              {
                get(group, 'min_value') === get(group, 'count')
                  && <span className="group-criteria__text-success">Has completado la selección</span>
              }
              {
                get(group, 'count') > get(group, 'min_value')
                  && <span className="group-criteria__text-warning">El máximo es {get(group, 'min_value')}</span>
              }
            </p>
        }
        {
          get(group, 'type_of_groups_variation.code', '') === 'minimum_maximum'
            && <p className="group-criteria__text">
              {
                get(group, 'count') === 0
                && get(group, 'min_value') === 0
                && <span>
                  {`Elige hasta ${get(group, 'max_value')} opciones`}
                </span>
              }
              {
                get(group, 'count') === 0
                && get(group, 'min_value') > 0
                && <span>
                  {`Elige entre ${get(group, 'min_value')} a ${get(group, 'max_value')} opciones`}
                </span>
              }
              {
                 get(group, 'count') > 0
                 && get(group, 'max_value') - get(group, 'count') > 0
                 && get(group, 'min_value') === 0
                 && <span>
                  {`Puedes elegir ${get(group, 'max_value') - get(group, 'count')} más`}
                </span>
              }
              {
                 get(group, 'count') > 0
                 && get(group, 'max_value') - get(group, 'count') > 0
                 && get(group, 'min_value') > 0
                 && <span>
                  {`Elige de ${get(group, 'min_value')} a ${get(group, 'max_value')}`}
                </span>
              }
              {
                get(group, 'max_value') === get(group, 'count')
                  && <span className="group-criteria__text-success">Has completado la selección</span>
              }
              {
                get(group, 'count') > get(group, 'max_value')
                  && <span className="group-criteria__text-warning">El máximo es {get(group, 'max_value')}</span>
              }
            </p>
        }
      </div>
      <div className='group-options'>
        {
          (get(group, 'type_of_groups_variation.code', '') === 'no_maximum'
          || (get(group, 'type_of_groups_variation.code', '') === 'fixed_quantity'
          && get(group, 'min_value') > 1))
          && <Checkbox.Group onChange={(event) => onChangeChexBoxOption(event, group)} options={get(group, 'options')}/>
        }
        {
          get(group, 'type_of_groups_variation.code', '') === 'fixed_quantity'
          && get(group, 'min_value') === 1
          && <Radio.Group onChange={(event) => onChangeRadioOption(event, group)}>
            {
              get(group, 'branch_offices_products_groups_options', [])
                .map((option) => <Radio
                  value={option.id}
                  disabled={!option.active}>
                    {option.name}
                    {
                      option.type_of_products_option.code === 'additional_price'
                      && <label>
                        {` (+$${numeral(option.price).format('0,0[,]0').replace(/,/g, '.')})`}
                      </label>
                    }
                    {
                      option.type_of_products_option.code === "final_price"
                      && <label>
                        {` (el precio base cambia a $${numeral(option.price).format('0,0[,]0').replace(/,/g, '.')})`}
                      </label>
                    }
                  </Radio>)
            }
          </Radio.Group>
        }
        {
          get(group, 'type_of_groups_variation.code', '') === 'minimum_maximum'
          && get(group, 'branch_offices_products_groups_options', [])
            .map((option) => <div>
                <div>
                  <Select
                      disabled={!option.active}
                      defaultValue={0}
                      onChange={(e) => onChangeSelectOption(e, group, option) }
                    >
                    {
                      get(option, 'arraySelect', [])
                        .map((number, index) => <Select.Option key={`types-${index}`} value={number}>{number}</Select.Option>)
                    }
                  </Select>
                  <label>{option.name}</label>
                </div>
                {
                  get(option, 'type_of_products_option.code', '') === 'additional_price'
                  && <label>{` + $${numeral(option.price).format('0,0[,]0').replace(/,/g, '.')} `}</label>
                }
              </div>)
        }
      </div>
    </>;
  });

  return (
    <>
      <Modal
        centered
        open={show}
        onOk={handleOk}
        width={800}
        onCancel={handleCancel}
        footer={[]}>
          {
            productSelected && 
            <Form
              layout="vertical"
              onFinish={handleOk}
              onFinishFailed={onFinishFailedForm}
              autoComplete="off"
              name="formModal">
              <div className='modal-container'>
                <div className='modal-container__image'>
                { image && <img src={image} alt={productSelected.product.name} /> }
                </div>
                <div className='modal-container__detail'>
                  <h1 className='product-name'>{productSelected.product.name}</h1>
                  <p className='product-price'>${numeral(productSelected.price).format('0,0[,]0').replace(/,/g, '.')}</p>
                  { showCloseCommerceAlert() }
                  { showGroups()}
                  <div className='modal-container__detail__cart-actions'>
                    <p>Cantidad deseada</p>
                    <div className='cart-actions-white'>
                      <Button
                        className='card-button'
                        type="default"
                        shape="circle"
                        size="large"
                        icon={<MinusOutlined />}
                        onClick={(e) => onRemoveProductClick()} />
                      <p>{productSelected.quantity}</p>
                      <Button
                        className='card-button'
                        type="default"
                        shape="circle"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={(e) => onAddProductClick()} />
                    </div>
                  </div>
                </div>
              </div>
              <div className='modal__button-group'>
                <Button htmlType="button" size='large' onClick={handleCancel}>
                  Cancel
                </Button>
                <Button htmlType="submit" size='large' type="primary">
                  Agregar ${numeral(productSelected.totalOrder * productSelected.quantity).format('0,0[,]0').replace(/,/g, '.')}
                </Button>
              </div>
              {messageStock !== null && (
                <Alert
                  style={{ marginTop: "10px" }}
                  message={messageStock}
                  type="warning"
                  showIcon
                />
              )}
            </Form>
          }
      </Modal>
    </>
  );
};
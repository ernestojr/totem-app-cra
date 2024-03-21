import React, { useState } from 'react';
import { Button, Modal, Form, Alert, Checkbox, Radio, Select } from 'antd';
import { get } from 'lodash';
import numeral from 'numeral';

import './ProductDetailModal.css';

export default function ProductDetailModel(props) {
  const { productSelected, branchOfficeData, show, setShow } = props;
  const [isOk, setIsOk] = useState(true);

  const handleOk = () => {
    setShow(false);
  };

  const handleCancel = () => {
    setShow(false);
  };

  const getProductImage = () => {
    return get(productSelected, 'product.products_images[0].image', null);
  };

  const image = getProductImage();

  const showAlert = () => {
    return get(branchOfficeData, 'schedule.from') === '0001-01-01T00:00:00Z' || !get(branchOfficeData, 'schedule.is_online') ? (
      <Alert
        message="Cerrado temporalmente, no es posible agregar productos."
        type="error"
        showIcon
      />
    ): '';
  };

  const onChangeChexBox = (e, product) => {
    
  };

  const handleRadio = (e, product) => {

  };
  const onChangeSelect = (e, product, options) => {

  };

  const radioStyle = {
    display: "block",
    height: "auto",
  };

  const showGroup = () => get(productSelected, "branch_offices_products_groups", [])
    .map((product, i) => (
      <div key={`product-${i}`}>
        <div className='product-variant-group'>
          <p>{product.name}</p>
          {product.type_of_groups_variation.code ===
            "no_maximum" && (
            <p className="product-option-desc">Opcional</p>
          )}
          {product.type_of_groups_variation.code ===
            "fixed_quantity" && (
            <p className="product-option-desc">
              <span className="product-required-modal">
                Obligatorio
              </span>
            </p>
          )}
          {product.type_of_groups_variation.code ===
            "minimum_maximum" && (
            <p className="product-option-desc">
              {product.min_value === 0 && (
                <span>Opcional</span>
              )}
              {product.min_value > 0 && (
                <span className="product-required-modal">
                  Obligatorio
                </span>
              )}
            </p>
          )}
        </div>
        <div>
          {product.type_of_groups_variation.code ===
            "no_maximum" && (
            <p className="product-option-desc-new">
              Elige alguna de estas opciones:
            </p>
          )}
          {product.type_of_groups_variation.code ===
            "fixed_quantity" && (
            <p className="product-option-desc-new">
              {product.count === 0 && (
                <span className={isOk ? "" : "error"}>
                  Elige {product.min_value}{" "}
                  {product.min_value === 1
                    ? "opción"
                    : "opciones"}
                </span>
              )}
              {product.count > 0 &&
                product.min_value - product.count > 1 && (
                  <span className={isOk ? "" : "error"}>
                    Faltan {product.min_value - product.count}{" "}
                    más
                  </span>
                )}

              {product.count > 0 &&
                product.min_value - product.count === 1 && (
                  <span className={isOk ? "" : "error"}>
                    Falta {product.min_value - product.count}{" "}
                    más
                  </span>
                )}

              {product.min_value === product.count && (
                <span className="success">
                  Has completado la selección
                </span>
              )}

              {product.count > product.min_value ? (
                <span className="alert">
                  El máximo es {product.min_value}
                </span>
              ) : (
                ""
              )}
            </p>
          )}
          {product.type_of_groups_variation.code ===
            "minimum_maximum" && (
            <p className="product-option-desc-new">
              {product.count === 0 &&
                product.min_value === 0 && (
                  <span>
                    Elige hasta {product.max_value} opciones
                  </span>
                )}
              {product.count === 0 && product.min_value > 0 && (
                <span className={isOk ? "" : "error"}>
                  Elige entre {product.min_value} a{" "}
                  {product.max_value} opciones
                </span>
              )}
              {product.count > 0 &&
                product.max_value - product.count > 0 &&
                product.min_value === 0 && (
                  <span>
                    Puedes elegir{" "}
                    {product.max_value - product.count} más
                  </span>
                )}

              {product.count > 0 &&
                product.max_value - product.count > 0 &&
                product.min_value > 0 && (
                  <span
                    className={
                      !isOk &&
                      product.count < product.min_value
                        ? "error"
                        : ""
                    }
                  >
                    Elige de {product.min_value} a{" "}
                    {product.max_value}
                  </span>
                )}

              {product.max_value === product.count && (
                <span className="success">
                  Has completado la selección
                </span>
              )}

              {product.count > product.max_value ? (
                <span className="alert">
                  El máximo es {product.max_value}
                </span>
              ) : (
                ""
              )}
            </p>
          )}
        </div>
        {(product.type_of_groups_variation.code ===
          "no_maximum" ||
          (product.type_of_groups_variation.code ===
            "fixed_quantity" &&
            product.min_value > 1)) && (
          <Checkbox.Group
            onChange={(e) => onChangeChexBox(e, product)}
            options={product.options}
          />
        )}

        {product.type_of_groups_variation.code ===
          "fixed_quantity" &&
          product.min_value === 1 && (
            <Radio.Group
              onChange={(e) => handleRadio(e, product)}
              style={{ width: "100%" }}
            >
              {product.branch_offices_products_groups_options &&
                product.branch_offices_products_groups_options.map(
                  (options, i) => (
                    <Radio
                      style={radioStyle}
                      value={options.id}
                      disabled={!options.active}
                    >
                      {options.name}
                      {options.type_of_products_option
                        .code === "additional_price" && (
                        <label>
                          {" "}
                          + $
                          {numeral(options.price)
                            .format("0,0[,]0")
                            .replace(/,/g, ".")}{" "}
                        </label>
                      )}

                      {options.type_of_products_option
                        .code === "final_price" && (
                        <label>
                          {" (el precio base cambia a "}$
                          {numeral(options.price)
                            .format("0,0[,]0")
                            .replace(/,/g, ".")}
                          {")"}
                        </label>
                      )}
                    </Radio>
                  )
                )}
            </Radio.Group>
          )}
        
        <div className="options">
          {product.type_of_groups_variation.code ===
            "minimum_maximum" &&
            product.branch_offices_products_groups_options &&
            product.branch_offices_products_groups_options.map(
              (options, i) => (
                <div className="option-grid">
                  <div>
                    <Select
                      disabled={!options.active}
                      defaultValue={0}
                      onChange={(e) =>
                        onChangeSelect(e, product, options)
                      }
                    >
                      {options &&
                        options.arraySelect &&
                        options.arraySelect.map(
                          (numero, l) => (
                            <Select.Option
                              key={"types-" + l}
                              value={numero}
                            >
                              {numero}
                            </Select.Option>
                          )
                        )}
                    </Select>
                    <label
                      style={{
                        marginLeft: "12px",
                        color: !options.active
                          ? "rgba(0, 0, 0, 0.25)"
                          : "rgba(0, 0, 0, 0.65)",
                      }}
                    >
                      {options.name}
                    </label>
                  </div>
                  {options.type_of_products_option.code ===
                    "additional_price" && (
                    <label
                      style={{
                        color: !options.active
                          ? "rgba(0, 0, 0, 0.25)"
                          : "rgba(0, 0, 0, 0.65)",
                      }}
                    >
                      {" "}
                      + $
                      {numeral(options.price)
                        .format("0,0[,]0")
                        .replace(/,/g, ".")}{" "}
                    </label>
                  )}
                </div>
              )
            )}
        </div>
      </div>
    ));

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
            productSelected && <div className='modal-container'>
              <div className='modal-container__image'>
                { image && <img src={image} alt={productSelected.product.name} /> }
              </div>
              <div className='modal-container__detail'>
                <h1 className='product-name'>{productSelected.product.name}</h1>
                <p className='product-price'>${numeral(productSelected.price).format('0,0[,]0').replace(/,/g, '.')}</p>
                <Form
                  layout="vertical"
                  name="modal">
                  { showAlert() }
                  { showGroup() }
                </Form>
              </div>
            </div>
          }
      </Modal>
    </>
  );
};
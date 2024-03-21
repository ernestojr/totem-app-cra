import { useState } from 'react';
import numeral from 'numeral';

import { Modal, Alert, Form, Button, Input, Select, Checkbox, Radio, Row, Col, Skeleton } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

let listProductsGlobal = [];

export default function ProductDetailModel(props) {
  const { branchOfficeData } = props;
  const [isOk, setIsOk] = useState(true);
  const [cartName, setCartName] = useState("");
  const [random, setRandom] = useState(0);
  const [visible, setVisible] = useState(false);
  const [messageStock, setMessageStock] = useState(null);
  const [isLoadModal, setIsLoadModal] = useState(false);
  const [productSelected, setProductSelected] = useState({});
  const [observations, setObservations] = useState("");
  const [loadingButton, setLoadingButton] = useState(null);
  const [listProducts, setListProducts] = useState([]);
  const [visibleClosed, setVisibleClosed] = useState(false);
  const [visibleRemoveCart, setVisibleRemoveCart] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const radioStyle = {
    display: "block",
    height: "auto",
  };

  const handleRadio = (e, product) => {
    console.log("e.target.value", e.target.value);
    console.log("product", product);

    for (
      var i = 0;
      i < productSelected.branch_offices_products_groups.length;
      i++
    ) {
      console.log(
        "productSelected.branch_offices_products_groups[i]",
        productSelected.branch_offices_products_groups[i]
      );
      if (productSelected.branch_offices_products_groups[i].id === product.id) {
        console.log("soniugales");
        productSelected.branch_offices_products_groups[i].radioSelected =
          e.target.value;
        calculateTotal(productSelected);
        validateOptions(productSelected);
      }
    }
  };

  const calculateTotal = (product) => {
    console.log("calculateTotal");
    console.log("product", product);
    let finalPrice = 0;
    let subTotal = 0;
    for (var i = 0; i < product.branch_offices_products_groups.length; i++) {
      if (
        product.branch_offices_products_groups[i]
          .branch_offices_products_groups_options
      ) {
        for (
          var j = 0;
          j <
          product.branch_offices_products_groups[i]
            .branch_offices_products_groups_options.length;
          j++
        ) {
          console.log(
            product.branch_offices_products_groups[i]
              .branch_offices_products_groups_options[j]
          );

          if (
            product.branch_offices_products_groups[i].radioSelected !== "" &&
            product.branch_offices_products_groups[i].radioSelected ===
              product.branch_offices_products_groups[i]
                .branch_offices_products_groups_options[j].id
          ) {
            if (
              product.branch_offices_products_groups[i]
                .branch_offices_products_groups_options[j]
                .type_of_products_option.code === "additional_price"
            ) {
              subTotal =
                subTotal +
                product.branch_offices_products_groups[i]
                  .branch_offices_products_groups_options[j].price;
            }
            if (
              product.branch_offices_products_groups[i]
                .branch_offices_products_groups_options[j]
                .type_of_products_option.code === "final_price"
            ) {
              if (
                product.branch_offices_products_groups[i]
                  .branch_offices_products_groups_options[j].price > finalPrice
              ) {
                finalPrice =
                  product.branch_offices_products_groups[i]
                    .branch_offices_products_groups_options[j].price;
              }
            }
          }

          if (
            product.branch_offices_products_groups[i].optionsSelected.length > 0
          ) {
            for (
              var k = 0;
              k <
              product.branch_offices_products_groups[i].optionsSelected.length;
              k++
            ) {
              if (
                product.branch_offices_products_groups[i].optionsSelected[k] ===
                product.branch_offices_products_groups[i]
                  .branch_offices_products_groups_options[j].id
              ) {
                console.log("findyou");

                if (
                  product.branch_offices_products_groups[i]
                    .branch_offices_products_groups_options[j]
                    .type_of_products_option.code === "additional_price"
                ) {
                  subTotal =
                    subTotal +
                    product.branch_offices_products_groups[i]
                      .branch_offices_products_groups_options[j].price;
                }

                if (
                  product.branch_offices_products_groups[i]
                    .branch_offices_products_groups_options[j]
                    .type_of_products_option.code === "final_price"
                ) {
                  if (
                    product.branch_offices_products_groups[i]
                      .branch_offices_products_groups_options[j].price >
                    finalPrice
                  ) {
                    finalPrice =
                      product.branch_offices_products_groups[i]
                        .branch_offices_products_groups_options[j].price;
                  }
                }
              }
            }
          }

          if (
            product.branch_offices_products_groups[i].type_of_groups_variation
              .code === "minimum_maximum" &&
            product.branch_offices_products_groups[i]
              .branch_offices_products_groups_options[j].type_of_products_option
              .code === "additional_price"
          ) {
            let resut =
              product.branch_offices_products_groups[i]
                .branch_offices_products_groups_options[j].value *
              product.branch_offices_products_groups[i]
                .branch_offices_products_groups_options[j].price;
            subTotal = subTotal + resut;
            console.log("result::::", resut);
          }
        }
      }
    }
    console.log("subTotal", subTotal);

    let totalAux = product.price;
    if (finalPrice > 0) {
      totalAux = finalPrice;
    }

    setTotal(subTotal + totalAux);
  };

  const validateOptions = (product) => {
    console.log("product", product);

    for (var i = 0; i < product.branch_offices_products_groups.length; i++) {
      console.log(
        "validate product.branch_offices_products_groups",
        product.branch_offices_products_groups[i]
      );
      if (
        product.branch_offices_products_groups[i]
          .branch_offices_products_groups_options
      ) {
        let count = 0;
        for (
          var j = 0;
          j <
          product.branch_offices_products_groups[i]
            .branch_offices_products_groups_options.length;
          j++
        ) {
          if (
            product.branch_offices_products_groups[i].type_of_groups_variation
              .code === "minimum_maximum"
          ) {
            count =
              count +
              product.branch_offices_products_groups[i]
                .branch_offices_products_groups_options[j].value;
          }

          if (
            product.branch_offices_products_groups[i].radioSelected ===
            product.branch_offices_products_groups[i]
              .branch_offices_products_groups_options[j].id
          ) {
            count = count + 1;
          }

          if (
            product.branch_offices_products_groups[i].optionsSelected.length > 0
          ) {
            for (
              var k = 0;
              k <
              product.branch_offices_products_groups[i].optionsSelected.length;
              k++
            ) {
              if (
                product.branch_offices_products_groups[i].optionsSelected[k] ===
                product.branch_offices_products_groups[i]
                  .branch_offices_products_groups_options[j].id
              ) {
                console.log("sin cost");
                count = count + 1;
                console.log("count", count);
              }
            }
          }
        }
        product.branch_offices_products_groups[i].count = count;
      }
    }

    console.log("new product", product);
    setProductSelected(product);
    setRandom(Math.random());
  };

  const handleCancel = () => {
    form.resetFields();
    setLoadingButton(null);
    setVisible(!visible);
    setProductSelected({});
    setIsLoadModal(false);
    setMessageStock(null);
  };

  const onFinish = (values) => {
    setIsOk(true);
    setMessageStock(null);
    let isOptions = true;
    let validate = true;
    if (productSelected.branch_offices_products_groups) {
      for (
        var i = 0;
        i < productSelected.branch_offices_products_groups.length;
        i++
      ) {
        console.log(
          "onFinish group",
          productSelected.branch_offices_products_groups[i]
        );

        if (
          productSelected.branch_offices_products_groups[i]
            .type_of_groups_variation.code === "fixed_quantity"
        ) {
          if (
            productSelected.branch_offices_products_groups[i].count !==
            productSelected.branch_offices_products_groups[i].min_value
          ) {
            validate = false;
          }
        }

        if (
          productSelected.branch_offices_products_groups[i]
            .type_of_groups_variation.code === "minimum_maximum"
        ) {
          if (
            productSelected.branch_offices_products_groups[i].count >=
              productSelected.branch_offices_products_groups[i].min_value &&
            productSelected.branch_offices_products_groups[i].count <=
              productSelected.branch_offices_products_groups[i].max_value
          ) {
            console.log("is ok! maxi min");
          } else {
            console.log("faltan opciones");
            validate = false;
          }
        }
      }
    } else {
      isOptions = false;
    }

    if (!validate) {
      setIsOk(false);
      return;
    }

    var ordersCart = JSON.parse(localStorage.getItem("orders"));
    var branchOfficeCart = JSON.parse(localStorage.getItem("branchOffice"));

    console.log("ordersCart", ordersCart);
    console.log("branchOfficeCart", branchOfficeCart);

    if (!branchOfficeData.schedule.opened) {
      console.log("esta cerrado");
      setObservations(values.user.introduction);
      setVisible(false);
      setVisibleClosed(true);
      setLoadingButton(null);
      return;
    }

    if (ordersCart && branchOfficeCart) {
      console.log("existen");
      if (branchOfficeCart.id !== branchOfficeData.id) {
        console.log("tiene q vaciar el carro");
        setCartName(branchOfficeCart.name);
        setObservations(values.user.introduction);
        setVisible(false);
        setVisibleRemoveCart(true);
        setLoadingButton(null);
        return;
      }
    }

    console.log("es ::", validate);
    let arrayOrders = [];
    var orders = JSON.parse(localStorage.getItem("orders"));

    console.log("orders", orders);
    if (orders && orders.length > 0) {
      arrayOrders = orders;
    }

    if (productSelected.stock > 0) {
      let stockAux = 0;
      for (var i = 0; i < arrayOrders.length; i++) {
        if (arrayOrders[i].id === productSelected.id) {
          stockAux = stockAux + arrayOrders[i].quantity;
        }
      }
      stockAux = stockAux + productSelected.quantity;
      if (stockAux > productSelected.stock) {
        setMessageStock(
          `Solo puedes agregar un máximo total de ${productSelected.stock} ${
            productSelected.stock === 1 ? "producto" : "productos"
          } `
        );
        return;
      }
    }

    productSelected.totalOrder = total;
    productSelected.observations = values.user.introduction
      ? values.user.introduction
      : "";

    let isExists = false;
    for (var i = 0; i < arrayOrders.length; i++) {
      if (arrayOrders[i].id === productSelected.id) {
        arrayOrders[i].quantity =
          arrayOrders[i].quantity + productSelected.quantity;
        isExists = true;
      }
    }
    if (!isExists || isOptions) {
      arrayOrders.push(productSelected);
    }

    for (var i = 0; i < arrayOrders.length; i++) {
      let allOptions = [];
      if (arrayOrders[i].branch_offices_products_groups) {
        for (
          var j = 0;
          j < arrayOrders[i].branch_offices_products_groups.length;
          j++
        ) {
          if (
            arrayOrders[i].branch_offices_products_groups[j]
              .branch_offices_products_groups_options
          ) {
            for (
              var k = 0;
              k <
              arrayOrders[i].branch_offices_products_groups[j]
                .branch_offices_products_groups_options.length;
              k++
            ) {
              if (
                arrayOrders[i].branch_offices_products_groups[j].optionsSelected
                  .length > 0
              ) {
                for (
                  var l = 0;
                  l <
                  arrayOrders[i].branch_offices_products_groups[j]
                    .optionsSelected.length;
                  l++
                ) {
                  if (
                    arrayOrders[i].branch_offices_products_groups[j]
                      .optionsSelected[l] ===
                    arrayOrders[i].branch_offices_products_groups[j]
                      .branch_offices_products_groups_options[k].id
                  ) {
                    let option = `1x ${arrayOrders[i].branch_offices_products_groups[j].branch_offices_products_groups_options[k].name}`;
                    allOptions.push(option);
                  }
                }
              } else if (
                arrayOrders[i].branch_offices_products_groups[j]
                  .radioSelected !== ""
              ) {
                if (
                  arrayOrders[i].branch_offices_products_groups[j]
                    .radioSelected ===
                  arrayOrders[i].branch_offices_products_groups[j]
                    .branch_offices_products_groups_options[k].id
                ) {
                  let option = `1x ${arrayOrders[i].branch_offices_products_groups[j].branch_offices_products_groups_options[k].name}`;
                  allOptions.push(option);
                }
              } else if (
                arrayOrders[i].branch_offices_products_groups[j]
                  .branch_offices_products_groups_options[k].value > 0
              ) {
                let option = `${arrayOrders[i].branch_offices_products_groups[j].branch_offices_products_groups_options[k].value}x ${arrayOrders[i].branch_offices_products_groups[j].branch_offices_products_groups_options[k].name}`;
                allOptions.push(option);
              }
            }
          }
        }
      }
      arrayOrders[i].allOptions = allOptions;
    }

    console.log("productSelected", productSelected);

    localStorage.setItem("orders", JSON.stringify(arrayOrders));
    localStorage.setItem("branchOffice", JSON.stringify(branchOfficeData));

    handleCancel();
    setLoadingButton(null);
    updateListProducts();
  };

  const onChangeChexBox = (checkedValues, product) => {
    console.log("checked = ", checkedValues);
    console.log("product = ", product);
    for (
      var i = 0;
      i < productSelected.branch_offices_products_groups.length;
      i++
    ) {
      console.log(
        "productSelected.branch_offices_products_groups[i]",
        productSelected.branch_offices_products_groups[i]
      );
      if (productSelected.branch_offices_products_groups[i].id === product.id) {
        console.log("soniugales");
        productSelected.branch_offices_products_groups[
          i
        ].optionsSelected = checkedValues;
        calculateTotal(productSelected);
        validateOptions(productSelected);
      }
    }
  };

  const updateListProducts = () => {
    var orders = JSON.parse(localStorage.getItem("orders"));
    if (
      orders &&
      orders.length > 0 &&
      listProductsGlobal &&
      listProductsGlobal.length > 0
    ) {
      for (let j = 0; j < listProductsGlobal.length; j++) {
        for (
          let k = 0;
          k < listProductsGlobal[j].branch_office_products.length;
          k++
        ) {
          let isExists = false;
          let quantity = 0;
          for (var i = 0; i < orders.length; i++) {
            if (
              orders[i].id ===
              listProductsGlobal[j].branch_office_products[k].id
            ) {
              quantity = quantity + orders[i].quantity;
              listProductsGlobal[j].branch_office_products[
                k
              ].quantity = quantity;
              isExists = true;
            }
          }
          if (!isExists) {
            listProductsGlobal[j].branch_office_products[k].quantity = 0;
          }
        }
      }

      const listProductsAux = listProductsGlobal.map((item) => item);
      setListProducts(listProductsAux);
      listProductsGlobal = listProductsAux;
    } else {
      for (let j = 0; j < listProductsGlobal.length; j++) {
        for (
          let k = 0;
          k < listProductsGlobal[j].branch_office_products.length;
          k++
        ) {
          listProductsGlobal[j].branch_office_products[k].quantity = 0;
        }
      }

      const listProductsAux = listProductsGlobal.map((item) => item);
      setListProducts(listProductsAux);
      listProductsGlobal = listProductsAux;
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const lessQualityModal = () => {
    if (productSelected.quantity > 1) {
      setMessageStock(null);
      productSelected.quantity = productSelected.quantity - 1;
      setProductSelected(productSelected);
      setRandom(Math.random());
    }
  };
  const addQualityModal = () => {
    if (productSelected.has_stock) {
      if (productSelected.quantity < productSelected.stock) {
        productSelected.quantity = productSelected.quantity + 1;
        setProductSelected(productSelected);
        setRandom(Math.random());
      } else {
        setMessageStock(
          `Solo puedes agregar un máximo de ${productSelected.stock}`
        );
      }
    } else {
      productSelected.quantity = productSelected.quantity + 1;
      setProductSelected(productSelected);
      setRandom(Math.random());
    }
  };

  const onChangeSelect = (e, product, option) => {
    console.log("input", e);
    console.log("product", product);
    console.log("option", option);

    for (
      var i = 0;
      i < productSelected.branch_offices_products_groups.length;
      i++
    ) {
      if (productSelected.branch_offices_products_groups[i].id === product.id) {
        for (
          var j = 0;
          j <
          productSelected.branch_offices_products_groups[i]
            .branch_offices_products_groups_options.length;
          j++
        ) {
          if (
            productSelected.branch_offices_products_groups[i]
              .branch_offices_products_groups_options[j].id === option.id
          ) {
            productSelected.branch_offices_products_groups[
              i
            ].branch_offices_products_groups_options[j].value = e;
            calculateTotal(productSelected);
            validateOptions(productSelected);
          }
        }
      }
    }
  };

  return (
    <Modal
      centered
      open={visible}
      title=""
      onCancel={handleCancel}
      width={800}
      className="modal-add-product"
    >
      {!isLoadModal && (
        <div>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      )}
      {isLoadModal && productSelected && productSelected.product && (
        <Row className="padding-row-container">
          {productSelected.product &&
            productSelected.product.products_images &&
            productSelected.product.products_images.length > 0 && (
              <Col md={8}>
                <img
                  className="modal-product-image"
                  src={productSelected.product.products_images[0].image}
                  style={{
                    opacity:
                      branchOfficeData.is_disabled ||
                      !productSelected.is_active ||
                      (productSelected.has_stock &&
                        productSelected.stock < 1)
                        ? "0.5"
                        : "",
                  }}
                />
              </Col>
            )}
          <Col
            md={
              productSelected.product &&
              productSelected.product.products_images &&
              productSelected.product.products_images.length > 0
                ? 14
                : 18
            }
            xs={24}
            className={
              productSelected.product &&
              productSelected.product.products_images &&
              productSelected.product.products_images.length > 0
                ? " ant-col-md-offset-1"
                : "ant-col-md-offset-4"
            }
          >
            <h1>{productSelected.product.name}</h1>
            <input
              type="hidden"
              id={productSelected.id}
              name={productSelected.id}
              value={productSelected.id}
            />
            <Form
              form={form}
              layout="vertical"
              name="modal"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <p className="text-instructions">
                {productSelected.product.description}
              </p>

              {branchOfficeData.schedule &&
                (branchOfficeData.schedule.from ===
                  "0001-01-01T00:00:00Z" ||
                  !branchOfficeData.schedule.is_online) && (
                  <Alert
                    message="Cerrado temporalmente, no es posible agregar productos."
                    type="error"
                    showIcon
                  />
                )}

              {productSelected.branch_offices_products_groups &&
                productSelected.branch_offices_products_groups.map(
                  (product, i) => (
                    <div key={`product-${i}`}>
                      <Row
                        align="middle"
                        style={{ justifyContent: "space-between" }}
                      >
                        <h3>{product.name}</h3>
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
                      </Row>

                      <Row align="middle">
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
                      </Row>

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
                  )
                )}

              <Form.Item
                className="comments"
                name={["user", "introduction"]}
                label="Comentarios o instrucciones"
              >
                <Input.TextArea />
              </Form.Item>

              <Form.Item
                className="comments"
                name={["user", "introduction"]}
                label="Cantidad deseada"
              >
                <Button
                  disabled={
                    branchOfficeData.is_disabled ||
                    !productSelected.is_active ||
                    (productSelected.has_stock && productSelected.stock < 1)
                  }
                  icon={<MinusOutlined />}
                  onClick={lessQualityModal}
                />

                <Input
                  style={{ marginLeft: "5px" }}
                  className="cart-input"
                  value={productSelected.quantity}
                />
                <Button
                  style={{ marginLeft: "5px" }}
                  disabled={
                    branchOfficeData.is_disabled ||
                    !productSelected.is_active ||
                    (productSelected.has_stock && productSelected.stock < 1)
                  }
                  icon={<PlusOutlined />}
                  onClick={addQualityModal}
                />

                {messageStock !== null && (
                  <Alert
                    style={{ marginTop: "10px" }}
                    message={messageStock}
                    type="warning"
                    showIcon
                  />
                )}
              </Form.Item>

              {(!productSelected.is_active ||
                (productSelected.has_stock &&
                  productSelected.stock < 1)) && (
                <div className="div-contaner-no-stock">
                  <div className="title-no-stock">Agotado</div>
                  <div>No está disponible en este momento</div>
                </div>
              )}
              {!isOk && (
                <Alert
                  message="Faltan opciones por completar"
                  type="error"
                  showIcon
                />
              )}

              <Row
                align="end"
                className="continue-buttons"
                style={{ width: "100%" }}
              >
                <Button onClick={handleCancel}>Cancelar</Button>

                <Button
                  disabled={
                    (branchOfficeData.schedule &&
                      branchOfficeData.schedule.from ===
                        "0001-01-01T00:00:00Z") ||
                    (branchOfficeData.schedule &&
                      !branchOfficeData.schedule.is_online) ||
                    branchOfficeData.is_disabled ||
                    !productSelected.is_active ||
                    (productSelected.has_stock && productSelected.stock < 1)
                  }
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                >
                  Agregar $
                  {numeral(total * productSelected.quantity)
                    .format("0,0[,]0")
                    .replace(/,/g, ".")}
                </Button>
              </Row>
            </Form>
          </Col>
        </Row>
      )}
    </Modal>
  );
}
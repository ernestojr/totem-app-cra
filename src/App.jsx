import { useEffect, useState } from "react";
import { Modal, Form, Button, Input } from "antd";
import { cloneDeep, get } from 'lodash';
import numeral from 'numeral';

import OrangePage from "./ui/OrangePage/OrangePage";
import CartPage from "./ui/CartPage/CartPage";
import PaymentInProgressPage from "./ui/PaymentInProgressPage/PaymentInProgressPage";

import Header from "./ui/Header/Header";
import Footer from "./ui/Footer/Footer";
import ProductList from "./ui/ProductList/ProductList";
import ProductDetailModal from "./ui/ProductDetailModal/ProductDetailModalV2";

import Logo from "./assets/imgs/logo-toliv.png";

import "./App.css";

import {
  fetchGetProductsByBranchOfficeId,
  fetchGetProductById,
  fetchGetBranchOfficeById,
} from "./lib/data";

export const PAYMENT_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PROCESSING: 'processing',
};

const SHOPPING_CART_ITEM = "shopping_cart";
const BRANCH_OFFICE_ID_ITEM = "branch_office_id";

function App() {
  const [branchOffice, setBranchOffice] = useState(null);
  const [categories, setCategories] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shoppingCart, setShoppingCart] = useState({});
  const [productSelected, setProductSelected] = useState(null);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [showOrangePage, setShowOrangePage] = useState(true);
  const [showCartPage, setShowCartPage] = useState(false);
  const [showPaymentInProgressPage, setShowPaymentInProgressPage] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.PROCESSING);

  useEffect(() => {
    initCommerceCode();
    initShoppingCart();
  }, []);

  const initCommerceCode = () => {
    const branchOfficeId = localStorage.getItem(BRANCH_OFFICE_ID_ITEM);
    if (branchOfficeId) {
      getBranchOfficeData(branchOfficeId);
    } else {
      setIsModalOpen(true);
    }
  };

  const initShoppingCart = () => {
    const sc = getShoppingCart();
    setShoppingCart(sc);
  };

  const updateShoppingCart = (products) => {
    setShoppingCart(products);
    localStorage.setItem(SHOPPING_CART_ITEM, JSON.stringify(products));
  };

  const getShoppingCart = () => {
    const shoppingCart = localStorage.getItem(SHOPPING_CART_ITEM);
    if (!shoppingCart) {
      updateShoppingCart({});
      return {};
    }
    return JSON.parse(shoppingCart);
  };

  const getBranchOfficeData = async (branchOfficeId) => {
    try {
      const [productsResponse, branchOfficeResponse] = await Promise.all([
        fetchGetProductsByBranchOfficeId(branchOfficeId),
        fetchGetBranchOfficeById(branchOfficeId),
      ]);
      setCategories(productsResponse.data);
      setBranchOffice(branchOfficeResponse.data);
    } catch (error) {
      console.error("error", error);
    }
  };

  const onFinish = (values) => {
    window.scrollTo(0, 0);
    localStorage.setItem(BRANCH_OFFICE_ID_ITEM, values.branchOfficeId);
    setIsModalOpen(false);
    getBranchOfficeData(values.branchOfficeId);
  };

  const onAddProductClick = async (product) => {
    console.log("onAddProductClick", product);
    const { id: pid } = product;
    const newShoppingCart = { ...shoppingCart };
    if (newShoppingCart[pid]) {
      newShoppingCart[pid].quantity += 1;
    } else {
      const data = await getProductById(pid);
      newShoppingCart[pid] = { ...data, quantity: 1 };
    }
    updateShoppingCart(newShoppingCart);
  };

  const onRemoveProductClick = (product) => {
    console.log("onRemoveProductClick", product);
    const { id: pid } = product;
    const newShoppingCart = { ...shoppingCart };
    if (newShoppingCart[pid]) {
      newShoppingCart[pid].quantity -= 1;
      if (newShoppingCart[pid].quantity === 0) {
        delete newShoppingCart[pid];
      }
      updateShoppingCart(newShoppingCart);
    }
  };

  const getProductById = async (pid) => {
    const response = await fetchGetProductById(branchOffice.id, pid);
    const product = get(response, 'data', null);
    if (product) {
      const productGroup = get(product, 'branch_offices_products_groups', null);
      if (productGroup) {
        productGroup.forEach((group) => {
          const optionsGroup = get(group, 'branch_offices_products_groups_options', null);
          if (optionsGroup) {
            const arrayOptions = [];
            optionsGroup.forEach((option) => {
              let nameOption = option.name;
              if (option.type_of_products_option && option.type_of_products_option.code === 'additional_price') {
                nameOption = `${nameOption} + $${numeral(option.price).format('0,0[,]0').replace(/,/g, ".")}`;
              }
              if (option.type_of_products_option && option.type_of_products_option.code === 'final_price') {
                nameOption = `${nameOption} ( precio base cambia a $${numeral(option.price).format('0,0[,]0').replace(/,/g, ".")} )`;
              }
              arrayOptions.push({
                label: nameOption,
                value: option.id,
                disabled: !option.active,
              });
              option.value = 0;
              const arraySelect = [];
              let maximoFor = 0;
              if (option.max_quantity > 0) {
                maximoFor = option.max_quantity;
              } else {
                maximoFor = group.max_value;
              }
              for (let l = 0; l < maximoFor; l++) {
                arraySelect.push(l);
              }
              if (arraySelect.length > 0) {
                arraySelect.push(arraySelect.length);
                option.arraySelect = arraySelect;
              }
            });
            if (arrayOptions.length > 0) {
              group.options = arrayOptions;
              group.optionsSelected = [];
              group.radioSelected = '';
            }
            group.count = 0;
          }
        });
      }
      product.quantity = 1;
      product.loading = true;
    }
    return product;
  };

  const onClickProduct = async ({ id: pid }) => {
    const product = await getProductById(pid);
    console.log(`respuesta finish ${JSON.stringify(product)}`);
    setProductSelected(product);
    setShowProductDetailModal(true);
  };

  const onClickPayAction = () => {
    console.log("onClickPayAction");
    setShowCartPage(true);
  }

  const onClickStart = () => {
    console.log("onClickStart");
    setShowOrangePage(false);
  }

  const onClickBackAction = () => {
    console.log("onClickBackAction");
    if (showCartPage) {
      setShowCartPage(false);
    } else {
      setShowOrangePage(true);
    }
  }

  /* const buildOrderBody = () => {
    //branchOffice
    //shoppingCart
    var orders = JSON.parse(localStorage.getItem("orders"));
    var branchOffice = JSON.parse(localStorage.getItem("branchOffice"));

    console.log("orders", orders);
    if (orders && orders.length > 0) {
      let products = [];
      for (var i = 0; i < orders.length; i++) {
        let products_groups_options = [];

        if (orders[i].branch_offices_products_groups) {
          for (
            var j = 0;
            j < orders[i].branch_offices_products_groups.length;
            j++
          ) {
            if (
              orders[i].branch_offices_products_groups[j].optionsSelected
                .length > 0
            ) {
              for (
                var l = 0;
                l <
                orders[i].branch_offices_products_groups[j].optionsSelected
                  .length;
                l++
              ) {
                let option = {
                  products_option_id:
                    orders[i].branch_offices_products_groups[j].optionsSelected[
                      l
                    ],
                  quantity: 1,
                };
                products_groups_options.push(option);
              }
            } else if (
              orders[i].branch_offices_products_groups[j].radioSelected !== ""
            ) {
              let option = {
                products_option_id:
                  orders[i].branch_offices_products_groups[j].radioSelected,
                quantity: 1,
              };
              products_groups_options.push(option);
            } else if (
              orders[i].branch_offices_products_groups[j]
                .branch_offices_products_groups_options
            ) {
              for (
                var k = 0;
                k <
                orders[i].branch_offices_products_groups[j]
                  .branch_offices_products_groups_options.length;
                k++
              ) {
                if (
                  orders[i].branch_offices_products_groups[j]
                    .branch_offices_products_groups_options[k].value > 0
                ) {
                  let option = {
                    products_option_id:
                      orders[i].branch_offices_products_groups[j]
                        .branch_offices_products_groups_options[k].id,
                    quantity:
                      orders[i].branch_offices_products_groups[j]
                        .branch_offices_products_groups_options[k].value,
                  };
                  products_groups_options.push(option);
                }
              }
              console.log("products_groups_options", products_groups_options);
            }
          }
        }
        console.log("orders[i]", orders[i]);
        let product = {
          product_id: orders[i].product.id,
          branch_office_product_id: orders[i].id,
          quantity: orders[i].quantity,
          observations: orders[i].observations,
          products_groups_options: products_groups_options,
          branch_offices_products_list_id:
            orders[i].branch_offices_products_list.id,
        };
        products.push(product);
      }
      console.log("products", products);

      let tipAux = 0;

      if (deliverySelected && deliverySelected.id === 2) {
        tipAux = amountTip;
      }

      if (deliverySelected && deliverySelected.id === 3) {
        tipAux = isTipOther ? amountTip : totalOrders * porcentTip;
      }

      let data = {
        branch_office_id: branchOffice.id,
        users_address_id:
          deliverySelected && deliverySelected.id === 2
            ? addressSelected.id
            : null,
        delivery_method_id: deliverySelected.id,
        payment_method_id: POS_PAYMENT_METHOD_ID,
        user_payment_methods_storage_id: methodsStorageSelected
          ? methodsStorageSelected.id
          : null,
        installments_number: duesSelected,
        observations: values.user.introduction ? values.user.introduction : "",
        products: products,
        coupon_code:
          deliverySelected &&
          deliverySelected.id !== 3 &&
          isCupon &&
          cuponData !== null &&
          cuponData.is_valid &&
          cuponData.has_condition
            ? codeCupon
            : null,
        delivery_tips: tipAux,
        branch_offices_table_id:
          deliverySelected.id === 3 ? tableSelected : undefined,
      };

      let itemsGtag = [];

      let arrayIds = [];

      orders.forEach(function (order, indice, array) {
        for (var i = 0; i < order.quantity; i++) {
          arrayIds.push(`${order.id}`);
          let item = {
            id: order.product.id,
            name: order.product.name,
            price: order.price,
            category: order.product.category.name,
            list_position: indice,
          };
          itemsGtag.push(item);
        }
      });

      localStorage.setItem("arrayIds", JSON.stringify(arrayIds));

      let totalCompra =
        deliverySelected && deliverySelected.id === 2 && costDelivery
          ? totalOrders + costDelivery.price
          : totalOrders;

      // TODO: data
    }
  }; */

  const onClickPayActionStepTwo = () => {
    setPaymentStatus(PAYMENT_STATUS.PROCESSING);
    setShowCartPage(false);
    setShowPaymentInProgressPage(true);
    setTimeout(() => {
      setPaymentStatus(PAYMENT_STATUS.ERROR);
    }, 2000);
  }

  const onGoBackClick = () => {
    setShowCartPage(true);
    setShowPaymentInProgressPage(false);
    setPaymentStatus(PAYMENT_STATUS.PROCESSING);
  };

  const onGoHomeClick = () => {
    
  }

  return (
    <>
      {
        showOrangePage && <OrangePage onClickStart={onClickStart} />
      }
      {
        !showOrangePage && !showCartPage && !showPaymentInProgressPage &&
        <main className="layout-app">
          <Header
            shoppingCart={shoppingCart}
            onClickBack={onClickBackAction} />
          <section className="content-app">
            <div className="title">
              <div className="title_logo">
                <img src={Logo} alt="Logo" />
              </div>
              <div className="title_texts">
                <h1>Barra Digital TOLIV</h1>
                <p>Selecciona lo que vas a pedir</p>
              </div>
            </div>
            {categories && (
              <ProductList
                categories={categories}
                shoppingCart={shoppingCart}
                onClickProduct={onClickProduct}
                onAddProductClick={onAddProductClick}
                onRemoveProductClick={onRemoveProductClick}
              />
            )}
          <ProductDetailModal
            productSelected={productSelected}
            branchOfficeData={branchOffice}
            show={showProductDetailModal}
            setShow={setShowProductDetailModal}
          />
          </section>
          <Footer
            shoppingCart={shoppingCart}
            onClickPayAction={onClickPayAction} />
        </main>
      }
      {
        showCartPage &&
          <CartPage
            shoppingCart={shoppingCart}
            onClickBackAction={onClickBackAction}
            onClickPayAction={onClickPayActionStepTwo}
            onRemoveProductClick={onRemoveProductClick}
            onAddProductClick={onAddProductClick} />
      }
      {
        showPaymentInProgressPage &&
          <PaymentInProgressPage
            shoppingCart={shoppingCart}
            branchOfficeData={branchOffice}
            paymentStatus={paymentStatus}
            onRetryerClick={onClickPayActionStepTwo}
            onGoHomeClick={onGoHomeClick}
            onGoBackClick={onGoBackClick} />
      }
      <Modal
        title="Atención"
        open={isModalOpen}
        closable={false}
        footer={[]}>
        <Form
          name="commerce-code-form"
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}>
          <Form.Item
            label="Código de comercio"
            name="branchOfficeId"
            rules={[
              {
                required: true,
                message: "El código de comercio es requerido!",
              },
            ]}>
            <Input placeholder="Ingrese el código del comercio" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default App;

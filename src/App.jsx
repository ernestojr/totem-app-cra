import { useEffect, useState } from "react";
import { Modal, Form, Button, Input } from "antd";
import { get } from 'lodash';
import numeral from 'numeral';

import Home from "./ui/Home/Home";
import CartPage from "./ui/CartPage/CartPage";
import PaymentInProgressPage from "./ui/PaymentInProgressPage/PaymentInProgressPage";

import Header from "./ui/Header/Header";
import Footer from "./ui/Footer/Footer";
import ProductList from "./ui/ProductList/ProductList";
import ProductDetailModal from "./ui/ProductDetailModal/ProductDetailModal";

import { storeIcon } from "./assets/icons/icons";
import { getTipTotalAmount, getTotalAmount} from './lib/utils';

import "./App.css";

import {
  fetchGetProductsByBranchOfficeId,
  fetchGetProductById,
  fetchGetBranchOfficeById,

  fetchCreateOrder,
  fetchPosSale,
  fetchConfirmPosSale,
  fetchGetOrderById,
} from "./lib/data";

export const PAYMENT_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PROCESSING: 'processing',
};

const SHOPPING_CART_ITEM = "shopping_cart";
const BRANCH_OFFICE_ID_ITEM = "branch_office_id";

const POS_PAYMENT_METHOD_ID = 11;

const PAGES = {
  HOME: 'home',
  PRODUCTS_LIST: 'products_list',
  CART: 'cart',
  PAYMENT: 'payment',
};

function App() {
  const [branchOffice, setBranchOffice] = useState(null);
  const [categories, setCategories] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [tipPercentageOption, setTipPercentageOption] = useState(0);

  const [productSelected, setProductSelected] = useState(null);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.PROCESSING);
  const [currentSecund, setCurrentSecund] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState(null);

  const [currentPage, setCurrentPage] = useState(PAGES.HOME);

  useEffect(() => {
    initCommerceCode();
    initShoppingCart();
    // eslint-disable-next-line
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

  const onEmptyCartClick = () => {
    updateShoppingCart([]);
  };

  const updateTipPercentageOption = (tip) => setTipPercentageOption(tip);

  const getShoppingCart = () => {
    const shoppingCart = localStorage.getItem(SHOPPING_CART_ITEM);
    if (!shoppingCart) {
      updateShoppingCart([]);
      return [];
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

  const hasProductGroup = (product) => get(product, 'branch_offices_products_groups', []).length > 0;

  const addProductFromModal = (product) => {
    addProductToShoppingCart(product);
  };

  const addProductToShoppingCart = (product) => {
    const { id: pid, quantity: productQuantity, price: productPrice } = product;
    const newShoppingCart = [...shoppingCart];
    if (!hasProductGroup(product)) {
      const index = newShoppingCart.findIndex(p => p.id === pid);
      if (index >= 0) {
        const newQuantity = newShoppingCart[index].quantity + productQuantity;
        const newTotalOrder = productPrice * newQuantity;
        newShoppingCart[index].quantity = newQuantity;
        newShoppingCart[index].totalOrder = newTotalOrder;
      } else {
        product.totalOrder = product.price * productQuantity;
        product.observations = "";
        product.allOptions = [];
        newShoppingCart.push({ ...product, quantity: productQuantity });
      }
    } else {
      newShoppingCart.push(product);
    }
    setProductSelected(null);
    updateShoppingCart(newShoppingCart); 
  }

  const onAddProductClick = async (product) => {
    const { id: pid, fromCart = false } = product;
    const newShoppingCart = [...shoppingCart];
    const index = newShoppingCart.findIndex(p => p.id === pid);
    if (index >= 0 && newShoppingCart[index] && (!hasProductGroup(newShoppingCart[index]) || fromCart)) {
      newShoppingCart[index].quantity += 1;
      newShoppingCart[index].totalOrder = newShoppingCart[index].quantity * newShoppingCart[index].price;
    } else {
      const data = await getProductById(pid);
      if (hasProductGroup(data)) {
        // TODO: Show modal
        setProductSelected({ ...data, quantity: 1 });
        setShowProductDetailModal(true);
        return;
      }
      // TODO: Solo agregar
      data.totalOrder = data.price * data.quantity;
      data.observations = '';
      data.allOptions = [];
      newShoppingCart.push({ ...data, quantity: 1 });
    }
    updateShoppingCart(newShoppingCart);
  };

  const onRemoveProductClick = (product) => {
    const { id: pid } = product;
    const newShoppingCart = [...shoppingCart];
    const index = newShoppingCart.findIndex(p => p.id === pid);
    if (index >= 0 && newShoppingCart[index]) {
      newShoppingCart[index].quantity -= 1;
      newShoppingCart[index].totalOrder = newShoppingCart[index].price * newShoppingCart[index].quantity;
      if (newShoppingCart[index].quantity === 0) {
        newShoppingCart.splice(index, 1);
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
              for (let num = 0; num < maximoFor; num++) {
                arraySelect.push(num);
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
      product.totalOrder = product.price;
      product.loading = true;
    }
    return product;
  };

  const onClickProduct = async ({ id: pid }) => {
    const product = await getProductById(pid);
    setProductSelected({ ...product, quantity: 1 });
    setShowProductDetailModal(true);
  };

  const onClickPayAction = () => {
    setCurrentPage(PAGES.CART);
  }

  const onClickStart = () => {
    setCurrentPage(PAGES.PRODUCTS_LIST);
  }

  const onClickBackAction = () => {
    if (currentPage === PAGES.CART) {
      setCurrentPage(PAGES.PRODUCTS_LIST);
    } else {
      setCurrentPage(PAGES.HOME);
    }
  }

  const buildProductsToSale = (productsInCart) => {
    return productsInCart.map((product) => {
      const productsGroupsOptions = [];
      const productsGroups = get(product, 'branch_offices_products_groups', []);
      productsGroups.forEach((group) => {
        const optionsSelected = get(group, 'optionsSelected', []);
        if (optionsSelected.length > 0) {
          optionsSelected.forEach((option) => {
            productsGroupsOptions.push({
              products_option_id: option,
              quantity: 1,
            });
          });
        } else if (group.radioSelected){
          productsGroupsOptions.push({
            products_option_id: group.radioSelected,
            quantity: 1,
          });
        } else {
          const options = get(productsGroups, 'branch_offices_products_groups_options', []);
          options.forEach((option) => {
            if (option.value > 0) {
              productsGroupsOptions.push({
                products_option_id: option.id,
                quantity: option.value,
              });
            }
          });
        }
      });
      return {
        product_id: product.product.id,
        branch_office_product_id: product.id,
        quantity: product.quantity,
        observations: product.observations,
        products_groups_options: productsGroupsOptions, // TODO: Pendiente de terminar
        branch_offices_products_list_id: product.branch_offices_products_list.id,
      };
    });
  }

  const onClickPayActionStepTwo = () => {
    let tipTotalAmount = 0;
    const { tips_totem: isTipEnable = false } = branchOffice;
    const total_amount = getTotalAmount(shoppingCart);
    if (isTipEnable) {
      tipTotalAmount += getTipTotalAmount(total_amount, tipPercentageOption);
    }
    const data = {
      branch_office_id: branchOffice.id,
      users_address_id: null,
      delivery_method_id: 3,
      payment_method_id: POS_PAYMENT_METHOD_ID,
      user_payment_methods_storage_id: null,
      installments_number: 1,
      observations: '',
      products: buildProductsToSale(shoppingCart),
      coupon_code: null,
      delivery_tips: tipTotalAmount,
      branch_offices_table_id: undefined,
    };
    goToSale(data);
  }

  const getListProducts = () => {

  };

  const removeAccents = text => text.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  const printInvoice = async (responseTbk, order) => {
    const { voucher: tbkVoucher } = responseTbk;
    if (window.electronAPI) {
      const result = await window.electronAPI.printInvoice({ tbkVoucher, order: JSON.parse(removeAccents(JSON.stringify(order))) });
      if (result.ok) {
        console.log('ok print');
      }
    } else {
      console.log('No se encontro integración con electron');
    }
  };

  const setTimerToGoToHome = () => {
    const TIME_TO_WAIT = 5;
    let currentSecund = TIME_TO_WAIT;
    const intervalId = setInterval(() => {
      setCurrentSecund(currentSecund);
      if (currentSecund <= 0) {
        clearInterval(intervalId);
        onGoHomeClick();
      }
      currentSecund--;
    }, 1000);
    setTimerIntervalId(intervalId);
  }

  const goToSale = async (data) => {
    setPaymentStatus(PAYMENT_STATUS.PROCESSING);
    setCurrentPage(PAGES.PAYMENT);
    try {
      let responseOrder = await fetchCreateOrder(data);
      if (!responseOrder || !responseOrder.success) {
        setPaymentStatus(PAYMENT_STATUS.ERROR);
        if (!responseOrder.has_stock) {
          getListProducts(); // TODO: Revisar que hacemos acá
        }
        return;
      }
      const { order_id: orderId, total_amount: totalAmount, uuid } = responseOrder.data;
      const responsePos = await fetchPosSale(orderId, totalAmount);
      if (!responsePos || !responsePos.successful) {
        setPaymentStatus(PAYMENT_STATUS.ERROR);
        return;
      }
      const responseConfirm = await fetchConfirmPosSale(orderId, uuid, responsePos);
      if (!responseConfirm || !responseConfirm.success) {
        setPaymentStatus(PAYMENT_STATUS.ERROR);
        return;
      }
      const reponseOrderDetail = await fetchGetOrderById(orderId, uuid);
      await printInvoice(responsePos, reponseOrderDetail.data);
      setPaymentStatus(PAYMENT_STATUS.SUCCESS);
      setTimerToGoToHome();
    } catch (error) {
      console.error(error);
      setPaymentStatus(PAYMENT_STATUS.ERROR);
    }
  }

  const onGoBackClick = () => {
    setCurrentPage(PAGES.CART);
    setPaymentStatus(PAYMENT_STATUS.PROCESSING);
  };

  const onGoHomeClick = () => {
    updateShoppingCart([]);
    setCurrentPage(PAGES.HOME);
    updateTipPercentageOption(0);
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      setTimerIntervalId(null);
    }
  }

  return (
    <>
      {
        currentPage === PAGES.HOME && <Home onClickStart={onClickStart} />
      }
      {
        currentPage === PAGES.PRODUCTS_LIST &&
        <main className="layout-app">
          <Header
            shoppingCart={shoppingCart}
            onClickBack={onClickBackAction}
            onClickPayAction={onClickPayAction} />
          <section className="content-app">
            <div className="content-app__title">
              <img src={storeIcon} alt="store-icon" />
              <h1>Ordena Aquí</h1>
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
          </section>
          <Footer
            shoppingCart={shoppingCart}
            onClickPayAction={onClickPayAction} />
        </main>
      }
      {
        currentPage === PAGES.CART &&
          <CartPage
            shoppingCart={shoppingCart}
            branchOfficeData={branchOffice}
            onClickBackAction={onClickBackAction}
            onClickPayAction={onClickPayActionStepTwo}
            onRemoveProductClick={onRemoveProductClick}
            onEmptyCartClick={onEmptyCartClick}
            tipPercentageOption={tipPercentageOption}
            updateTipPercentageOption={updateTipPercentageOption}
            onAddProductClick={onAddProductClick} />
      }
      {
        currentPage === PAGES.PAYMENT &&
          <PaymentInProgressPage
            currentSecund={currentSecund}
            shoppingCart={shoppingCart}
            branchOfficeData={branchOffice}
            paymentStatus={paymentStatus}
            onRetryerClick={onClickPayActionStepTwo}
            onGoHomeClick={onGoHomeClick}
            onGoBackClick={onGoBackClick} />
      }
      <ProductDetailModal
        shoppingCart={shoppingCart}
        onAddProduct={addProductFromModal}
        onRemoveProduct={onRemoveProductClick}
        productSelected={productSelected}
        setProductSelected={setProductSelected}
        branchOfficeData={branchOffice}
        show={showProductDetailModal}
        setShow={setShowProductDetailModal}
      />
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

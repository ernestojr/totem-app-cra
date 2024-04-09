import { LoadingOutlined  } from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';

import { checkCircleIcon } from '../../assets/icons/icons';

import './PaymentInProgressPage.css';

export const PAYMENT_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PROCESSING: 'processing',
};

export default function PaymentInProgressPage(props) {
  const {
    currentSecund,
    shoppingCart = [],
    branchOfficeData,
    paymentStatus,
    onRetryerClick,
    onGoBackClick,
    onGoHomeClick,
  } = props;
  return (
    <div className='payment-status'>
      {
        paymentStatus === PAYMENT_STATUS.PROCESSING &&
          <div className='payment-status__in-progress'>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 144 }} spin />} />
            <p>Procesando Pago</p>
          </div>
      }
      {
        paymentStatus === PAYMENT_STATUS.SUCCESS &&
          <div className='payment-status__success'>
            <img src={checkCircleIcon} alt="Success" />
            <p className='payment-status__title'>¡Venta generada exitosamente!</p>
            <p className='payment-status__sub-title'>Retire voucher</p>
            <div className='payment-status__footer'>
              <button className='payment-status__footer__button' onClick={() => onGoHomeClick()} >Volver al Inicio ({currentSecund})</button>
            </div>
          </div>
      }
      {
        paymentStatus === PAYMENT_STATUS.ERROR &&
          <Result
            status="error"
            title="Tuvimos problemas para procesar su pago"
            subTitle="Lo sentimos, reintente nuevamente por favor"
            extra={[
              <Button size="large" key="buy" onClick={() => onGoBackClick()}>Volver</Button>,
              <Button size="large" type="primary" key="console" onClick={() => onRetryerClick()}>
                Reintentar
              </Button>,
            ]}
          />
      }
    </div>
  );
}
import { useState } from 'react';
import { LoadingOutlined  } from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';

import './PaymentInProgressPage.css';

export const PAYMENT_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PROCESSING: 'processing',
};

export default function PaymentInProgressPage(props) {
  const {
    shoppingCart,
    branchOfficeData,
    paymentStatus,
    onRetryerClick,
    onGoBackClick,
    onGoHomeClick,
  } = props;
  
  console.log(shoppingCart, branchOfficeData);

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
          <Result
            status="success"
            title="¡Venta generada exitosamente!"
            subTitle="Retire voucher"
            extra={[
              <Button type="primary" key="console" onClick={() => onGoHomeClick()}>
                Volver al inicio
              </Button>,
            ]}
          />
      }
      {
        paymentStatus === PAYMENT_STATUS.ERROR &&
          <Result
            status="error"
            title="Tuvimos problemas para procesar su pago"
            subTitle="Lo sentimos, reintente nuevamente por favor"
            extra={[
              <Button key="buy" onClick={() => onGoBackClick()}>Volver</Button>,
              <Button type="primary" key="console" onClick={() => onRetryerClick()}>
                Reintentar
              </Button>,
            ]}
          />
      }
    </div>
  );
}
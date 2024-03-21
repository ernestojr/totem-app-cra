import { useState } from 'react';
import { LoadingOutlined  } from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';

import './PaymentInProgressPage.css';

const STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PROCESSING: 'processing',
};

export default function PaymentInProgressPage(props) {
  const { shoppingCart, branchOfficeData } = props;

  const [paymentStatus, setPaymentStatus] = useState(STATUS.PROCESSING);
  
  console.log(shoppingCart, branchOfficeData);

  return (
    <div className='payment-status'>
      {
        paymentStatus === STATUS.PROCESSING &&
          <div className='payment-status__in-progress'>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 144 }} spin />} />
            <p>Procesando Pago</p>
          </div>
      }
      {
        paymentStatus === STATUS.SUCCESS &&
          <Result
            status="success"
            title="¡Venta generada exitosamente!"
            subTitle="Retire voucher"
            extra={[
              <Button type="primary" key="console">
                Volver al inicio
              </Button>,
            ]}
          />
      }
      {
        paymentStatus === STATUS.ERROR &&
          <Result
            status="error"
            title="Tuvimos problemas para procesar su pago"
            subTitle="Lo sentimos, reintente nuevamente por favor"
            extra={[
              <Button key="buy">Volver al inicio</Button>,
              <Button type="primary" key="console">
                Reintentar
              </Button>,
            ]}
          />
      }
    </div>
  );
}
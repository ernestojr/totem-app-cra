
const API_HOST = process.env.REACT_APP_API_HOST;
const API_HOST_POS = process.env.REACT_APP_API_HOST_POS;
const COUNTRY = process.env.REACT_APP_COUNTRY;
const CITY_ID = process.env.REACT_APP_API_CITY_ID;

export async function fetchGetBranchOfficeById(branchOfficeId) {
  const url = `${API_HOST}/branch_offices/${branchOfficeId}`;
  const res = await fetch(url);
  return await res.json();
}

export async function fetchGetProductsByBranchOfficeId(branchOfficeId) {
  const url = `${API_HOST}/countries/${COUNTRY}/cities/${CITY_ID}/branch_offices/${branchOfficeId}/branch_offices_products_lists`;
  const res = await fetch(url);
  return await res.json();
}

export async function fetchGetProductById(branchOfficeId, productId) {
  const url = `${API_HOST}/countries/${COUNTRY}/cities/${CITY_ID}/branch_offices/${branchOfficeId}/branch_offices_products/${productId}`;
  const res = await fetch(url);
  return await res.json();
}

export async function fetchGetOrderById(order_id, uuid) {
  const url = `${API_HOST}/orders/${order_id}/uuid/${uuid}`;
  const res = await fetch(url);
  return await res.json();
}

export async function fetchCreateOrder(data) {
  const url = `${API_HOST}/orders?domain=${window.location.host}`;
  const res = await fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

export async function fetchPosSale(ticket, amount) {
  const url = `${API_HOST_POS}/orders?domain=${window.location.host}`;
  const res = await fetch(url, {
    method: 'post',
    body: JSON.stringify({ ticket, amount }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

export async function fetchConfirmPosSale(orderId, uuid, tbkResponse) {
  const url = `${API_HOST_POS}/api/sales/confirm?uuid=${uuid}`;
  const res = await fetch(url, {
    method: 'post',
    body: JSON.stringify({ ...tbkResponse, order_id: orderId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

export const getTotalAmount = (shoppingCart) => {
  let totalAmount = 0;
  shoppingCart.forEach((product) => {
    console.log('product.totalOrder', product.totalOrder);
    console.log('product.quantity', product.quantity);
    totalAmount += product.totalOrder;
  });
  return totalAmount;
}

export const getTipTotalAmount = (totalAmount, tipPercentageOption) => {
  return totalAmount * (tipPercentageOption / 100);
}
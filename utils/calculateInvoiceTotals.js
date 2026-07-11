const calculateInvoiceTotals = (items, taxRate) => {
  const subTotal = items.reduce((subTotal, item) => {
    return subTotal + item.quantity * item.unitPrice;
  }, 0);
  const taxAmount = subTotal * (taxRate / 100);
  const total = subTotal + taxAmount;
  return { subTotal, taxAmount, total };
};

module.exports = calculateInvoiceTotals;

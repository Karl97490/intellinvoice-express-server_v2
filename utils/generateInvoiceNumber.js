const generateInvoiceNumber = async (User, userId) => {
  // Generate invoice number with the atomic nextInvoiceNumber counter from User model
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $inc: {
        "invoices.nextInvoiceNumber": 1, // increment by 1 the nextInvoiceNumber counter
      },
    },
    { returnDocument: false }, // Get the number before incrementing
  );
  const { nextInvoiceNumber } = user.invoices;
  const invoiceNumber = `INV-${String(nextInvoiceNumber).padStart(3, "0")}`;
  return invoiceNumber;
};

module.exports = generateInvoiceNumber;

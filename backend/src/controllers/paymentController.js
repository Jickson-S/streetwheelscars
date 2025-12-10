export const createPayment = async (req, res) => {
  const amount = req.body.amount;
  res.json({
    payment_id: "test_" + Date.now(),
    amount,
    status: "created",
  });
};

export const verifyPayment = async (req, res) => {
  res.json({
    success: true,
    transaction: "tx_" + Date.now(),
  });
};

const STATUS = {
  // Dành cho Bàn ăn (Order)
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',

  // Dành cho Món ăn (OrderDetail)
  PENDING_CONFIRM: 'PENDING_CONFIRM',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  CANCELLED: 'CANCELLED'
};

module.exports = STATUS;

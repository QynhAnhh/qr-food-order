const SOCKET_EVENTS = {
  // Liên quan đến Giỏ hàng (Chưa chốt đơn)
  ADD_ITEM: 'add_item',
  REMOVE_ITEM: 'remove_item',
  REQUEST_CART_STATE: 'request_cart_state', // Khách bị rớt mạng, vô lại xin dữ liệu giỏ hàng

  // Liên quan đến Đơn hàng (Đã chốt)
  ORDER_NEW: 'order:new',
  ORDER_STATUS_CHANGE: 'order:statusChange' // Báo cho Bếp/Khách là trạng thái món vừa đổi
};

module.exports = SOCKET_EVENTS;

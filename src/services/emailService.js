import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'elvreofficals@gmail.com';

// Send order confirmation to customer
export const sendOrderConfirmation = async (orderDetails) => {
  try {
    const templateParams = {
      order_id: orderDetails.id,
      customer_name: orderDetails.customer,
      customer_email: orderDetails.email,
      order_date: orderDetails.orderDate,
      order_time: orderDetails.orderTime,
      order_status: orderDetails.status,
      products: orderDetails.products.map(p => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        total: p.price * p.quantity
      })),
      total_amount: orderDetails.total,
      shipping_address: orderDetails.address,
      payment_method: orderDetails.paymentMethod,
      tracking_link: `${window.location.origin}/order-tracking/${orderDetails.id}`
    };

    const result = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_USER,
      templateParams
    );
    
    console.log('Order confirmation email sent to customer:', result);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
};

// Send new order notification to admin
export const sendAdminNotification = async (orderDetails) => {
  try {
    const templateParams = {
      order_id: orderDetails.id,
      customer_name: orderDetails.customer,
      customer_email: orderDetails.email,
      customer_phone: orderDetails.phone,
      order_date: orderDetails.orderDate,
      order_time: orderDetails.orderTime,
      products: orderDetails.products.map(p => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        total: p.price * p.quantity
      })),
      total_amount: orderDetails.total,
      shipping_address: orderDetails.address,
      payment_method: orderDetails.paymentMethod,
      admin_link: `${window.location.origin}/admin-dashboard`,
      to_email: ADMIN_EMAIL,
      reply_to: orderDetails.email
    };

    const result = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ADMIN,
      templateParams
    );
    
    console.log('Admin notification email sent to:', ADMIN_EMAIL, result);
    return { success: true };
  } catch (error) {
    console.error('Admin email error:', error);
    return { success: false, error };
  }
};
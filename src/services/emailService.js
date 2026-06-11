import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

// Send order confirmation to customer
export const sendOrderConfirmation = async (orderDetails) => {
  try {
    const trackingUrl = `${window.location.origin}/order-tracking/${orderDetails.id}`;
    
    console.log('📧 Sending order confirmation email to customer:', orderDetails.email);
    console.log('📧 Order ID:', orderDetails.id);
    console.log('📧 Tracking URL:', trackingUrl);
    
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
      tracking_link: trackingUrl,
      to_email: orderDetails.email,
      reply_to: 'elvreofficals@gmail.com'
    };

    const result = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_USER,
      templateParams
    );
    
    console.log('✅ Order confirmation email sent successfully to:', orderDetails.email);
    console.log('✅ EmailJS Response:', result);
    return { success: true };
  } catch (error) {
    console.error('❌ Order confirmation email error:', error);
    return { success: false, error };
  }
};

// Send new order notification to admin
export const sendAdminNotification = async (orderDetails) => {
  try {
    console.log('📧 Sending admin notification for order:', orderDetails.id);
    console.log('📧 Customer:', orderDetails.customer);
    console.log('📧 Total Amount:', orderDetails.total);
    
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
      to_email: 'elvreofficals@gmail.com'
    };

    const result = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ADMIN,
      templateParams
    );
    
    console.log('✅ Admin notification sent successfully to: elvreofficals@gmail.com');
    console.log('✅ EmailJS Response:', result);
    return { success: true };
  } catch (error) {
    console.error('❌ Admin notification email error:', error);
    return { success: false, error };
  }
};
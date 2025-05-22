import Razorpay from 'razorpay';
import crypto  from 'crypto';
import AdminPayment from '../models/PaymentModelAdmin.js';
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.JWT_SECRET);
console.log(process.env.RAZORPAY_KEY_SECRET)
const razorpay = new Razorpay({
    key_id: 'rzp_test_34o4htnNREVMNd',   // Replace with  Razorpay Key ID
    key_secret: 'X6kwWcZcpFcCI0IkiM5lqs9t' // Replace with  Razorpay Key Secret
  });
export const checkPaymentStatus = async (req, res) => {
    const { paymentId } = req.body;
  
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      res.status(200).json({
        status: payment.status,
        amount: payment.amount / 100, // Convert to the original amount if stored in paise
        method: payment.method,
        description: payment.description,
        created_at: new Date(payment.created_at * 1000).toLocaleString(),
      });
    } catch (error) {
      console.error('Error fetching payment status:', error);
      res.status(500).json({ message: 'Failed to fetch payment status.' });
    }
  };
  export const requestRefund = async (req, res) => {
    const { paymentId, amount } = req.body;
  
    try {
      // Assuming Razorpay as the payment gatewa
      const refund = await razorpay.payments.refund(paymentId, {
        amount: amount * 100, // Amount in paise (₹1 = 100 paise)
      });
      return res.status(200).json({ message: "Refund processed successfully", refund });
    } catch (error) {
      console.error("Refund Error:", error);
      return res.status(500).json({ message: "Refund failed", error: error.message });
    }
  };
  const generateInvoice = async (paymentId, customerDetails, amount, description) => {
    // Example Razorpay invoice creation
    const invoice = await razorpay.invoices.create({
      type: 'invoice',
      // payment_id: paymentId,
      description,
      customer: {
        name: customerDetails.name,
        email: customerDetails.email,
      },
      line_items: [
        {
          name: description,
          amount: amount * 100, // Convert back to paise
          currency: 'INR',
          quantity: 1,
        },
      ],
    });
  
    return invoice.short_url; // Return the invoice URL
  };
  const generateInvoiceWithPaymentId = async (paymentId) => {
    // const { paymentId } = req.body;
    try {
      // Fetch payment details
      const payment = await razorpay.payments.fetch(paymentId);
  
      if (!payment || payment.status !== 'captured') {
        console.log('unsuccesful')
        // return res.status(400).json({ message: 'Invalid or unsuccessful payment' });
      }
  
      // Extract required details for the invoice
      const customerDetails = {
        name: payment.customer_name || 'Customer',
        email: payment.email || 'N/A',
      };
      const amount = payment.amount / 100; // Convert from paise to rupees
      const description = payment.description || 'Purchase Invoice';
  
      // Generate Invoice (example implementation, adjust as needed)
      const invoiceUrl = await generateInvoice(paymentId, customerDetails, amount, description);
      return invoiceUrl;
  
    } catch (error) {
      return '';
    }
  };
  //this is for company admin who registers ...  
  export const CreateOrderForAdmin = async (req, res) => {
    try {
      const { userId,amount,company_name,company_email,credits} = req.body;
  
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert INR to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId,
          company_name,
          company_email,
          credits,
        },
      });
  
      res.status(200).json({
        success: true,
        orderId: order.id,
        amount: order.amount / 100,
        currency: order.currency,
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ success: false, error: "Unable to create order" });
    }
  };
 // verify payment for company admin ...
  export const VerifyPaymentForAdmin = async (req, res) => {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        credits,
        company_email,
        company_db_name,
        company_name,
        PlanType,
        Amount,
      } = req.body;
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      if (generatedSignature === razorpay_signature) {
        const UpdatePaymentForAdmin=new AdminPayment({
            OrderId:razorpay_order_id,
            PaymentId:razorpay_payment_id,
            amount:Amount,
            company_db_name:company_db_name,
            email:company_email,
            company_name:company_name,
            start_date:new Date(),
            end_date: new Date(new Date().setDate(new Date().getDate() + 30)),
            credits:credits,
            PlanType:PlanType,
            PaidByAdmin:true,
        })
        const invoice_url =await  generateInvoiceWithPaymentId(razorpay_payment_id);
        console.log(invoice_url, ' from verify payment for Admin');
        await UpdatePaymentForAdmin.save();
        res.status(200).json({ success: true, message: "Payment verified successfully", invoice_url: invoice_url ? invoice_url : "" });
      } else {
        res.status(400).json({ success: false, error: "Invalid payment signature" });
      }
    } catch (error) {
      console.log("Error verifying payment:", error);
      res.status(500).json({ success: false, error: "Payment verification failed" });
    }
  };
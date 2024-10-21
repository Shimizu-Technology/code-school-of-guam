const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-lg">Thank you for your payment. Your transaction has been processed successfully.</p>
        <p className="mt-4">You can now proceed with your course registration or view your dashboard for more information.</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;

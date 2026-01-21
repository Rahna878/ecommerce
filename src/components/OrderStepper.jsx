// components/OrderStepper.jsx
import React from 'react';

const OrderStepper = ({ currentStatus }) => {
  const steps = ['Placed', 'Packed', 'Shipped', 'Delivered'];
  
  // Handle 'Cancelled' state separately
  if (currentStatus === 'Cancelled') {
    return <div className="alert alert-danger">This order has been cancelled.</div>;
  }

  const activeIndex = steps.indexOf(currentStatus);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '40px 0', position: 'relative' }}>
      {/* Background Line */}
      <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', background: '#e0e0e0', zIndex: 1 }} />
      
      {/* Progress Line */}
      <div style={{ 
        position: 'absolute', top: '15px', left: '0', height: '2px', background: '#f0c14b', zIndex: 1,
        width: `${(activeIndex / (steps.length - 1)) * 100}%`, transition: 'width 0.5s ease' 
      }} />

      {steps.map((step, index) => (
        <div key={step} style={{ zIndex: 2, textAlign: 'center', flex: 1 }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%', margin: '0 auto',
            background: index <= activeIndex ? '#f0c14b' : '#fff',
            border: `2px solid ${index <= activeIndex ? '#f0c14b' : '#e0e0e0'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', color: index <= activeIndex ? '#fff' : '#888'
          }}>
            {index < activeIndex ? '✓' : index + 1}
          </div>
          <p style={{ marginTop: '10px', fontSize: '14px', fontWeight: index === activeIndex ? 'bold' : '500' }}>
            {step}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderStepper;
import React from 'react';
import UnknownMerchantCard from './UnknownMerchantCard';

const UnknownMerchantList = ({ merchants, onAssign, onDismiss, assigning }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
      {merchants.map(merchant => (
        <UnknownMerchantCard 
          key={merchant._id} 
          merchant={merchant} 
          onAssign={onAssign} 
          onDismiss={onDismiss} 
          assigning={assigning}
        />
      ))}
    </div>
  );
};

export default UnknownMerchantList;

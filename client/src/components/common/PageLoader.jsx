import React from 'react';
import KharchaLoader from './KharchaLoader';

export default function PageLoader() {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <KharchaLoader />
    </div>
  );
}

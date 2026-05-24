import React from 'react';
import KharchaLoader from './KharchaLoader';

export default function Loader() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#020617',
        gap: '2rem',
      }}
    >
      <KharchaLoader />
    </div>
  );
}

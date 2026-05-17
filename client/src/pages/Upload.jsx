import React from 'react';
import Card from '../components/common/Card';

const Upload = () => {
  return (
    <div className="space-y-6">
      <Card title="Upload Bank Statement">
        <p className="text-gray-400">Upload your CSV bank statements for automatic processing.</p>
      </Card>
    </div>
  );
};

export default Upload;

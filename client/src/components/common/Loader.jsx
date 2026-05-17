import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );
};

export default Loader;

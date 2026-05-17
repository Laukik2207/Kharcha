import React from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Kharcha
          </h1>
          <p className="text-gray-400 mt-2">Create a new account</p>
        </div>
        
        <Card>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <Input label="Full Name" type="text" placeholder="John Doe" />
            <Input label="Email address" type="email" placeholder="you@example.com" />
            <Input label="Password" type="password" placeholder="••••••••" />
            <Button className="w-full" type="submit">Create Account</Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <a href="/login" className="text-primary-500 hover:text-primary-400">Sign in</a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;

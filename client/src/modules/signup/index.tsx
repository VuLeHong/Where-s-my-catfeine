'use client';

import Link from 'next/link';
import React, { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const handleChange = () => {
    
    setFormData({ ...formData});
  };
  const handleSubmit = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      const response = await fetch('http://localhost:8080/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      toast({
        title: "User was created ",
        description: "Your register success",
      })
      setFormData({ username: '', email: '', password: '' });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      toast({
        title: "Registration failed",
        description: "Something was wrong in register",
      })
      console.log(err);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2 mt-1 border rounded-md text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-1 border rounded-md text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-1 border rounded-md text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href={'/login'} className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

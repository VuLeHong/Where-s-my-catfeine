'use client';
import Link from 'next/link';
import React, { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [userEmail, setEmail] = useState('');
  const [userPassword, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast()

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/auth/create-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userEmail, userPassword}), 
        credentials: 'include', 
    })
      if(!response.ok){
        toast({
          title: "Login failed",
          description: "Fail to fetch",
        })
      }
      const result = await response.json();
      if (result.message === "Success") {
        toast({
          title: "Login success",
          description: result.message,
        })
        await router.push('/');
      }
      else{
        toast({
          title: "Login failed",
          description: result.message,
      })
    }
    } catch (error: unknown) {
      console.log(error)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-1 border rounded-md text-black"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-1 border rounded-md text-black"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Do not have an account?{" "}
          <Link href={'/signup'} className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

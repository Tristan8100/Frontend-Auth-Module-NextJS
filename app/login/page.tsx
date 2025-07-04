'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api'; // Your existing Axios instance
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) => 
      api.post('/api/login', credentials).then(res => res.data),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('Login successful:', data);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      {loginMutation.isError && (
        <div>Error: {loginMutation.error.message}</div>
      )}
    </div>
  );
}
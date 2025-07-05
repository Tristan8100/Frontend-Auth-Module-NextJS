'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SendResetLink() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const ResetLink = useMutation({
    mutationFn: (credentials: { email: string; }) => 
      api.post('/api/forgot-password', credentials).then(res => res.data),
    onSuccess: (data) => {
        console.log('Registration successful:', data);
        localStorage.setItem('email', email); // Store email in localStorage for later use
        router.push('/forgot-password/verify-otp'); // Redirect to dashboard on success
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ResetLink.mutate({ email });
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit" disabled={ResetLink.isPending}>
          {ResetLink.isPending ? 'Submit...' : 'Submit'}
        </button>
      </form>
      
      {ResetLink.isError && (
        <div>Error: {ResetLink.error.message}</div>
      )}

    </div>
  );
}
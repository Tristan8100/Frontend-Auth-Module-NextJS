'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api'; // Your existing Axios instance
import { useRouter } from 'next/navigation';

export default function VerifyOtp() {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const VerifyOtp = useMutation({
    mutationFn: (credentials: { email: string; otp: string }) => 
      api.post('/api/forgot-password-token', credentials).then(res => res.data),
    onSuccess: (data) => {
        console.log('Registration successful:', data);
        console.log('OTP verified successfully:', data.token);
        localStorage.setItem('reset-token', data.token); // Store email in localStorage for later use
        router.push('/forgot-password/reset-password'); // Redirect to dashboard on success
    },
  });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const email = localStorage.getItem('email'); // Assuming email is stored in localStorage
        if (!email) {
            console.error('Email not found in localStorage');
            return;
        }
        VerifyOtp.mutate({ email, otp }); 
    }
    return (
        <>
        <form onSubmit={handleSubmit}>
            <h1>Verify OTP</h1>
            <input
                type="number"
                placeholder="Enter OTP"
                value={otp}
                required
                onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit" disabled={VerifyOtp.isPending}>
                {VerifyOtp.isPending ? 'Submitting...' : 'Submit'}
            </button>
        </form>
        </>
    );
}
'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [password_confirmation, setConfirmPassword] = useState("");
    const ResetPassword = useMutation({
        mutationFn: (credentials: { email: string; token: string; password: string; password_confirmation: string }) => 
        api.post('/api/reset-password', credentials).then(res => res.data),
        onSuccess: (data) => {
            console.log('successful:', data);
            localStorage.removeItem('reset-token'); // Clear the token from localStorage
            localStorage.removeItem('email'); // Clear the email from localStorage
            router.push('/login'); // Redirect to dashboard on success
        },
    })
    const handleclick = (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('reset-token');
        const email = localStorage.getItem('email');
        if (!token || !email) {
            console.error('Token or email not found in localStorage');
            return;
        }
        ResetPassword.mutate({ email, token, password, password_confirmation });
    }

    return (
        <div>
            <h1>Reset Password</h1>
            <p>Please enter your new password below.</p>
            {/* Add your reset password form here */}
            <form onSubmit={handleclick}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={password_confirmation}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
}
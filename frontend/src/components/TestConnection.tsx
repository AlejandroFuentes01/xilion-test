'use client';

import { booksService } from '@/services/api';
import { useEffect, useState } from 'react';

export default function TestConnection() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const testConnection = async () => {
            try {
                const response = await booksService.getBooks({ limit: 3 });
                setData(response);
                setStatus('success');
            } catch (error) {
                console.error('Connection test failed:', error);
                setStatus('error');
            }
        };

        testConnection();
    }, []);

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Backend Connection Test</h3>

            {status === 'loading' && (
                <div className="text-blue-600">Testing connection...</div>
            )}

            {status === 'success' && (
                <div className="text-green-600">
                    ✅ Connected! Found {data?.pagination?.total} books
                </div>
            )}

            {status === 'error' && (
                <div className="text-red-600">
                    ❌ Connection failed. Check if backend is running on port 3000
                </div>
            )}
        </div>
    );
}
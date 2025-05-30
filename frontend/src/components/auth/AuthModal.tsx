'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

    if (!isOpen) return null;

    const handleSuccess = () => {
        onClose();
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-25"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>

                    {/* Content */}
                    <div className="mt-4">
                        {mode === 'login' ? (
                            <LoginForm onSuccess={handleSuccess} onToggleMode={toggleMode} />
                        ) : (
                            <RegisterForm onSuccess={handleSuccess} onToggleMode={toggleMode} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
"use client";

import React, { useEffect } from "react";

interface SuccessModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

export default function SuccessModal({
    isOpen,
    title,
    message,
    onClose,
    autoClose = true,
    autoCloseDelay = 2000
}: SuccessModalProps) {
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, autoCloseDelay, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500 delay-100">
                        <i className="fas fa-check text-3xl text-green-600"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600">{message}</p>
                </div>
                <div className="p-4 bg-gray-50 flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

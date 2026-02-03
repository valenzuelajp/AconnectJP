"use client";

import React from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: "danger" | "success" | "warning" | "info";
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    type = "warning"
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: "bg-red-50",
            icon: "text-red-600",
            iconBg: "bg-red-100",
            button: "bg-red-600 hover:bg-red-700"
        },
        success: {
            bg: "bg-green-50",
            icon: "text-green-600",
            iconBg: "bg-green-100",
            button: "bg-green-600 hover:bg-green-700"
        },
        warning: {
            bg: "bg-amber-50",
            icon: "text-amber-600",
            iconBg: "bg-amber-100",
            button: "bg-amber-600 hover:bg-amber-700"
        },
        info: {
            bg: "bg-blue-50",
            icon: "text-blue-600",
            iconBg: "bg-blue-100",
            button: "bg-blue-600 hover:bg-blue-700"
        }
    };

    const icons = {
        danger: "fa-exclamation-triangle",
        success: "fa-check-circle",
        warning: "fa-exclamation-circle",
        info: "fa-info-circle"
    };

    const currentColor = colors[type];
    const currentIcon = icons[type];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
                <div className={`${currentColor.bg} p-6 flex items-start gap-4`}>
                    <div className={`${currentColor.iconBg} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
                        <i className={`fas ${currentIcon} ${currentColor.icon} text-xl`}></i>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
                    </div>
                </div>
                <div className="p-6 flex gap-3 justify-end bg-gray-50">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2.5 rounded-lg font-semibold text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-6 py-2.5 rounded-lg font-semibold text-sm text-white ${currentColor.button} transition-colors shadow-sm`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

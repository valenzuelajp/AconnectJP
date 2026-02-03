"use client";

import React from "react";
import Image from "next/image";

interface DetailModalProps {
    isOpen: boolean;
    title: string;
    content?: string;
    image?: string;
    date?: Date | string;
    type?: string; // e.g., "Announcement", "News", "Story", "Carousel"
    onClose: () => void;
}

export default function DetailModal({
    isOpen,
    title,
    content,
    image,
    date,
    type,
    onClose
}: DetailModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header / Image Area */}
                <div className="relative">
                    {image ? (
                        <div className="w-full h-[250px] relative bg-gray-100">
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                    ) : (
                        <div className="w-full h-[120px] bg-gradient-to-r from-[#8B1538] to-[#6B0F2A]"></div>
                    )}

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-all z-10"
                    >
                        <i className="fas fa-times"></i>
                    </button>

                    <div className="absolute bottom-6 left-6 right-6 text-white">
                        {type && (
                            <span className="inline-block px-3 py-1 bg-[#8B1538] text-[10px] font-bold uppercase tracking-widest rounded-md mb-2 shadow-sm">
                                {type}
                            </span>
                        )}
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight shadow-black drop-shadow-md">
                            {title}
                        </h2>
                        {date && (
                            <p className="text-sm font-medium opacity-90 mt-2 flex items-center gap-2">
                                <i className="far fa-calendar-alt"></i>
                                {new Date(date).toLocaleDateString("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="prose prose-slate max-w-none">
                        {content ? (
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                {content}
                            </p>
                        ) : (
                            <p className="text-gray-400 italic">No description available.</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

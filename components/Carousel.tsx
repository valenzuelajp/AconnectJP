"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CarouselProps {
    photos: { id: number; file_name: string; title?: string; description?: string }[];
}

const Carousel = ({ photos }: CarouselProps) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (photos.length === 0) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % photos.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [photos]);

    if (photos.length === 0) return null;

    return (
        <div className="relative h-full w-full rounded-[16px] overflow-hidden shadow-lg bg-white border border-black/10">
            {photos.map((photo, index) => (
                <div
                    key={photo.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <img
                        src={`/assets/uploads/carousel/${photo.file_name}`}
                        alt={photo.title || "Carousel Image"}
                        className="w-full h-full object-cover"
                    />
                    {(photo.title || photo.description) && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-10 text-white">
                            {photo.title && <h2 className="text-3xl font-black mb-2 animate-in slide-in-from-bottom-4 duration-700">{photo.title}</h2>}
                            {photo.description && <p className="text-white/80 text-lg line-clamp-2 max-w-2xl animate-in slide-in-from-bottom-2 duration-700 delay-100">{photo.description}</p>}
                        </div>
                    )}
                </div>
            ))}

            <button
                onClick={() => setCurrent((prev) => (prev - 1 + photos.length) % photos.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-all z-20"
            >
                <i className="fas fa-chevron-left"></i>
            </button>
            <button
                onClick={() => setCurrent((prev) => (prev + 1) % photos.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-all z-20"
            >
                <i className="fas fa-chevron-right"></i>
            </button>

            {}
            <div className="absolute bottom-6 right-10 flex gap-2 z-20">
                {photos.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? "w-8 bg-white" : "w-1.5 bg-white/40"}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;

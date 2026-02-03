"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DetailModal from "@/components/DetailModal";

interface CarouselProps {
    photos: { id: number; file_name: string; title?: string; description?: string }[];
}

const Carousel = ({ photos }: CarouselProps) => {
    const [current, setCurrent] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (photos.length === 0 || isHovered || showModal) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % photos.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [photos, isHovered, showModal]);

    if (photos.length === 0) return null;

    const currentPhoto = photos[current];

    return (
        <>
            <div
                className="relative h-full w-full rounded-[16px] overflow-hidden shadow-lg bg-white border border-black/10 group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setShowModal(true)}
            >
                {photos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <img
                            src={`/assets/uploads/carousel/${photo.file_name}`}
                            alt={photo.title || "Carousel Image"}
                            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                        />
                        {(photo.title || photo.description) && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-10 text-white">
                                {photo.title && <h2 className="text-3xl font-black mb-2 animate-in slide-in-from-bottom-4 duration-700">{photo.title}</h2>}
                                {photo.description && <p className="text-white/80 text-lg line-clamp-2 max-w-2xl animate-in slide-in-from-bottom-2 duration-700 delay-100">{photo.description}</p>}
                                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-white/30 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20 transition-all">
                                        <i className="fas fa-eye"></i> View Details
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrent((prev) => (prev - 1 + photos.length) % photos.length);
                    }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-all z-20 hover:scale-110 active:scale-95"
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrent((prev) => (prev + 1) % photos.length);
                    }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-all z-20 hover:scale-110 active:scale-95"
                >
                    <i className="fas fa-chevron-right"></i>
                </button>

                { }
                <div className="absolute bottom-6 right-10 flex gap-2 z-20" onClick={(e) => e.stopPropagation()}>
                    {photos.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${i === current ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"}`}
                            onClick={() => setCurrent(i)}
                        />
                    ))}
                </div>
            </div>

            <DetailModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={currentPhoto.title || "Image Details"}
                content={currentPhoto.description || ""}
                image={`/assets/uploads/carousel/${currentPhoto.file_name}`}
                type="Carousel Gallery"
            />
        </>
    );
};

export default Carousel;

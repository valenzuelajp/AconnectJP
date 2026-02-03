"use client";

import { useState } from "react";
import Image from "next/image";
import DetailModal from "@/components/DetailModal";

interface Post {
    id: number;
    title: string | null;
    content: string | null;
    image: string | null;
    created_at: Date;
}

interface PostSectionProps {
    type: string;
    posts: Post[];
}

const PostSection = ({ type, posts }: PostSectionProps) => {
    const [idx, setIdx] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [showModal, setShowModal] = useState(false);

    if (posts.length === 0) return null;

    const current = posts[idx];

    const nextPost = (e?: React.MouseEvent) => {
        e?.stopPropagation(); // Prevent modal opening when clicking "Next"
        setAnimating(true);
        setTimeout(() => {
            setIdx((prev) => (prev + 1) % posts.length);
            setAnimating(false);
        }, 300);
    };

    return (
        <>
            <section
                className="flex-1 bg-white rounded-[12px] p-0 flex flex-col justify-between shadow-md border-l-[6px] border-primary overflow-hidden transition-all duration-300 hover:shadow-lg min-h-0 cursor-pointer group"
                onClick={() => setShowModal(true)}
            >
                <div className="w-full h-[220px] overflow-hidden bg-[#1a1a1a] flex items-center justify-center border-b border-black/10 relative">
                    {current.image ? (
                        <img
                            src={`/assets/uploads/post/${current.image}`}
                            alt={current.title || ""}
                            className="max-w-full max-h-full object-contain block z-10 transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f0f0f0] to-[#e8e8e8] text-[#6B7280]">
                            <i className="fas fa-image text-[32px] text-black/10"></i>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-20 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0">
                            <span className="text-xs font-bold text-[#8B1538] uppercase tracking-widest">Read More</span>
                        </div>
                    </div>
                </div>

                <div className="p-[15px_20px] flex flex-col justify-between flex-1">
                    <div>
                        <div className="flex justify-between items-center">
                            <span className="text-[0.75rem] uppercase tracking-[1.2px] font-extrabold text-white bg-gradient-to-br from-primary to-maroon-dark px-[10px] py-[4px] rounded-[6px]">
                                {type}
                            </span>
                            <span className="text-[#6B7280] text-[10px] font-bold">
                                {new Date(current.created_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                })}
                            </span>
                        </div>

                        <div className={`transition-opacity duration-300 ${animating ? "opacity-0" : "opacity-100"}`}>
                            <h4 className="text-[1.15rem] font-bold text-[#1F2937] mt-[8px] line-clamp-2 leading-[1.3] group-hover:text-[#8B1538] transition-colors">
                                {current.title || "No Recent Updates"}
                            </h4>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <button className="text-[0.8rem] font-bold text-[#6B7280] uppercase tracking-[0.8px] hover:text-primary transition-colors duration-300 flex items-center gap-1 group-hover:text-[#8B1538]">
                            DETAILS <i className="fas fa-external-link-alt text-[0.7rem]"></i>
                        </button>

                        {posts.length > 1 && (
                            <button
                                onClick={nextPost}
                                className="bg-gradient-to-br from-primary to-maroon-dark text-white px-[16px] py-[6px] rounded-[8px] text-[0.8rem] font-bold hover:-translate-y-[1px] hover:shadow-md transition-all duration-300 flex items-center gap-1 z-30 relative"
                            >
                                NEXT <i className="fas fa-chevron-right text-[0.7rem]"></i>
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <DetailModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={current.title || "Post Details"}
                content={current.content || ""}
                image={current.image ? `/assets/uploads/post/${current.image}` : undefined}
                date={current.created_at}
                type={type}
            />
        </>
    );
};

export default PostSection;

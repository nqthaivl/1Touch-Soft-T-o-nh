import React from 'react';
import { ImageResultCard } from './ImageResultCard';
import type { GeneratedImage } from '../types';

interface ResultsPanelProps {
  images: GeneratedImage[];
  onBackToEditor: () => void;
}

const BackIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ images, onBackToEditor }) => {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="relative flex items-center justify-center mb-8 h-10">
                <div className="absolute left-0">
                    <button onClick={onBackToEditor} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <BackIcon />
                        <span className="font-semibold text-lg">Quay Lại Chỉnh Sửa</span>
                    </button>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                    Kết Quả - Ảnh Yếm Đỏ - Nét Việt
                </h1>
            </header>
            <main>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {images.map(image => (
                    <ImageResultCard
                    key={image.id}
                    imageUrl={image.imageUrl}
                    title={image.title}
                    description={image.description}
                    />
                ))}
                </div>
            </main>
        </div>
    </div>
  );
};

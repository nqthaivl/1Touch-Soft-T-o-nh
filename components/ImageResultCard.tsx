import React from 'react';

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const RegenerateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
    </svg>
);

interface ImageResultCardProps {
  imageUrl: string;
  title: string;
  description?: string;
}

export const ImageResultCard: React.FC<ImageResultCardProps> = ({ imageUrl, title, description }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#1C1C1C] rounded-lg overflow-hidden border border-gray-700/50 flex flex-col shadow-lg">
      <div className="relative group">
        <img src={imageUrl} alt={title} className="w-full h-auto object-cover aspect-[3/4]" />
        <button 
            onClick={handleDownload}
            className="absolute top-3 right-3 bg-black/60 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-black/80 transition-all duration-200 flex items-center gap-2 opacity-0 group-hover:opacity-100"
            aria-label="Download image"
        >
            <DownloadIcon />
            Tải xuống
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-white text-lg">{title}</h3>
        {description && <p className="text-gray-400 text-sm mt-1 mb-4 flex-grow">{description}</p>}
        <input 
            type="text"
            placeholder="Thêm chi tiết (vd: có nụ cười)..."
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-3"
            aria-label="Add details for regeneration"
        />
        <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-2">
            <RegenerateIcon />
            Tạo Lại
        </button>
      </div>
    </div>
  );
};

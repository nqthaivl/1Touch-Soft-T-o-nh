import React, { useRef, useState, useCallback, useEffect } from 'react';

interface ImagePanelProps {
  originalImage: File | null;
  setOriginalImage: (file: File | null) => void;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  onReset: () => void;
  numberOfImages: number;
  setNumberOfImages: (count: number) => void;
}

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg z-10">
        <svg className="animate-spin h-12 w-12 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-white mt-4 text-lg">Đang kiến tạo nghệ thuật...</p>
        <p className="text-gray-400 text-sm">Quá trình này có thể mất một vài phút.</p>
    </div>
);


export const ImagePanel: React.FC<ImagePanelProps> = ({ originalImage, setOriginalImage, isLoading, error, onGenerate, onReset, numberOfImages, setNumberOfImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (originalImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImageUrl(reader.result as string);
      };
      reader.readAsDataURL(originalImage);
    } else {
      setOriginalImageUrl(null);
    }
  }, [originalImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOriginalImage(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        setOriginalImage(file);
    }
  }, [setOriginalImage]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const triggerFileSelect = () => fileInputRef.current?.click();
  
  const handleLocalReset = () => {
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onReset();
  }

  return (
    <div className="w-full lg:w-1/2 flex-shrink-0 p-6 md:p-10 flex flex-col bg-[#121212]">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white">1Touch Soft Tạo Ảnh</h1>
        <p className="text-gray-400 mt-2">Đây là ứng dụng sử dụng Google Studio để tạo ra những bức ảnh xinh lung linh, các bạn có thể xem thêm nhiều app tại https:///aff.1touch.pro.</p>
      </div>

      <div className="flex-grow flex flex-col">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Bước 1: Tải Ảnh Gốc</h2>
        <div 
            className="relative flex-grow bg-black rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center p-2"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
          {isLoading && <LoadingSpinner />}
          {originalImageUrl ? (
            <img src={originalImageUrl} alt="Original preview" className="max-h-full max-w-full object-contain rounded-md" />
          ) : (
            <div className="text-center cursor-pointer" onClick={triggerFileSelect}>
                <UploadIcon />
                <p className="text-gray-400">Kéo & thả ảnh hoặc <span className="text-amber-500 font-semibold">nhấn để tải lên</span></p>
                <p className="text-xs text-gray-600 mt-1">PNG, JPG, WEBP</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
      </div>
      
      {error && <div className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}

      <div className="mt-auto pt-6">
        <div className="mb-4">
            <label id="image-count-label" className="block text-base font-semibold text-gray-300 mb-3">Số lượng ảnh muốn tạo</label>
            <div className="flex gap-3" role="group" aria-labelledby="image-count-label">
                {[1, 4, 8].map((count) => (
                <button
                    key={count}
                    onClick={() => setNumberOfImages(count)}
                    disabled={isLoading}
                    className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    numberOfImages === count
                        ? 'bg-amber-500 text-black'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                    aria-pressed={numberOfImages === count}
                >
                    {count} ảnh
                </button>
                ))}
            </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
            {originalImage && <button
            onClick={handleLocalReset}
            className="w-full sm:w-auto text-center px-6 py-3 rounded-lg text-lg font-semibold bg-gray-700 hover:bg-gray-600 transition-colors"
            >
            Bắt đầu lại
            </button>}
            <button
            onClick={onGenerate}
            disabled={!originalImage || isLoading}
            className="flex-grow flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-lg font-bold bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Chọn Kiểu Dáng
            </button>
        </div>
        </div>
    </div>
  );
};
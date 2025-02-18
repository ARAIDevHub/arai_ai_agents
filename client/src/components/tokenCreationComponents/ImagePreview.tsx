import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ImagePreviewProps {
  agentImage: string | null;
  formDataImage: File | string | null;
  selectedImage: 'agent' | 'uploaded' | null;
  handleImageSelect: (url: string) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  agentImage,
  formDataImage,
  selectedImage,
  handleImageSelect,
  handleImageUpload
}) => {
  return (
    <div className="flex gap-4 justify-center">
      {agentImage && (
        <div
          className={`w-32 h-32 border-2 border-dashed border-orange-500/30 rounded-lg 
                      flex items-center justify-center mb-4 relative cursor-pointer`}
          onClick={() => handleImageSelect(agentImage)}
        >
          <img
            alt="Agent image Preview"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            src={agentImage}
          />
          {selectedImage === 'agent' && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
      )}

      <div
        className="w-32 h-32 border-2 border-dashed border-orange-500/30 rounded-lg 
                   flex items-center justify-center mb-4 relative cursor-pointer"
        onClick={() => document.getElementById('image-upload')?.click()}
      >
        {formDataImage instanceof File && (
          <img
            id="image-preview"
            alt="Token image Preview"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            src={URL.createObjectURL(formDataImage)}
            style={{ display: 'block' }}
          />
        )}
        {selectedImage === 'uploaded' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        )}
        <span className="text-4xl text-orange-400">+</span>
      </div>
      <input
        id="image-upload"
        type="file"
        className="hidden"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default ImagePreview; 
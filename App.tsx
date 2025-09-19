import React, { useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { ImagePanel } from './components/ImagePanel';
import { OptionsPanel } from './components/OptionsPanel';
import { ResultsPanel } from './components/ResultsPanel';
import type { SelectedOptionsState, GeneratedImage, Option } from './types';
import { SECTIONS_CONFIG } from './constants';

// Helper to get initial state from config
const getInitialState = (): SelectedOptionsState => {
  const initialState: SelectedOptionsState = {};
  SECTIONS_CONFIG.forEach(section => {
    section.groups.forEach(group => {
      if (group.allowMultiple) {
        initialState[group.id] = [];
      } else {
        const defaultOption = group.options.find(opt => opt.default);
        initialState[group.id] = defaultOption ? defaultOption.id : null;
      }
    });
  });
  return initialState;
};

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const App: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsState>(getInitialState());
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [numberOfImages, setNumberOfImages] = useState<number>(4);
  const [view, setView] = useState<'editor' | 'results'>('editor');

  const handleSelection = (groupId: string, optionId: string, isMultiple: boolean) => {
    setSelectedOptions(prev => {
      const currentSelection = prev[groupId];
      if (isMultiple) {
        const newSelection = Array.isArray(currentSelection) ? [...currentSelection] : [];
        const index = newSelection.indexOf(optionId);
        if (index > -1) {
          newSelection.splice(index, 1);
        } else {
          newSelection.push(optionId);
        }
        return { ...prev, [groupId]: newSelection };
      } else {
        return { ...prev, [groupId]: optionId };
      }
    });
  };

  const handleSelectAll = (groupId: string, optionIds: string[]) => {
    setSelectedOptions(prev => ({ ...prev, [groupId]: optionIds }));
  };

  const handleDeselectAll = (groupId: string) => {
    setSelectedOptions(prev => ({ ...prev, [groupId]: [] }));
  };
  
  const handleGenerate = async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }
    if (!process.env.API_KEY) {
      setError("API Key is not configured. Please set the API_KEY environment variable.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64ImageData = await fileToBase64(originalImage);

      const findOption = (groupId: string, optionId: string | null): Option | null => {
          if (!optionId) return null;
          for (const section of SECTIONS_CONFIG) {
              for (const group of section.groups) {
                  if (group.id === groupId) {
                      return group.options.find(opt => opt.id === optionId) || null;
                  }
              }
          }
          return null;
      };

      const findPoseOption = (poseId: string): Option | null => {
        for (const section of SECTIONS_CONFIG) {
           for (const group of section.groups) {
               if (group.id === 'posesWithProps' || group.id === 'bodyPoses') {
                   const option = group.options.find(opt => opt.id === poseId);
                   if (option) return option;
               }
           }
       }
       return null;
      }

      let basePrompt = "Create a photorealistic, artistic image of a young Vietnamese woman. ";
      const lightingOption = findOption('lighting', selectedOptions.lighting as string);
      if (lightingOption) basePrompt += `The lighting and color style is '${lightingOption.title}'. Description: ${lightingOption.description}. `;
      const layoutOption = findOption('layout', selectedOptions.layout as string);
      if (layoutOption) basePrompt += `The composition is a ${layoutOption.title.toLowerCase()} shot. `;
      const costumeOption = findOption('costume', selectedOptions.costume as string);
      if (costumeOption && costumeOption.id !== 'originalCostume') basePrompt += `She is wearing '${costumeOption.title}'. `;
      const backgroundOption = findOption('background', selectedOptions.background as string);
      if (backgroundOption && backgroundOption.id !== 'originalBackground') basePrompt += `The background is '${backgroundOption.title}'. `;
      const emotionOption = findOption('emotion', selectedOptions.emotion as string);
      if (emotionOption && emotionOption.id !== 'originalEmotion') basePrompt += `Her expression is '${emotionOption.title}'. `;


      const selectedPoseIds: string[] = [
        ...(Array.isArray(selectedOptions.posesWithProps) ? selectedOptions.posesWithProps : []),
        ...(Array.isArray(selectedOptions.bodyPoses) ? selectedOptions.bodyPoses : []),
      ];
      
      if (selectedPoseIds.length === 0) {
        setError("Please select at least one pose (Kiểu Dáng) to generate images.");
        setIsLoading(false);
        return;
      }

      const generationQueue: string[] = [];
      
      for (let i = 0; i < numberOfImages; i++) {
        generationQueue.push(selectedPoseIds[i % selectedPoseIds.length]);
      }
      
      const generationPromises = generationQueue.map((poseId, index) => {
        const poseOption = findPoseOption(poseId);
        if (!poseOption) return Promise.resolve(null);

        const finalPrompt = basePrompt + `She is in the pose: '${poseOption.title}' (${poseOption.description}). The final image should be beautiful, elegant, and of high artistic quality, retaining the original person's facial features.`;
        
        return ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [ { inlineData: { data: base64ImageData, mimeType: originalImage.type } }, { text: finalPrompt } ] },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        }).then(response => ({ response, pose: poseOption, uniqueId: `${poseId}-${index}` }))
        .catch(err => {
            console.error(`Error generating image for pose ${poseId}:`, err);
            return null; // Don't let one failure stop all generations
        });
      });

      const results = await Promise.all(generationPromises);
      const successfulImages: GeneratedImage[] = [];

      for (const result of results) {
          if (result) {
              const { response, pose, uniqueId } = result;
              for (const part of response.candidates[0].content.parts) {
                  if (part.inlineData) {
                      successfulImages.push({
                          id: uniqueId,
                          title: pose.title,
                          description: pose.description,
                          imageUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                      });
                      break; // Found image for this pose
                  }
              }
          }
      }

      if (successfulImages.length === 0) {
        setError("The AI did not return any images. Please try a different combination of options.");
      } else {
        setGeneratedImages(successfulImages);
        setView('results');
      }

    } catch (e) {
      console.error(e);
      setError("An error occurred while generating the image. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImages(null);
    setError(null);
    setIsLoading(false);
    setSelectedOptions(getInitialState());
    setNumberOfImages(4);
    setView('editor');
  }

  const handleBackToEditor = () => {
    setView('editor');
  };

  if (view === 'results' && generatedImages) {
    return <ResultsPanel images={generatedImages} onBackToEditor={handleBackToEditor} />;
  }

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col lg:flex-row font-sans">
      <ImagePanel 
        originalImage={originalImage} 
        setOriginalImage={setOriginalImage}
        isLoading={isLoading}
        error={error}
        onGenerate={handleGenerate}
        numberOfImages={numberOfImages}
        setNumberOfImages={setNumberOfImages}
        onReset={handleReset}
      />
      <OptionsPanel 
        selectedOptions={selectedOptions}
        onSelect={handleSelection}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />
    </div>
  );
};

export default App;
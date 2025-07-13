// src/Service/ImageService.tsx
import axios from 'axios';

const aiUrl = 'https://biologieseducationapp.onrender.com/api/Predict/upload';

const ImageService = {
  uploadImage: async (imageUri: string) => {
    const formData = new FormData();

    formData.append('image', {
      uri: imageUri,
      name: 'plant.jpg',
      type: 'image/jpeg',
    } as any); 

    try {
      const response = await axios.post(aiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Upload error:', error.message || error);
      throw error;
    }
  },
};

export default ImageService;

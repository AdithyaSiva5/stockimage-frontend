import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../axios/axios';

// Define an interface for the image object
interface Image {
  _id: string;
  imageUrl: string;
}

const ImageGallery: React.FC = () => {
  // Set the state type to be an array of Image
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axiosInstance.get(`/profile/images?userId=your-user-id`);
        setImages(response.data.images); // Assuming response.data.images is an array of Image objects
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  if (images.length === 0) {
    return <p>No images uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image._id} className="border p-2">
          <img src={image.imageUrl} alt="Uploaded" className="w-full" />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;

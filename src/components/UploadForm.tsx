// components/UploadForm.tsx
import React, { useCallback } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import axios from 'axios';
import axiosInstance from '../axios/axios';

const UploadForm = () => {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const formData = new FormData();
    formData.append('image', acceptedFiles[0]);

    formData.append('userId', 'your-user-id');

    axiosInstance.post(`/profile/upload-images`, formData)
      .then((response) => {
        console.log('Image uploaded:', response.data);
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="border-dashed border-2 p-4">
      <input {...getInputProps()} />
      <p>Drag & drop your images here, or click to select files</p>
    </div>
  );
};

export default UploadForm;

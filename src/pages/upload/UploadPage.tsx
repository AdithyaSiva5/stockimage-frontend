import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import axiosInstance from '../../axios/axios';

interface FileItem {
  id: string;
  file: File;
  preview: string;
  title: string;
}

const UploadPage: React.FC = () => {
  const [fileItems, setFileItems] = useState<FileItem[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFileItems = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      title: file.name
    }));
    setFileItems(prevItems => [...prevItems, ...newFileItems]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (id: string) => {
    setFileItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateFileTitle = (id: string, title: string) => {
    setFileItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, title } : item
    ));
  };

  const uploadFiles = async () => {
    const formData = new FormData();

    fileItems.forEach((item, index) => {
      formData.append(`images`, item.file);
      formData.append(`titles[${index}]`, item.title);
    });

    try {
      const response = await axiosInstance.post('/upload-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Upload successful', response.data);
      setFileItems([]);
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Upload Images</h1>
      <Card>
        <CardContent>
          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">Drag 'n' drop some files here, or click to select files</p>
          </div>
        </CardContent>
      </Card>

      {fileItems.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Selected Files:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fileItems.map((item) => (
              <div key={item.id} className="relative">
                <img src={item.preview} alt={item.title} className="w-full h-32 object-cover rounded-lg" />
                <input
                  type="text"
                  placeholder="Enter image title"
                  value={item.title}
                  onChange={(e) => updateFileTitle(item.id, e.target.value)}
                  className="mt-2 w-full p-2 border rounded"
                />
                <button onClick={() => removeFile(item.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <Button onClick={uploadFiles} className="mt-4">
            Upload Files
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
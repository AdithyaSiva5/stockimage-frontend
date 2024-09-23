import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import axiosInstance from '../../axios/axios';

interface FileWithPreview extends File {
  preview: string;
  title: string;
}

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      title: ''
    })));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (file: FileWithPreview) => {
    const newFiles = files.filter(f => f !== file);
    setFiles(newFiles);
  };

  const updateFileTitle = (file: FileWithPreview, title: string) => {
    const newFiles = files.map(f => {
      if (f === file) {
        return { ...f, title };
      }
      return f;
    });
    setFiles(newFiles);
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images`, file);
      formData.append(`titles[${index}]`, file.title);
    });

    try {
      const response = await axiosInstance.post('/upload-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Upload successful', response.data);
      setFiles([]);
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

      {files.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Selected Files:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div key={file.name} className="relative">
                <img src={file.preview} alt={file.name} className="w-full h-32 object-cover rounded-lg" />
                <input
                  type="text"
                  placeholder="Enter image title"
                  value={file.title}
                  onChange={(e) => updateFileTitle(file, e.target.value)}
                  className="mt-2"
                />
                <button onClick={() => removeFile(file)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
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
// Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import Header from '../../components/header/Header';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logged out from Home component');
  };

  return (
    <div className="container mx-auto p-4">
      <Header onLogout={handleLogout} />
      <h1 className="text-3xl font-bold mb-6">Welcome to Image Uploader</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Upload Images</CardTitle>
            <CardDescription>Drag and drop or select files to upload</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/upload')} className="w-full">
              Go to Upload Page
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>View Your Images</CardTitle>
            <CardDescription>Browse and manage your uploaded images</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/gallery')} className="w-full">
              View Gallery
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axiosInstance from '../../axios/axios';
import { Button } from '../../components/ui/button';
import { Edit2, Trash2, X } from 'lucide-react';

interface Image {
  _id: string;
  title: string;
  imageUrl: string;
  order: number;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [error, setError] = useState<string | null>(null);  // Error state for validation
  const [previewImage, setPreviewImage] = useState<Image | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response: any = await axiosInstance.get<Image[]>('/gallery');
      const sortedImages = response.data.images.sort((a: any, b: any) => a.order - b.order);
      setImages(sortedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const [movedItem] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedItem);

    const updatedImages = reorderedImages.map((item, index) => ({ ...item, order: index + 1 }));
    setImages(updatedImages);

    try {
      await axiosInstance.post('/gallery/reorder', {
        imageIds: updatedImages.map(img => ({ id: img._id, order: img.order }))
      });
    } catch (error) {
      console.error('Error saving new order:', error);
      fetchImages();
    }
  };

  const handleEdit = (image: Image) => {
    setEditingId(image._id);
    setEditTitle(image.title);
    setError(null);  
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    if (editTitle.trim() === '') {
      setError('Title cannot be empty'); 
      return;
    }

    try {
      await axiosInstance.put(`/gallery/${editingId}`, { title: editTitle });
      setImages(images.map(img => img._id === editingId ? { ...img, title: editTitle } : img));
      setEditingId(null);
      setError(null);  
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/gallery/${id}`);
      setImages(images.filter(img => img._id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleImageClick = (image: Image) => {
    setPreviewImage(image);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Image Gallery</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {images.map((image, index) => (
                <Draggable key={image._id} draggableId={image._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative bg-white p-4 rounded-lg shadow"
                    >
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="w-full h-48 object-cover rounded-lg mb-2 cursor-pointer"
                        onClick={() => handleImageClick(image)}
                      />
                      {editingId === image._id ? (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full p-2 border rounded mb-2"
                          />
                          {error && <p className="text-red-500 mb-2">{error}</p>} {/* Show error if any */}
                          <Button onClick={handleSaveEdit} className="w-full">
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-lg font-semibold">{image.title}</span>
                          <div>
                            <Button onClick={() => handleEdit(image)} className="mr-2 p-2" variant="outline">
                              <Edit2 size={16} />
                            </Button>
                            <Button onClick={() => handleDelete(image._id)} variant="outline" className="p-2">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{previewImage.title}</h2>
              <Button onClick={closePreview} variant="ghost">
                <X size={24} />
              </Button>
            </div>
            <img src={previewImage.imageUrl} alt={previewImage.title} className="max-w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

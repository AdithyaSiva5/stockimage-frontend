import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { pdfjs, Document, Page } from 'react-pdf';
import axios from '../axios/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios/axios';

const { PDFDocument } = require('pdf-lib');
interface EditModalProps {
  show: boolean;
  onHide: () => void;
  file: { filePath: string };
  pageNumber: number;
  fileId: string;
  fileLocation:string
}
 const EditModal: React.FC<EditModalProps> = ({
  show,
  onHide,
  file,
  pageNumber,
  fileLocation,
  fileId,
}) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null); 
  const [pdfError, setPdfError] = useState<string>(''); // Error message
  const [selectedPage, setSelectedPage] = useState<number | null>(null); // Selected page
  const [numPages, setNumPages] = useState<number | null>(null); // Number of pages
  const [pages, setPages] = useState<number[]>([]); // Pages array
  const [titles, setTitles] = useState<string>(''); 
  const navigate=useNavigate()


  useEffect(() => {
    if (pdfFile) {
      // Reset selected page and number of pages when file changes
      setSelectedPage(null);
      setNumPages(null);
      setPages([]);
      setTitles('');
    }
  }, [pdfFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.type === 'application/pdf') {
      setPdfFile(selectedFile);
      setPdfError(''); // Clear any previous error messages
    } else {
      setPdfFile(null);
      setPdfError('Please select a valid PDF file');
    }
  };

  const onDocumentLoadSuccess = (info: { numPages: number }) => {
    setNumPages(info.numPages);
    setPages(Array.from({ length: info.numPages }, (_, i) => i + 1));
  };

  const handlePageSelection = (page: number) => {
    setSelectedPage(page);
  };

  const handleTitleChange = (page: number, title: string) => {
    if (selectedPage === page) {
      setTitles(title);
    }
  };

  const handleSaveChanges = async () => {
    if (!pdfFile || selectedPage === null) {
      alert('Please select a file and a page.');
      return;
    }

    try {
      const newFile = await modifyPdf(file.filePath, pdfFile, selectedPage);
      if (!newFile) {
        alert('Error occurred during PDF modification');
        return;
      }

      const formData = new FormData();
      formData.append('file', newFile);
      formData.append('fileId', fileId);
      formData.append('titles', titles);
      formData.append('pageNumber', pageNumber.toString());

      await axiosInstance.post('/upload/updateFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire('Success', 'File updated successfully', 'success');

      onHide();

    } catch (error) {
      console.error('Error uploading file:', error);
      Swal.fire('Error', 'Failed to upload file', 'error');
    }
  };


  

const modifyPdf = async (oldFilePath:string, newFilePath:File, selectedPageNumber:number) => {

  const oldPdfResponse = await fetch(oldFilePath);
  const oldPdfArrayBuffer = await oldPdfResponse.arrayBuffer();
  const pdfOld = await PDFDocument.load(oldPdfArrayBuffer);
  
  // Read the new PDF file from the File object (convert it to an ArrayBuffer first)
  const arrayBuffer = await newFilePath.arrayBuffer();
  const pdfNew = await PDFDocument.load(arrayBuffer); 

  const [pageToInsert] = await pdfOld.copyPages(pdfNew, [selectedPageNumber - 1]);
  pdfOld.insertPage(pageNumber, pageToInsert);
  pdfOld.removePage(pageNumber-1);

  const pdfBytes = await pdfOld.save();  
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const newFile = new File([blob], pdfOld.name);
  return newFile;
};

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit PDF and Select Pages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input 
          type="file"
          className="form-control file-input"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {pdfError && <p className="text-danger">{pdfError}</p>}
        {pdfFile && (
          <div>
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {pages.map((page) => (
                <div key={page}>
                  <label>
                    <input
                      type="radio"
                      name="pageSelect"
                      checked={selectedPage === page}
                      onChange={() => handlePageSelection(page)}
                    />
                    Page {page}
                  </label>
                  <Page
                    pageNumber={page}
                    width={300}
                    onLoadError={(error) => console.error('Page Load Error:', error)}
                  />
                  {selectedPage === page && (
                    <input
                      type="text"
                      placeholder="Title for this page"
                      value={titles || ''}
                      onChange={(e) => handleTitleChange(page, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </Document>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;

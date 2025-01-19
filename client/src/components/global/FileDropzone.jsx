import { AnimatePresence, motion } from 'framer-motion';
import { File, Trash2, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';

export function FileDropzone({
  onFilesSelected,
  fileUploadTextStyles = 'mt-2 font-medium text-neutral-400 text-sm tracking-tighter dark:text-neutral-500',
  fileUploadText = 'Drag and drop files here, or click to select',
  fileUploadContainerSize = 'w-full h-full p-6',
  fileUploadSVG = <Upload className="w-6 h-6" />,
}) {
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Handle drag enter event
  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  // Handle drag leave event
  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  // Handle drag over event
  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drop event
  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  // Process and update files
  const handleFiles = fileList => {
    const newFiles = fileList.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles, ...newFiles].slice(0, 5); // Limit to 5 files
      if (onFilesSelected) {
        onFilesSelected(updatedFiles);
      }
      return updatedFiles;
    });
  };

  // Handle button click to open file input
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change event
  const handleFileInputChange = e => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // Handle delete file event
  const handleDeleteFile = fileToDelete => {
    setFiles(prevFiles => {
      const filteredFiles = prevFiles.filter(file => file !== fileToDelete);
      if (onFilesSelected) {
        onFilesSelected(filteredFiles);
      }
      URL.revokeObjectURL(fileToDelete.preview);
      return filteredFiles;
    });
  };

  return (
    <div className={`${fileUploadContainerSize}`}>
      <motion.div
        className={`relative h-full cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/5'
            : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500'
        }`}
        onClick={handleButtonClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          accept="image/*"
          className="hidden"
          multiple
          onChange={handleFileInputChange}
          ref={fileInputRef}
          type="file"
        />
        <AnimatePresence>
          {isDragActive ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none select-none"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="pointer-events-none mx-auto w-8 h-8 select-none text-blue-500" />
              <p className="pointer-events-none mt-2 select-none text-blue-500 text-sm">
                Drop files here...
              </p>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {fileUploadSVG ? (
                <div className="mx-auto w-8 h-8">{fileUploadSVG}</div>
              ) : (
                <div className="mx-auto w-8 h-8">
                  <Upload className="mx-auto w-8 h-8 text-neutral-400 dark:text-neutral-500" />{' '}
                </div>
              )}
              <p
                className={`mt-2 font-medium text-sm text-neutral-600 tracking-tighter ${fileUploadTextStyles}`}
              >
                {fileUploadText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 space-y-2"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            {files.map(file => (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center rounded-lg bg-neutral-400/10 p-1"
                exit={{ opacity: 0, x: 20 }}
                initial={{ opacity: 0, x: -20 }}
                key={file.name}
              >
                {file.type.startsWith('image/') ? (
                  <img
                    alt={file.name}
                    className="mr-2 w-16 h-16 rounded object-cover"
                    src={file.preview}
                  />
                ) : (
                  <File className="mr-2 w-10 h-10 text-neutral-500" />
                )}
                <span className="flex-1 truncate text-neutral-600 text-xs tracking-tighter dark:text-neutral-400">
                  {file.name.slice(0, 40)}
                </span>
                <Trash2
                  className="mr-2 w-5 h-5 cursor-pointer text-red-500 transition-colors hover:text-red-600"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteFile(file);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FileDropzone;

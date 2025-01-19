import React from 'react';

const FileInputButton = ({
  fileInputRef,
  onFileInputClick,
  onFileChange,
  isUploading,
  acceptFileType,
  multiple,
}) => {
  return (
    <>
      <input
        type="file"
        ref={fileInputRef} // Attach the ref here
        accept={acceptFileType}
        className="hidden"
        onChange={onFileChange}
        multiple={multiple} // Add multiple attribute if needed
      />
      <button
        onClick={onFileInputClick}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        disabled={isUploading}
      >
        <span>Choose File</span>{' '}
        {/* You can make the label dynamic based on file type */}
      </button>
    </>
  );
};

export default FileInputButton;

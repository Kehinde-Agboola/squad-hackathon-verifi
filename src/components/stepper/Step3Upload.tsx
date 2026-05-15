import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, X, CheckCircle, File } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
}

interface Step3UploadProps {
  uploadedFiles: UploadedFile[];
  onFilesAdded: (files: File[]) => void;
  onFileRemove: (fileId: string) => void;
  onContinue: () => void;
}

export const Step3Upload: React.FC<Step3UploadProps> = ({
  uploadedFiles,
  onFilesAdded,
  onFileRemove,
  onContinue,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxSize: 10 * 1024 * 1024,
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink mb-2">Upload Documents</h2>
        <p className="text-muted">Drag and drop your documents or click to browse</p>
      </div>

      <div
        {...getRootProps()}
        className={`p-12 border-2 border-dashed rounded-lg text-center transition-all cursor-pointer ${
          isDragActive
            ? 'border-primary bg-primary-light'
            : 'border-border bg-gray-50 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <Cloud size={40} className="mx-auto text-primary mb-4" />
        <p className="text-ink font-medium mb-1">Click to upload or drag files here</p>
        <p className="text-sm text-muted">PDF, PNG, JPG · Max 10MB</p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-ink">Uploaded files ({uploadedFiles.length})</p>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-4 bg-surface border border-border rounded-lg"
            >
              <File size={20} className="text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{file.name}</p>
                <p className="text-xs text-muted">{formatFileSize(file.size)}</p>
                {file.progress < 100 && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-primary h-1 rounded-full transition-all"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>
              {file.progress === 100 && <CheckCircle size={20} className="text-primary flex-shrink-0" />}
              <button
                onClick={() => onFileRemove(file.id)}
                className="text-danger hover:bg-red-50 p-2 rounded"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="ghost" onClick={() => window.history.back()}>
          Back
        </Button>
        <Button
          onClick={onContinue}
          disabled={uploadedFiles.length === 0 || uploadedFiles.some((f) => f.progress < 100)}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

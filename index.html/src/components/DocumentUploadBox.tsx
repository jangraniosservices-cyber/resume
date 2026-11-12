import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  FileText, 
  Image as ImageIcon,
  Lock,
  RefreshCw
} from 'lucide-react';
import { DocumentUpload } from '../types/index.ts';

interface DocumentUploadBoxProps {
  boxNumber: number;
  title: string;
  subtitle: string;
  acceptFormats?: string;
  isSecureAadhaar?: boolean;
  value?: DocumentUpload;
  onChange: (doc?: DocumentUpload) => void;
  required?: boolean;
}

export const DocumentUploadBox: React.FC<DocumentUploadBoxProps> = ({
  boxNumber,
  title,
  subtitle,
  acceptFormats = '.jpg,.jpeg,.png,.pdf,.doc,.docx',
  isSecureAadhaar = false,
  value,
  onChange,
  required = true
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB limit

  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    // 1. Validate file size (<= 1MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setErrorMsg(`File size (${sizeMB} MB) exceeds maximum allowed limit of 1.0 MB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 2. Validate file type
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
    const isMimeValid = allowedMimeTypes.includes(file.type);
    const isExtValid = validExtensions.includes(fileExt);

    if (!isMimeValid && !isExtValid) {
      setErrorMsg('Invalid format. Please upload JPG, PNG, PDF, DOC, or DOCX only.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Read as Base64 Data URL
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      const uploadedDoc: DocumentUpload = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || fileExt,
        dataUrl: base64String,
        uploadedAt: new Date().toISOString(),
        status: 'Pending'
      };

      onChange(uploadedDoc);
      setIsProcessing(false);
      setSuccessMsg(`Successfully uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    };

    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMsg('Failed to process file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setErrorMsg(null);
    setSuccessMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReupload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isImage = value?.fileType.startsWith('image') || 
                  value?.fileName.endsWith('.jpg') || 
                  value?.fileName.endsWith('.jpeg') || 
                  value?.fileName.endsWith('.png');

  return (
    <div className={`p-4 sm:p-5 rounded-xl border transition-all ${
      value 
        ? 'border-emerald-300 bg-emerald-50/40' 
        : errorMsg 
        ? 'border-red-300 bg-red-50/30' 
        : 'border-slate-300 bg-white hover:border-blue-400'
    }`}>
      {/* Box Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#0b2545] text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
              {boxNumber}
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              {title} {required && <span className="text-red-500">*</span>}
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-8">
            {subtitle}
          </p>
        </div>

        {isSecureAadhaar && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded shrink-0" title="Protected: Restricted to authorized administrators">
            <Lock className="w-3 h-3 text-blue-700" />
            <span>Restricted Access</span>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelection}
        accept={acceptFormats}
        className="hidden"
      />

      {/* Upload State / Empty State */}
      {!value ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-lg p-5 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-amber-50/20"
        >
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <RefreshCw className="w-7 h-7 text-amber-500 animate-spin" />
              <span className="text-xs font-medium text-slate-600">Processing file...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5">
              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-amber-500" />
              <div className="text-xs font-semibold text-slate-800">
                Click to browse or drag file here
              </div>
              <div className="text-[11px] text-slate-500">
                Max 1.0 MB · JPG, PNG, PDF, DOC, DOCX
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Uploaded State */
        <div className="bg-white rounded-lg p-3.5 border border-emerald-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {value.fileName}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>{(value.fileSize / 1024).toFixed(1)} KB</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" /> Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Re-upload & Remove */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleReupload}
                className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors"
                title="Change or re-upload file"
              >
                Re-upload
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thumbnail preview if image */}
          {isImage && value.dataUrl && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-3">
              <img
                src={value.dataUrl}
                alt={value.fileName}
                referrerPolicy="no-referrer"
                className="w-14 h-14 object-cover rounded-md border border-slate-200"
              />
              <span className="text-[11px] text-slate-500">
                Preview active. Document will be securely archived upon form submission.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {errorMsg && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && !errorMsg && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
};

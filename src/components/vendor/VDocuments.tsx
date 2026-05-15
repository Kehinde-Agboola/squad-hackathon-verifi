import React from 'react';
import { File, Download, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface VDocumentsProps {
  documents: any[];
  onDownload?: (docId: string) => void;
  onDelete?: (docId: string) => void;
}

export const VDocuments: React.FC<VDocumentsProps> = ({
  documents,
  onDownload,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ink">Documents</h2>
        <Button variant="ghost" size="sm">
          Upload new
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-border rounded-lg">
          <AlertCircle size={48} className="mx-auto text-muted mb-4" />
          <p className="text-muted">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc: any) => (
            <div
              key={doc.id}
              className="flex items-center gap-4 p-4 bg-surface border border-border rounded-lg hover:border-primary transition-colors"
            >
              <File size={24} className="text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink truncate">{doc.name}</p>
                <p className="text-xs text-muted">
                  {doc.type} • {doc.size} • {doc.date}
                </p>
              </div>
              <Badge variant={doc.status as any}>
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </Badge>
              <div className="flex gap-2">
                <button
                  onClick={() => onDownload?.(doc.id)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="Download"
                >
                  <Download size={18} className="text-primary" />
                </button>
                <button
                  onClick={() => onDelete?.(doc.id)}
                  className="p-2 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} className="text-danger" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

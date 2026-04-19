'use client';

import React, { useState, useRef } from 'react';
import { useResources, SavedResource } from '@/lib/ResourceContext';
import { Folder, Link as LinkIcon, FileText, ExternalLink, Trash2, Upload, Download, Search, X } from 'lucide-react';
import { format } from 'date-fns';

// Simple Native File Viewer Modal
function LocalFileViewer({ resource, blob, onClose }: { resource: SavedResource, blob: Blob, onClose: () => void }) {
  const [blobUrl, setBlobUrl] = useState(() => URL.createObjectURL(blob));

  // Note: we let the browser handle object URL rendering for basic PDF/image formats.
  const isImage = resource.fileType?.startsWith('image/');
  const isPdf = resource.fileType === 'application/pdf';

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex flex-col pt-10 px-4 pb-4 animate-in fade-in">
      <div className="bg-white rounded-t-2xl w-full max-w-6xl mx-auto flex justify-between items-center p-3 border-b">
        <div className="flex items-center gap-2 px-2 overflow-hidden">
          <FileText size={18} className="text-gray-400 shrink-0" />
          <span className="text-sm font-medium truncate max-w-[200px] md:max-w-md">{resource.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Download link mapped to the blob */}
          <a download={resource.title} href={blobUrl} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors flex items-center gap-1 font-medium text-sm">
            <Download size={16} /> Download
          </a>
          <button onClick={() => {
            URL.revokeObjectURL(blobUrl);
            onClose();
          }} className="p-2 bg-black text-white hover:bg-gray-800 rounded-lg text-sm font-medium px-4 transition-colors">
             Close
          </button>
        </div>
      </div>
      <div className="bg-white w-full max-w-6xl mx-auto flex-1 rounded-b-2xl overflow-hidden shadow-2xl relative flex items-center justify-center p-4">
        {isImage ? (
           // eslint-disable-next-line @next/next/no-img-element
           <img src={blobUrl} alt={resource.title} className="max-w-full max-h-full object-contain" />
        ) : isPdf ? (
           <iframe src={`${blobUrl}#toolbar=0`} className="w-full h-full border-0 absolute inset-0" title={resource.title} />
        ) : (
           <div className="text-center p-8 bg-gray-50 rounded-2xl border">
             <FileText size={48} className="mx-auto text-gray-300 mb-4" />
             <p className="font-semibold text-lg">Preview not available for this file type</p>
             <p className="text-gray-500 mt-2 mb-4">{resource.fileType}</p>
             <a download={resource.title} href={blobUrl} className="bg-black text-white px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2">
                Download to view <Download size={18} />
             </a>
           </div>
        )}
      </div>
    </div>
  );
}

export function ResourcesView() {
  const { resources, saveFile, deleteResource, getFileBlob } = useResources();
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'links' | 'files'>('all');
  
  const [viewingFile, setViewingFile] = useState<{ resource: SavedResource; blob: Blob } | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${mb.toFixed(1)} MB`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Only process one file at a time for UI simplicity, though context could handle multiple
    const file = files[0];
    await saveFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await saveFile(e.dataTransfer.files[0]);
    }
  };

  const openFile = async (resource: SavedResource) => {
    setIsLoadingFile(resource.id);
    const blob = await getFileBlob(resource.id);
    if (blob) {
      setViewingFile({ resource, blob });
    } else {
      alert("Error loading file. It might have been deleted or corrupted.");
    }
    setIsLoadingFile(null);
  };

  const filteredResources = resources.filter(r => {
    if (activeTab === 'links' && r.type !== 'link') return false;
    if (activeTab === 'files' && r.type !== 'file') return false;
    if (filterQuery) {
      const txt = (r.title + ' ' + (r.url || '') + ' ' + (r.snippet || '')).toLowerCase();
      if (!txt.includes(filterQuery.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Resources</h1>
          <p className="text-gray-500 mt-1">Saved websites, notes, PDFs, and uploaded study materials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Upload Zone */}
        <div 
          className="md:col-span-1 bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 hover:border-black transition-colors cursor-pointer group flex flex-col items-center justify-center min-h-[160px]"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="bg-gray-100 p-3 rounded-full text-gray-500 group-hover:bg-black group-hover:text-white transition-colors mb-3">
            <Upload size={24} />
          </div>
          <h3 className="font-semibold text-gray-900">Upload File</h3>
          <p className="text-xs text-gray-500 mt-1 px-4">Drag & drop or click to upload PDFs, Images, or Notes</p>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
          />
        </div>

        {/* List Section */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full min-h-[500px]">
          
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'links', label: 'Saved Links' },
                { id: 'files', label: 'Uploaded Files' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                    activeTab === t.id ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Filter resources..."
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                className="pl-9 pr-8 py-1.5 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-black outline-none bg-white w-full sm:w-auto"
              />
              {filterQuery && (
                <button onClick={() => setFilterQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {filteredResources.length > 0 ? (
               filteredResources.map(resource => (
                 <div key={resource.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm transition-all group items-center">
                    <div className={`p-3 rounded-xl shrink-0 ${resource.type === 'link' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                      {resource.type === 'link' ? <LinkIcon size={24} /> : <FileText size={24} />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate pr-4">{resource.title}</h3>
                      {resource.type === 'link' ? (
                        <p className="text-sm text-blue-500 truncate mt-0.5"><a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{resource.url}</a></p>
                      ) : (
                        <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5 font-mono">
                          <span>{formatSize(resource.size)}</span>
                          <span>•</span>
                          <span className="truncate">{resource.fileType || 'Unknown Type'}</span>
                        </p>
                      )}
                      {resource.snippet && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{resource.snippet}</p>}
                    </div>

                    <div className="flex items-center gap-2 pr-2">
                       {resource.type === 'link' ? (
                         <a href={resource.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-xs hidden sm:flex items-center gap-1.5 ">
                           Open <ExternalLink size={14} />
                         </a>
                       ) : (
                         <button 
                           onClick={() => openFile(resource)}
                           disabled={isLoadingFile === resource.id}
                           className="p-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors font-medium text-xs hidden sm:flex items-center gap-1.5"
                         >
                           {isLoadingFile === resource.id ? 'Loading...' : 'View File'} 
                         </button>
                       )}
                       
                       {/* Mobile explicit actions */}
                       <div className="flex flex-col gap-1 sm:hidden">
                          {resource.type === 'link' ? (
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 p-1">
                              <ExternalLink size={16} />
                            </a>
                          ) : (
                            <button onClick={() => openFile(resource)} className="text-black p-1">
                              <FileText size={16} />
                            </button>
                          )}
                       </div>

                       <button 
                         onClick={() => deleteResource(resource.id, resource.type)}
                         className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                         title="Delete resource"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                 </div>
               ))
             ) : (
               <div className="h-full flex items-center justify-center flex-col text-gray-400 p-8 text-center">
                  <Folder size={48} className="text-gray-200 mb-4" />
                  <p className="font-medium text-gray-600">No resources found</p>
                  <p className="text-sm mt-1">Upload a file or save a link from the quick search.</p>
               </div>
             )}
          </div>

        </div>
      </div>

      {viewingFile && (
        <LocalFileViewer 
          resource={viewingFile.resource} 
          blob={viewingFile.blob} 
          onClose={() => setViewingFile(null)} 
        />
      )}
    </div>
  );
}

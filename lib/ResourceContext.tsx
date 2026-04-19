'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

export interface SavedResource {
  id: string;
  type: 'link' | 'file';
  title: string;
  url?: string;
  fileType?: string;
  size?: number;
  dateAdded: string;
  snippet?: string;
}

interface ResourceContextType {
  resources: SavedResource[];
  saveLink: (linkData: Omit<SavedResource, 'id' | 'type' | 'dateAdded'>) => void;
  saveFile: (file: File) => Promise<void>;
  deleteResource: (id: string, type: 'link' | 'file') => Promise<void>;
  getFileBlob: (id: string) => Promise<Blob | null>;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export function ResourceProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<SavedResource[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    // Initialize localforage
    localforage.config({
      name: 'StudentHub',
      storeName: 'resources'
    });

    const storedResources = localStorage.getItem('studenthub_resources');
    if (storedResources) {
      setResources(JSON.parse(storedResources));
    }
    setIsLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('studenthub_resources', JSON.stringify(resources));
    }
  }, [resources, isLoaded]);

  const saveLink = (linkData: Omit<SavedResource, 'id' | 'type' | 'dateAdded'>) => {
    const newResource: SavedResource = {
      ...linkData,
      id: uuidv4(),
      type: 'link',
      dateAdded: new Date().toISOString()
    };
    setResources(prev => [newResource, ...prev]);
  };

  const saveFile = async (file: File) => {
    const id = uuidv4();
    const newResource: SavedResource = {
      id,
      type: 'file',
      title: file.name,
      fileType: file.type,
      size: file.size,
      dateAdded: new Date().toISOString()
    };
    
    // Save metadata
    setResources(prev => [newResource, ...prev]);
    // Save actual file blob to IndexedDB
    await localforage.setItem(`file_${id}`, file);
  };

  const deleteResource = async (id: string, type: 'link' | 'file') => {
    setResources(prev => prev.filter(r => r.id !== id));
    if (type === 'file') {
      await localforage.removeItem(`file_${id}`);
    }
  };

  const getFileBlob = async (id: string): Promise<Blob | null> => {
    try {
      const blob = await localforage.getItem<Blob>(`file_${id}`);
      return blob;
    } catch {
      return null;
    }
  };

  return (
    <ResourceContext.Provider value={{
      resources,
      saveLink,
      saveFile,
      deleteResource,
      getFileBlob
    }}>
      {children}
    </ResourceContext.Provider>
  );
}

export function useResources() {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
}

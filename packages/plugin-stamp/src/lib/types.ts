import { BasePluginConfig, EventHook } from '@embedpdf/core';
import {
  PdfAnnotationName,
  PdfAnnotationObject,
  PdfDocumentObject,
  PdfTask,
} from '@embedpdf/models';

declare module '@embedpdf/plugin-annotation' {
  interface ToolContextMap {
    rubberStamp: {
      appearance: ArrayBuffer;
      ghostUrl: string;
      stampSize: { width: number; height: number };
      libraryId: string;
      stampName: PdfAnnotationName;
      subject: string;
    };
  }
}

export interface StampDefinition {
  pageIndex: number;
  name: PdfAnnotationName;
  subject: string;
  label?: string;
  categories?: string[];
}

export interface StampLibraryConfig {
  name: string;
  pdf: string | ArrayBuffer;
  stamps: StampDefinition[];
  categories?: string[];
  readonly?: boolean;
}

export interface StampLibrary {
  id: string;
  name: string;
  document: PdfDocumentObject;
  stamps: StampDefinition[];
  categories?: string[];
  readonly: boolean;
}

export interface ResolvedStamp {
  library: StampLibrary;
  stamp: StampDefinition;
}

export interface ExportedStampLibrary {
  name: string;
  pdf: ArrayBuffer;
  stamps: StampDefinition[];
  categories?: string[];
}

export interface StampManifestSource {
  url: string;
  fallbackLocale?: string;
}

export interface StampManifest {
  name: string;
  pdf: string;
  stamps: StampManifestEntry[];
  categories?: string[];
}

export interface StampManifestEntry {
  pageIndex: number;
  name: string;
  subject: string;
  label?: string;
  categories?: string[];
}

export interface StampPluginConfig extends BasePluginConfig {
  libraries?: StampLibraryConfig[];
  manifests?: StampManifestSource[];
}

export interface StampState {
  libraryIds: string[];
}

export interface StampScope {
  createStampFromAnnotation(
    annotation: PdfAnnotationObject,
    stamp: Omit<StampDefinition, 'pageIndex'>,
    libraryId?: string,
  ): PdfTask<void>;

  createStampFromAnnotations(
    annotations: PdfAnnotationObject[],
    stamp: Omit<StampDefinition, 'pageIndex'>,
    libraryId?: string,
  ): PdfTask<void>;

  activateStampPlacement(libraryId: string, stamp: StampDefinition): PdfTask<void>;
}

export interface StampCapability {
  getLibraries(): StampLibrary[];
  getStampsByCategory(category: string): ResolvedStamp[];
  renderStamp(libraryId: string, pageIndex: number, width: number, dpr?: number): PdfTask<Blob>;
  loadLibrary(config: StampLibraryConfig): PdfTask<string>;
  loadLibraryFromManifest(url: string): PdfTask<string>;
  createNewLibrary(name: string, options?: { categories?: string[] }): PdfTask<string>;
  addStampToLibrary(
    libraryId: string,
    stamp: Omit<StampDefinition, 'pageIndex'>,
    pdf: ArrayBuffer,
  ): PdfTask<void>;
  removeStampFromLibrary(libraryId: string, pageIndex: number): PdfTask<void>;
  removeLibrary(id: string): PdfTask<void>;
  exportLibrary(id: string): PdfTask<ExportedStampLibrary>;
  forDocument(documentId: string): StampScope;
  onLibraryChange: EventHook<StampLibrary[]>;
}

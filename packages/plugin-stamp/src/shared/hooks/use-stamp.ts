import { useCapability, usePlugin } from '@embedpdf/core/@framework';
import { StampPlugin, StampLibrary, ResolvedStamp } from '@embedpdf/plugin-stamp';
import { AnnotationPlugin, AnnotationDocumentState } from '@embedpdf/plugin-annotation';
import { useState, useEffect } from '@framework';

const useAnnotationCapability = () => useCapability<AnnotationPlugin>(AnnotationPlugin.id);

export const useStampPlugin = () => usePlugin<StampPlugin>(StampPlugin.id);
export const useStampCapability = () => useCapability<StampPlugin>(StampPlugin.id);

export const useStampLibraries = () => {
  const { provides } = useStampCapability();
  const [libraries, setLibraries] = useState<StampLibrary[]>(provides?.getLibraries() ?? []);

  useEffect(() => {
    if (!provides) return;
    setLibraries(provides.getLibraries());
    return provides.onLibraryChange((libs) => {
      setLibraries(libs);
    });
  }, [provides]);

  return { libraries, provides };
};

export const useStampsByCategory = (category: string) => {
  const { provides } = useStampCapability();
  const [stamps, setStamps] = useState<ResolvedStamp[]>([]);

  useEffect(() => {
    if (!provides) return;
    setStamps(provides.getStampsByCategory(category));
    return provides.onLibraryChange(() => {
      setStamps(provides.getStampsByCategory(category));
    });
  }, [provides, category]);

  return stamps;
};

export const useActiveStamp = (documentId: string) => {
  const { provides: annotation } = useAnnotationCapability();
  const [activeStamp, setActiveStamp] = useState<{ libraryId: string; stampName: string } | null>(
    null,
  );

  useEffect(() => {
    if (!annotation) return;
    const scope = annotation.forDocument(documentId);

    const derive = (state: AnnotationDocumentState) => {
      if (state.activeToolId === 'rubberStamp' && state.activeToolContext) {
        const ctx = state.activeToolContext as { libraryId?: string; stampName?: string };
        if (ctx.libraryId && ctx.stampName) {
          setActiveStamp({ libraryId: ctx.libraryId, stampName: ctx.stampName });
          return;
        }
      }
      setActiveStamp(null);
    };

    derive(scope.getState());
    return scope.onStateChange(derive);
  }, [annotation, documentId]);

  return activeStamp;
};

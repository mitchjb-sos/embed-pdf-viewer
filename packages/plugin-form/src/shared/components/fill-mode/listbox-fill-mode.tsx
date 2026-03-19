import { useCallback, useState } from '@framework';
import { PdfWidgetAnnoObject } from '@embedpdf/models';
import { AnnotationRendererProps } from '@embedpdf/plugin-annotation/@framework';
import { useFormWidgetState } from '../../hooks/use-form-widget-state';
import { RenderWidget } from '../render-widget';
import { ListboxField } from '../fields/listbox';
import { ListboxFieldProps } from '../types';

export function ListboxFillMode(props: AnnotationRendererProps<PdfWidgetAnnoObject>) {
  const { annotation, scale, pageIndex, handleChangeField, renderKey, isReadOnly } =
    useFormWidgetState(props);
  const [editing, setEditing] = useState(false);

  const handleClick = useCallback(() => {
    if (isReadOnly) return;
    setEditing(true);
  }, [isReadOnly]);

  const handleBlur = useCallback(() => {
    setEditing(false);
  }, []);

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: isReadOnly ? 'default' : 'pointer',
        pointerEvents: 'auto',
      }}
    >
      <ListboxField
        annotation={annotation as ListboxFieldProps['annotation']}
        scale={scale}
        pageIndex={pageIndex}
        isEditable={true}
        onChangeField={handleChangeField}
        onBlur={handleBlur}
      />
      {!editing && (
        <RenderWidget
          pageIndex={pageIndex}
          annotation={annotation}
          scaleFactor={scale}
          renderKey={renderKey}
          style={{ pointerEvents: 'none' }}
        />
      )}
    </div>
  );
}

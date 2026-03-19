import { useCallback, useState } from '@framework';
import { PdfWidgetAnnoObject } from '@embedpdf/models';
import { AnnotationRendererProps } from '@embedpdf/plugin-annotation/@framework';
import { useFormWidgetState } from '../../hooks/use-form-widget-state';
import { RenderWidget } from '../render-widget';
import { TextField } from '../fields/text';
import { TextFieldProps } from '../types';

export function TextFillMode(props: AnnotationRendererProps<PdfWidgetAnnoObject>) {
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

  const focusRef = useCallback((el: HTMLElement | null) => {
    if (el) el.focus();
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
      {!editing && (
        <RenderWidget
          pageIndex={pageIndex}
          annotation={annotation}
          scaleFactor={scale}
          renderKey={renderKey}
          style={{ pointerEvents: 'none' }}
        />
      )}
      {editing && (
        <TextField
          annotation={annotation as TextFieldProps['annotation']}
          scale={scale}
          pageIndex={pageIndex}
          isEditable={true}
          onChangeField={handleChangeField}
          onBlur={handleBlur}
          inputRef={focusRef}
        />
      )}
    </div>
  );
}

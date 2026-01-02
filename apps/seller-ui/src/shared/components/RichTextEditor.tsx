'use client';

import 'react-quill-new/dist/quill.snow.css';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
});

const RichTextEditor = ({ value, onChange }: Props) => {
  const [editorValue, setEditorValue] = useState(value || '');
  const quillRef = useRef(false);

  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = true;

      setTimeout(() => {
        document.querySelectorAll('.ql-toolbar').forEach((toolbar, index) => {
          if (index > 0) {
            toolbar.remove();
          }
        });
      }, 100);
    }
  }, []);

  return (
    <div className="relative">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={(content) => {
          setEditorValue(content);
          onChange(content);
        }}
        modules={{
          toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ align: [] }],
            ['clean'],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
          ],
        }}
        placeholder="Write a detailed product description here..."
        className="bg-transparent border border-slate-300 text-slate-900 rounded-md"
        style={{ minHeight: '250px' }}
      />
      <style>
        {`
        .ql-toolbar{
        background:transparent;
        border-color:#cbd5e1;
        }

        .ql-container{
        background:transparent !important;
        border-color:#cbd5e1;
        color:#0f172a;
        }

        .ql-picker{
        color:#0f172a !important;
        }

        .ql-editor{
        min-height:200px;
        }

        .ql-snow{
        border-color:#cbd5e1 !important;
        }

        .ql-editor.ql-blank::before{
        color:#94a3b8 !important;
        }

        .ql-picker-options{
        background: #fff !important;
        color:#0f172a !important;
        border: 1px solid #cbd5e1 !important;
        }

        .ql-picker-item{
        color:#0f172a !important;
        }

        .ql-picker-label{
        color:#0f172a !important;
        }

        .ql-stroke{
        stroke:#0f172a !important;
        }

        .ql-fill{
        fill:#0f172a !important;
        }
        `}
      </style>
    </div>
  );
};

export default RichTextEditor;

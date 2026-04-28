import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['code-block', 'blockquote'],
        ['link'],
        ['clean']
    ],
};

const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'code-block', 'blockquote', 'link'
];

export default function RichTextEditor({ value, onChange, placeholder = 'Write something...', readOnly = false, minHeight = '120px' }) {
    if (readOnly) {
        return (
            <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: value || '' }}
            />
        );
    }

    return (
        <div className="rich-text-editor">
            <ReactQuill
                theme="snow"
                value={value || ''}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                style={{ minHeight }}
            />
            <style>{`
                .rich-text-editor .ql-container {
                    min-height: ${minHeight};
                    font-size: 14px;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }
                .rich-text-editor .ql-toolbar {
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                }
                .rich-text-editor .ql-editor {
                    min-height: ${minHeight};
                }
            `}</style>
        </div>
    );
}

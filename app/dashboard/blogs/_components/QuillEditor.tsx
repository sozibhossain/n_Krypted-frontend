import React, { useMemo, useRef} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
          ],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
      },
    }),
    []
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "align",
      "color",
      "background",
      "link",
      "image",
    ],
    []
  );

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
    />
  );
};

export default QuillEditor;
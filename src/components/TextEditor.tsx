import ReactQuill from 'react-quill';

interface IProps {
  value: string;
  onChange: (value: string) => void;
}
const TextEditor = ({ value, onChange }: IProps) => {
  return (
    <ReactQuill theme="snow" className="mt-1 quill-custom" value={value} onChange={onChange} />
  );
};

export default TextEditor;

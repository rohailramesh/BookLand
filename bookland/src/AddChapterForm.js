import { useState } from "react";
import { Form, Input, Button } from "antd";

const AddChapterForm = ({ bookId, onSubmit, onCancel }) => {
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterNotes, setChapterNotes] = useState("");

  const handleTitleChange = (e) => {
    setChapterTitle(e.target.value);
  };

  const handleNotesChange = (e) => {
    setChapterNotes(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form:", bookId, chapterTitle, chapterNotes);
    onSubmit(bookId, chapterTitle, chapterNotes);
  };

  return (
    <Form onSubmitCapture={handleSubmit}>
      <Form.Item label="Chapter Title">
        <Input value={chapterTitle} onChange={handleTitleChange} />
      </Form.Item>
      <Form.Item label="Chapter Notes">
        <Input.TextArea value={chapterNotes} onChange={handleNotesChange} />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ backgroundColor: "#000", color: "#fff" }}
        >
          Save Chapter
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddChapterForm;

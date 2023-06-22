import { useEffect, useState } from "react";
import { useParams } from "react-router";
import supabase from "./supabaseClient";
import { Typography, Card, notification } from "antd";
import AddChapterForm from "./AddChapterForm";

const { Title, Text } = Typography;

function BookInfo() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [showAddChapterForm, setShowAddChapterForm] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showChapters, setShowChapters] = useState(false);
  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: "Chapter Added",
      description: "The chapter was successfully added!",
    });
  };

  useEffect(() => {
    async function getBook() {
      try {
        const { data } = await supabase
          .from("Books")
          .select()
          .eq("id", id)
          .single();

        setBook(data);
      } catch (error) {
        console.error(error);
      }
    }

    getBook();
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  //
  async function handleAddChapterSubmit(bookId, chapterTitle, chapterNotes) {
    try {
      console.log("bookId:", bookId);
      console.log("chapterTitle:", chapterTitle);
      console.log("chapterNotes:", chapterNotes);

      // Save the chapter to the database using Supabase
      const { data, error } = await supabase.from("Book_Chapters").insert([
        {
          bookId: bookId,
          chapterTitle: chapterTitle,
          chapterNotes: chapterNotes,
        },
      ]);

      if (error) {
        console.error(error);
        return;
      }

      // Chapter added successfully, display a success message or update the UI
      console.log("Chapter added:", data);

      // Close the AddChapterForm
      setShowAddChapterForm(false);
      setShowChapters(false);
      openNotificationWithIcon("success");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <Card
        key={book.id}
        style={{
          width: "320px",
          margin: "12px",
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={book.bookThumbnail}
            alt="Book Cover"
            style={{ marginBottom: "16px" }}
          />
          <Title level={4} style={{ marginBottom: "8px" }}>
            {book.bookName}
          </Title>
          <Text style={{ marginBottom: "8px" }}>{book.bookAuthor}</Text>
        </div>
      </Card>

      <div style={{ paddingTop: "18px" }}>
        <AddChapterForm
          bookId={book.id}
          onSubmit={handleAddChapterSubmit}
          onCancel={() => setShowAddChapterForm(false)}
        />
      </div>
    </div>
  );
}

export default BookInfo;

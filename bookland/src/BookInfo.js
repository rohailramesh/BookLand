import { useEffect, useState } from "react";
import { useParams } from "react-router";
import supabase from "./supabaseClient";
import { Typography, Card, notification, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import AddChapterForm from "./AddChapterForm";
import { Skeleton } from "antd";

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
  const openNotification = (type) => {
    notification[type]({
      message: "Chapter Deleted",
      description: "The chapter was successfully deleted!",
    });
  };

  async function getChapters() {
    try {
      const { data } = await supabase
        .from("Book_Chapters")
        .select()
        .eq("bookId", id);

      setChapters(data);
      setShowChapters(true);
    } catch (error) {
      console.error(error);
    }
  }

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
    getChapters();
    const booksChannel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Book_Chapters" },
        (payload) => {
          console.log("Change received!", payload);
          getChapters();
        }
      )
      .subscribe();

    return () => {
      booksChannel.unsubscribe();
    };
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  //
  async function handleAddChapterSubmit(bookId, chapterTitle, chapterNotes) {
    try {
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
      openNotificationWithIcon("success");

      // Fetch the updated chapters
      getChapters();
    } catch (error) {
      console.error(error);
    }
  }
  async function deleteChapter(id) {
    try {
      const { error } = await supabase
        .from("Book_Chapters")
        .delete()
        .eq("id", id);

      console.log(error);
      openNotification("success");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
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
      <div>
        <Title level={4} style={{ textAlign: "center", marginTop: "24px" }}>
          Book Notes
        </Title>
        {showChapters && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {chapters.length > 0 ? (
              chapters.map((chapter) => (
                <Card
                  key={chapter.id}
                  style={{
                    width: "320px",
                    margin: "10px",
                    padding: "0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <div style={{ padding: "10px", marginTop: "-15px" }}>
                    <Title level={4}>{chapter.chapterTitle}</Title>
                    <Text>{chapter.chapterNotes}</Text>
                  </div>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => deleteChapter(chapter.id)}
                    style={{
                      backgroundColor: "#000",
                      color: "#fff",
                      marginTop: "auto",
                    }}
                  />
                </Card>
              ))
            ) : (
              <div>No chapter notes available</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default BookInfo;

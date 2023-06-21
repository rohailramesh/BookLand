import { useEffect, useState } from "react";
import { useParams } from "react-router";
import supabase from "./supabaseClient";
import { Typography, Card } from "antd";

const { Title, Text } = Typography;

function BookInfo() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

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

  return (
    <div>
      <Card
        key={book.id}
        style={{
          width: "220px",
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
    </div>
  );
}

export default BookInfo;

import { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import { Input, Button, Typography, Card, Pagination } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

function SupabasePractice() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const totalBooks = books.length;
  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: "Book Deleted",
      description: "The book was successfully deleted!",
    });
  };

  useEffect(() => {
    async function getBooks() {
      try {
        let query = supabase.from("Books").select();

        if (searchQuery !== "") {
          query = query.filter("bookName", "ilike", `%${searchQuery}%`);
        }

        const { data } = await query;
        setBooks(data);
      } catch (error) {
        console.error(error);
      }
    }

    getBooks();

    const booksChannel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Books" },
        (payload) => {
          console.log("Change received!", payload);
          getBooks();
        }
      )
      .subscribe();

    return () => {
      booksChannel.unsubscribe();
    };
  }, [searchQuery]);

  async function deleteBook(id) {
    try {
      const { error } = await supabase.from("Books").delete().eq("id", id);

      console.log(error);
      openNotificationWithIcon("success");
    } catch (error) {
      console.log(error);
    }
  }

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    if (searchQuery !== "" && page !== 1) {
      setCurrentPage(1);
    }
  };

  const getCurrentBooks = () => {
    const filteredBooks = books.filter((book) =>
      book.bookName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredBooks.slice(startIndex, endIndex);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {currentPage === 1 && (
        <Input
          type="text"
          placeholder="Start searching for a book..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "350px", marginBottom: "16px" }}
        />
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {getCurrentBooks().map((book) => (
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
            <Link to={`/books/${book.id}`}>
              <Button icon={<EyeOutlined />} />
            </Link>
            &nbsp; &nbsp;
            <Button
              icon={<DeleteOutlined />}
              onClick={() => deleteBook(book.id)}
              style={{
                backgroundColor: "#000",
                color: "#fff",
                marginTop: "auto",
              }}
            ></Button>
            &nbsp;
          </Card>
        ))}
      </div>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalBooks}
        onChange={handlePageChange}
        style={{ textAlign: "center", marginTop: "16px" }}
      />
    </div>
  );
}

export default SupabasePractice;

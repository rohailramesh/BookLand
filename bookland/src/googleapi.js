import React, { useEffect, useState } from "react";
import { Input, Button, Typography, Card } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import supabase from "./supabaseClient";
// import "antd/dist/antd.css";

const { Title, Text } = Typography;

const BookSearch = () => {
  const [bookData, setBookData] = useState(null);
  const [bookName, setBookName] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);

  useEffect(() => {
    if (searchClicked) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${bookName}&key=AIzaSyCMusI39bGt0vHoLkjw9dufH6yTDw2Dq1k`
          );
          const data = await response.json();
          console.log(data); // Log the response data to the console
          setBookData(data); // Store the response data in state
        } catch (error) {
          console.log("Error fetching data:", error);
        }
      };

      fetchData();
      setSearchClicked(false); // Reset searchClicked state
    }
  }, [bookName, searchClicked]);

  function handleBookNameChange(event) {
    setBookName(event.target.value);
  }

  function handleSearchClick(event) {
    event.preventDefault(); // Prevent form submission
    setSearchClicked(true);
  }

  async function insertBook(bookName, authorName, bookCover) {
    try {
      const { error } = await supabase
        .from("Books")
        .insert([
          { bookName: bookName, bookAuthor: authorName, bookCover: bookCover },
        ]);

      if (error) {
        console.error(error);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <form onSubmit={handleSearchClick}>
          <Input
            type="text"
            placeholder="Enter book name"
            value={bookName}
            onChange={handleBookNameChange}
          />
          <Button type="primary" onClick={handleSearchClick}>
            Search
          </Button>
        </form>
      </div>
      <div>
        {bookData && bookData.items && bookData.items.length > 0 ? (
          <div>
            {bookData.items.slice(0, 3).map((item) => (
              <Card
                key={item.id}
                style={{
                  marginBottom: "24px",
                  width: "500px",
                  display: "flex",
                  position: "relative",
                }}
              >
                <img
                  src={item.volumeInfo.imageLinks.thumbnail}
                  alt="Book Cover"
                  style={{ marginBottom: "16px" }}
                />
                <Title level={4}>{item.volumeInfo.title}</Title>
                <Text>Author: {item.volumeInfo.authors[0]}</Text>
                <Text>Description: {item.volumeInfo.description}</Text>
                <br></br>
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() =>
                    insertBook(
                      item.volumeInfo.title,
                      item.volumeInfo.authors[0],
                      item.volumeInfo.imageLinks.thumbnail
                    )
                  }
                >
                  Add Book
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <p>No book found</p>
        )}
      </div>
    </div>
  );
};

export default BookSearch;

// AIzaSyCMusI39bGt0vHoLkjw9dufH6yTDw2Dq1k

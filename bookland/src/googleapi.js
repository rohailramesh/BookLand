import React, { useEffect, useState } from "react";
import { Input, Button, Typography, Card } from "antd";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import supabase from "./supabaseClient";
import Lottie from "lottie-react-web";
import lottie from "../src/lottie.json";

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
            `https://www.googleapis.com/books/v1/volumes?q=${bookName}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
          );
          const data = await response.json();
          console.log(data);
          setBookData(data);
        } catch (error) {
          console.log("Error fetching data:", error);
        }
      };

      fetchData();
      setSearchClicked(false);
    }
  }, [bookName, searchClicked]);

  function handleBookNameChange(event) {
    setBookName(event.target.value);
  }

  function handleSearchClick(event) {
    event.preventDefault();
    setSearchClicked(true);
  }

  async function insertBook(bookName, authorName, thumbnail) {
    try {
      const { error } = await supabase.from("Books").insert([
        {
          bookName: bookName,
          bookAuthor: authorName,
          bookThumbnail: thumbnail,
        },
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
    <div style={{ padding: "50px" }}>
      <div style={{ marginBottom: "24px" }}>
        <form onSubmit={handleSearchClick}>
          <Input
            type="text"
            placeholder="Enter book name"
            value={bookName}
            onChange={handleBookNameChange}
            style={{ width: "300px" }}
          />
          &nbsp;
          <Button type="primary" onClick={handleSearchClick}>
            <SearchOutlined />
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
                  src={item.volumeInfo.imageLinks?.thumbnail}
                  alt="Book Cover"
                  style={{ marginBottom: "16px" }}
                />
                <Title level={4}>{item.volumeInfo.title}</Title>
                <Text>Author: {item.volumeInfo.authors?.[0]}</Text>
                <Text>Description: {item.volumeInfo.description}</Text>
                <br></br>
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() =>
                    insertBook(
                      item.volumeInfo.title,
                      item.volumeInfo.authors?.[0],
                      item.volumeInfo.imageLinks?.thumbnail
                    )
                  }
                >
                  Add Book
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div style={{}}>
            <Lottie
              options={{
                animationData: lottie,
                loop: true,
              }}
              height={800}
              width={800}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearch;

import React, { useEffect, useState } from "react";
import { Input, Button, Typography, Card } from "antd";
import {
  PlusCircleOutlined,
  SearchOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import supabase from "./supabaseClient";
import Lottie from "lottie-react-web";
// import lottie from "../src/lottie.json";
import lottie2 from "../src/lottie2.json";
import { notification } from "antd";

const { Title, Text } = Typography;

const BookSearch = () => {
  const [bookData, setBookData] = useState(null);
  const [bookName, setBookName] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: "Book Added",
      description: "The book was successfully added!",
    });
  };

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

  function handleClear() {
    setBookName("");
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

      // Book inserted successfully, trigger notification
      openNotificationWithIcon("success");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      style={{
        padding: "50px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        overflow: "auto",
      }}
    >
      {/* Rest of the code */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          // maxWidth: "1500px",
          width: "350px",
        }}
      >
        <Button
          style={{
            backgroundColor: "#000",
            color: "#fff",
            width: "50px",
            height: "40px",
          }}
          onClick={handleClear}
        >
          <CloseCircleOutlined />
        </Button>
        <Input
          type="text"
          placeholder="Enter book name"
          value={bookName}
          onChange={handleBookNameChange}
          style={{
            flex: 1,
            marginLeft: "10px",
            marginRight: "10px",
            height: "40px",
            width: "400px",
            textAlign: "center",
          }}
        />
        <Button
          style={{
            backgroundColor: "#000",
            color: "#fff",
            width: "50px",
            height: "40px",
          }}
          onClick={handleSearchClick}
        >
          <SearchOutlined />
        </Button>
      </div>

      <div>
        {bookData && bookData.items && bookData.items.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {bookData.items.map((item) => (
              <Card
                key={item.id}
                style={{
                  width: "290px",
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
                <img
                  src={item.volumeInfo.imageLinks?.thumbnail}
                  alt="Book Cover"
                  style={{ marginBottom: "16px" }}
                />
                <Title level={4}>{item.volumeInfo.title}</Title>
                <Text>Author: {item.volumeInfo.authors?.[0]}</Text>
                <br></br>

                <Button
                  // type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() =>
                    insertBook(
                      item.volumeInfo.title,
                      item.volumeInfo.authors?.[0],
                      item.volumeInfo.imageLinks?.thumbnail
                    )
                  }
                  style={{ backgroundColor: "#000", color: "#fff" }}
                >
                  Add Book
                </Button>
              </Card>
            ))}
            &nbsp;
          </div>
        ) : (
          <div style={{}}>
            <Lottie
              options={{
                animationData: lottie2,
                loop: true,
              }}
              height={500}
              width={500}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearch;

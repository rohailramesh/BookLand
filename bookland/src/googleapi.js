import React, { useEffect, useState } from "react";

const YourComponent = () => {
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

  return (
    <div>
      <div>
        <form onSubmit={handleSearchClick}>
          <label>
            Search:{" "}
            <input
              type="text"
              name="name"
              value={bookName}
              onChange={handleBookNameChange}
            />
          </label>
          <button type="submit">Search</button>
        </form>
      </div>
      <div>
        {bookData && bookData.items && bookData.items.length > 0 ? (
          <div>
            <h2>{bookData.items[0].volumeInfo.title}</h2>
            <p>Author: {bookData.items[0].volumeInfo.authors[0]}</p>
            <img
              src={bookData.items[0].volumeInfo.imageLinks.thumbnail}
              alt="Book Cover"
            />
            <p>Description: {bookData.items[0].volumeInfo.description}</p>
          </div>
        ) : (
          <p>No book found</p>
        )}
      </div>
    </div>
  );
};

export default YourComponent;

// AIzaSyCMusI39bGt0vHoLkjw9dufH6yTDw2Dq1k

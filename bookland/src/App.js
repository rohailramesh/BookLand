import { useEffect, useState } from "react";
import supabase from "./supabaseClient";

function App() {
  const [books, setBooks] = useState([]);
  const [newBookName, setNewBookName] = useState("");
  const [newAuthorName, setNewAuthorName] = useState("");

  useEffect(() => {
    getBooks();
  }, []);

  async function getBooks() {
    try {
      const { data } = await supabase.from("Books").select();
      setBooks(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function insertBook() {
    try {
      const { error } = await supabase
        .from("Books")
        .insert([{ bookName: newBookName, bookAuthor: newAuthorName }]);

      if (error) {
        console.error(error);
        return;
      }

      // If the insertion is successful, fetch the updated list of countries
      getBooks();
      setNewBookName(""); // Reset the newCountry state to clear the input field
      setNewAuthorName("");
    } catch (error) {
      console.error(error);
    }
  }

  function handleInputChange(event) {
    setNewBookName(event.target.value);
    setNewAuthorName(event.target.value);
  }

  return (
    <div>
      <form>
        <label>
          Book:
          <input
            type="text"
            name="name"
            value={newBookName}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Author:
          <input
            type="text"
            name="name"
            value={newAuthorName}
            onChange={handleInputChange}
            required
          />
        </label>
        <br></br>
        <button type="button" onClick={insertBook}>
          Insert Book
        </button>
      </form>

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.bookName}, {book.bookAuthor}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

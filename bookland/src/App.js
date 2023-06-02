import { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import BookSearch from "./googleapi";

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

  async function deleteBook(id) {
    try {
      const { error } = await supabase.from("Books").delete().eq("id", id);

      console.log(error);
    } catch (error) {
      console.log(error);
    }
  }

  function handleBookNameInputChange(event) {
    setNewBookName(event.target.value);
  }

  function handleBookAuthorNameInputChange(event) {
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
            onChange={handleBookNameInputChange}
            required
          />
        </label>
        <label>
          Author:
          <input
            type="text"
            name="name"
            value={newAuthorName}
            onChange={handleBookAuthorNameInputChange}
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
          <div>
            <li key={book.id}>
              {book.bookName}, {book.bookAuthor}
            </li>
            <button type="button" onClick={() => deleteBook(book.id)}>
              Delete Book
            </button>
          </div>
        ))}
      </ul>
      <BookSearch />
    </div>
  );
}

export default App;

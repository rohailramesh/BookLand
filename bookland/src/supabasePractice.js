import { useEffect, useState } from "react";
import supabase from "./supabaseClient";

function SupabasePractice() {
  const [books, setBooks] = useState([]);

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

  async function deleteBook(id) {
    try {
      const { error } = await supabase.from("Books").delete().eq("id", id);

      console.log(error);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <ul>
        {books.map((book) => (
          <div>
            <li key={book.id}>
              {book.bookName}, {book.bookAuthor}, {book.bookCover}
            </li>
            <button type="button" onClick={() => deleteBook(book.id)}>
              Delete Book
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default SupabasePractice;

import { useEffect, useState } from "react";
import supabase from "./supabaseClient";

function SupabasePractice() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
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
          <div key={book.id}>
            <li>
              <img
                src={book.bookThumbnail}
                alt="Book Cover"
                style={{ width: "100px" }}
              />
              {book.bookName}, {book.bookAuthor}
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

// import { useEffect, useState } from "react";
// import supabase from "./supabaseClient";

// function SupabasePractice() {
//   const [books, setBooks] = useState([]);

//   useEffect(() => {
//     getBooks();
//   }, []);

//   async function getBooks() {
//     try {
//       const { data } = await supabase.from("Books").select();
//       setBooks(data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   async function deleteBook(id) {
//     try {
//       const { error } = await supabase.from("Books").delete().eq("id", id);

//       console.log(error);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   return (
//     <div>
//       <ul>
//         {books.map((book) => (
//           <div>
//             <li key={book.id}>
//               <img
//                 src={book.bookThumbnail}
//                 alt="Book Cover"
//                 style={{ width: "100px" }}
//               />
//               {book.bookName}, {book.bookAuthor}
//             </li>
//             <button type="button" onClick={() => deleteBook(book.id)}>
//               Delete Book
//             </button>
//           </div>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default SupabasePractice;

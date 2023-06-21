// import { useEffect, useState } from "react";
// import supabase from "./supabaseClient";
// import { Button, Typography, Card, Pagination } from "antd";
// import { DeleteOutlined } from "@ant-design/icons";
// import { notification } from "antd";
// import AddChapterForm from "./AddChapterForm";

// const { Title, Text } = Typography;

// function SupabasePractice() {
//   const [books, setBooks] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(5);
//   const totalBooks = books.length;
//   //
//   const [showAddChapterForm, setShowAddChapterForm] = useState(false);
//   const [selectedBookId, setSelectedBookId] = useState(null);
//   const [chapters, setChapters] = useState([]);
//   const [showChapters, setShowChapters] = useState(false);

//   const openNotificationWithIcon = (type) => {
//     notification[type]({
//       message: "Book Deleted",
//       description: "The book was successfully deleted!",
//     });
//   };

//   useEffect(() => {
//     getBooks();

//     const booksChannel = supabase
//       .channel("custom-all-channel")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "Books" },
//         (payload) => {
//           console.log("Change received!", payload);
//           getBooks();
//         }
//       )
//       .subscribe();

//     return () => {
//       booksChannel.unsubscribe();
//     };
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
//       // Delete associated chapters
//       await supabase.from("Book_Chapters").delete().eq("bookId", id);

//       // Delete the book
//       const { error } = await supabase.from("Books").delete().eq("id", id);

//       if (error) {
//         console.log(error);
//         return;
//       }

//       console.log("Book deleted successfully!");
//       openNotificationWithIcon("success");
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const handlePageChange = (page, pageSize) => {
//     setCurrentPage(page);
//   };

//   const getCurrentBooks = () => {
//     const startIndex = (currentPage - 1) * pageSize;
//     const endIndex = startIndex + pageSize;
//     return books.slice(startIndex, endIndex).map((book) => (
//       <Card
//         key={book.id}
//         style={{
//           width: "220px",
//           margin: "12px",
//           flex: "0 0 auto",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: "16px",
//           textAlign: "center",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <img
//             src={book.bookThumbnail}
//             alt="Book Cover"
//             style={{ marginBottom: "16px" }}
//           />
//           <Title level={4} style={{ marginBottom: "8px" }}>
//             {book.bookName}
//           </Title>
//           <Text style={{ marginBottom: "8px" }}>{book.bookAuthor}</Text>
//         </div>
//         <Button
//           icon={<DeleteOutlined />}
//           onClick={() => deleteBook(book.id)}
//           style={{
//             backgroundColor: "#000",
//             color: "#fff",
//             marginTop: "auto",
//           }}
//         >
//           Delete Book
//         </Button>
//         <Button
//           onClick={async () => {
//             setSelectedBookId(book.id);
//             setShowAddChapterForm(true);

//             // Fetch chapters for the selected book
//             const { data, error } = await supabase
//               .from("Book_Chapters")
//               .select()
//               .eq("bookId", book.id);

//             if (error) {
//               console.error(error);
//               return;
//             }

//             // Set the chapters and show them
//             setChapters(data);
//             setShowChapters(true);
//           }}
//         >
//           View Book
//         </Button>
//         {showChapters && book.id === selectedBookId && (
//           <div>
//             {chapters.map((chapter) => (
//               <div key={chapter.id}>
//                 <p>{chapter.chapterTitle}</p>
//                 <p>{chapter.chapterNotes}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </Card>
//     ));
//   };

//   async function handleAddChapterSubmit(bookId, chapterTitle, chapterNotes) {
//     try {
//       console.log("bookId:", bookId);
//       console.log("chapterTitle:", chapterTitle);
//       console.log("chapterNotes:", chapterNotes);

//       // Save the chapter to the database using Supabase
//       const { data, error } = await supabase.from("Book_Chapters").insert([
//         {
//           bookId: bookId,
//           chapterTitle: chapterTitle,
//           chapterNotes: chapterNotes,
//         },
//       ]);

//       if (error) {
//         console.error(error);
//         return;
//       }

//       // Chapter added successfully, display a success message or update the UI
//       console.log("Chapter added:", data);

//       // Close the AddChapterForm
//       setShowAddChapterForm(false);
//       setShowChapters(false);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           justifyContent: "center",
//         }}
//       >
//         {getCurrentBooks()}
//       </div>
//       {/* AddChapterForm */}
//       {showAddChapterForm && (
//         <AddChapterForm
//           bookId={selectedBookId}
//           onSubmit={handleAddChapterSubmit}
//           onCancel={() => setShowAddChapterForm(false)}
//         />
//       )}

//       <Pagination
//         current={currentPage}
//         pageSize={pageSize}
//         total={totalBooks}
//         onChange={handlePageChange}
//         style={{ textAlign: "center", marginTop: "16px" }}
//       />
//     </div>
//   );
// }

// export default SupabasePractice;

//------------------------------
import { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import { Input, Button, Typography, Card, Pagination } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
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
            <Button
              icon={<DeleteOutlined />}
              onClick={() => deleteBook(book.id)}
              style={{
                backgroundColor: "#000",
                color: "#fff",
                marginTop: "auto",
              }}
            >
              Delete Book
            </Button>
            <Button>
              <Link to={`/books/${book.id}`}>View Book</Link>
            </Button>
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

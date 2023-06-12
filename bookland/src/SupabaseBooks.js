import { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import { Button, Typography, Card, Pagination } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { notification } from "antd";

const { Title, Text } = Typography;

function SupabasePractice() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const totalBooks = books.length;

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: "Book Deleted",
      description: "The book was successfully deleted!",
    });
  };

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
      openNotificationWithIcon("success");
    } catch (error) {
      console.log(error);
    }
  }

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const getCurrentBooks = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return books.slice(startIndex, endIndex);
  };

  return (
    <div>
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

// import { useEffect, useState } from "react";
// import supabase from "./supabaseClient";
// import { Button, Typography, Card } from "antd";
// // import Title from "antd/es/skeleton/Title";
// import { DeleteOutlined } from "@ant-design/icons";
// import { notification } from "antd";
// const { Title, Text } = Typography;
// function SupabasePractice() {
//   const [books, setBooks] = useState([]);
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
//       const { error } = await supabase.from("Books").delete().eq("id", id);

//       console.log(error);
//       openNotificationWithIcon("success");
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexWrap: "wrap",
//         justifyContent: "center",
//         // alignItems: "flex-start",
//       }}
//     >
//       {books.map((book) => (
//         <Card
//           key={book.id}
//           style={{
//             width: "290px",
//             margin: "12px",
//             flex: "0 0 auto",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "16px",
//             textAlign: "center",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             <img
//               src={book.bookThumbnail}
//               alt="Book Cover"
//               style={{ marginBottom: "16px" }}
//             />
//             <Title level={4} style={{ marginBottom: "8px" }}>
//               {book.bookName}
//             </Title>
//             <Text style={{ marginBottom: "8px" }}>{book.bookAuthor}</Text>
//           </div>
//           <Button
//             icon={<DeleteOutlined />}
//             onClick={() => deleteBook(book.id)}
//             style={{
//               backgroundColor: "#000",
//               color: "#fff",
//               marginTop: "auto",
//             }}
//           >
//             Delete Book
//           </Button>
//         </Card>
//       ))}
//     </div>
//   );
// }

// export default SupabasePractice;

import BookSearch from "./googleapi";
import SupabasePractice from "./SupabaseBooks";
import Navbar from "./Navbar";
import BookInfo from "./BookInfo";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<BookSearch />} />
          <Route path="/mybooks" element={<SupabasePractice />} />
          <Route path="/books/:id" element={<BookInfo />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

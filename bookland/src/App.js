import BookSearch from "./googleapi";
import SupabasePractice from "./SupabaseBooks";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<BookSearch />} />
          <Route path="/mybooks" element={<SupabasePractice />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

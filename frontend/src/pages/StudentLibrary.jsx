import React, { useState, useEffect } from "react";
import { 
  Library, 
  Search,
  BookOpen,
  Calendar,
  User
} from "lucide-react";
import { getAllBooks, borrowBook, searchBooks } from "../api/libraryApi";
import "./StudentLibrary.css";

const StudentLibrary = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get student ID from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const studentId = user.id;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Không thể tải danh sách sách. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchBooks();
      return;
    }
    try {
      setLoading(true);
      const data = await searchBooks(searchTerm);
      setBooks(data);
    } catch (err) {
      console.error("Error searching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await borrowBook(bookId, studentId);
      alert("Mượn sách thành công!");
      fetchBooks();
    } catch (err) {
      console.error("Error borrowing book:", err);
      alert("Không thể mượn sách. Vui lòng thử lại.");
    }
  };

  const categories = ["all", "Toán học", "Vật lý", "Hóa học", "Ngữ văn", "Lịch sử", "Địa lý"];

  const filteredBooks = selectedCategory === "all" 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  return (
    <div className="student-library-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Library size={28} />
            Thư viện
          </h1>
          <p className="page-subtitle">
            Tìm kiếm và mượn sách từ thư viện nhà trường
          </p>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>Tìm</button>
        </div>
        
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "all" ? "Tất cả" : cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Đang tải...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-cover">
                <span className="cover-icon">{book.cover || "📚"}</span>
                <div className={`availability-badge ${book.available ? 'available' : 'borrowed'}`}>
                  {book.available ? 'Có sẵn' : 'Đã mượn'}
                </div>
              </div>
              
              <div className="book-info">
                <span className="book-category">{book.category}</span>
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">
                  <User size={14} />
                  {book.author}
                </p>
                <p className="book-description">{book.description}</p>
                
                {!book.available && book.dueDate && (
                  <div className="due-date">
                    <Calendar size={14} />
                    <span>Hạn trả: {book.dueDate}</span>
                  </div>
                )}
                
                <button 
                  className="borrow-btn" 
                  onClick={() => handleBorrow(book.id)}
                  disabled={!book.available}
                >
                  <BookOpen size={16} />
                  {book.available ? 'Mượn sách' : 'Hết sách'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && !error && filteredBooks.length === 0 && (
        <div className="empty-state">
          <Library size={48} />
          <p>Không tìm thấy sách nào</p>
        </div>
      )}
    </div>
  );
};

export default StudentLibrary;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  BookOpen, 
  Search as SearchIcon, 
  FileText, 
  AlertCircle, 
  Filter,
  Book as BookIcon,
  BookOpen as BookOpenIcon,
  X,
  Sparkles
} from "lucide-react";
import { BASE_URL } from "../../api/config";
import "./StudentLibrary.css";

const StudentLibrary = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("all");

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/v1/library/getall`);
            setBooks(response.data.books || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching books: ', error);
            setError("Không thể tải danh sách tài liệu.");
            setLoading(false);
        }
    };

    const getAbsoluteUrl = (url) => {
        if (!url) return "#";
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.bookname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === "all" || book.bookname.toLowerCase().includes(selectedSubject.toLowerCase());
        return matchesSearch && matchesSubject;
    });

    const subjects = ["all", "Toán", "Vật lý", "Hóa học", "Ngữ văn", "Tiếng Anh", "Sinh học"];

    return (
        <div className="student-library-container">
            <header className="library-header">
                <div className="header-title">
                    <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '1rem', border: '1px solid #e0f2fe' }}>
                      <BookOpenIcon size={40} color="#0ea5e9" />
                    </div>
                    <div>
                        <h1>Thư viện số</h1>
                        <p>Khám phá kho tri thức vô tận của chúng tôi</p>
                    </div>
                </div>
            </header>

            <div className="library-filters">
                <div className="search-box-container">
                    <SearchIcon style={{ color: '#94a3b8' }} size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm tài liệu, sách học, tài liệu ôn tập..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="subject-chips-container">
                  {subjects.map(subject => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`subject-chip ${selectedSubject === subject ? 'active' : ''}`}
                    >
                      {subject === 'all' ? 'Tất cả tài liệu' : subject}
                    </button>
                  ))}
                </div>
            </div>

            {loading ? (
              <div className="library-loading">
                <div className="spinner" />
                <p>Đang tải tài liệu học tập...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <AlertCircle size={48} color="#ef4444" />
                <p>{error}</p>
                <button className="student-read-btn" onClick={fetchBooks} style={{ width: 'fit-content', marginTop: '1rem' }}>Thử lại</button>
              </div>
            ) : (
              <div className="student-books-grid">
                {filteredBooks.length === 0 ? (
                  <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                    <BookIcon size={64} color="#cbd5e1" />
                    <p>Không tìm thấy tài liệu nào khớp với tìm kiếm của bạn.</p>
                  </div>
                ) : (
                  filteredBooks.map((book) => (
                    <div key={book.id || book._id} className="student-book-card">
                      <div className="book-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={12} /> New
                      </div>
                      <div className="book-cover-container">
                        {book.coverUrl ? (
                          <img src={getAbsoluteUrl(book.coverUrl)} alt={book.bookname} className="book-cover-img" />
                        ) : (
                          <div className="book-cover-placeholder">
                            <BookOpenIcon size={48} />
                            <div style={{ fontSize: '0.75rem', marginTop: '12px', fontWeight: '800', letterSpacing: '0.1em' }}>LIBRARY</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="book-card-body">
                        <div className="book-tag">Tài liệu học tập</div>
                        <h3 className="book-name-title" title={book.bookname}>{book.bookname}</h3>
                        <p className="book-author-text">Tác giả: {book.author}</p>
                        
                        <div className="book-card-actions">
                          {book.pdfUrl ? (
                            <a 
                              href={getAbsoluteUrl(book.pdfUrl)} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="student-read-btn"
                            >
                              <FileText size={18} /> Đọc ngay
                            </a>
                          ) : (
                            <div className="student-read-btn disabled">
                              <X size={18} /> Chưa có PDF
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
        </div>
    );
};

export default StudentLibrary;
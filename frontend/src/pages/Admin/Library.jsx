import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  Book as BookIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  FileText, 
  Upload, 
  AlertCircle, 
  X,
  BookOpen,
  Image as ImageIcon
} from "lucide-react";
import { BASE_URL } from "../../api/config";
import "./Library.css";

const Library = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newBook, setNewBook] = useState({ bookname: '', author: '', pdfUrl: '', coverUrl: '' });
    const [editingBook, setEditingBook] = useState(null);
    const [editForm, setEditForm] = useState({ bookname: '', author: '', pdfUrl: '', coverUrl: '' });
    
    const pdfInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const editPdfInputRef = useRef(null);
    const editCoverInputRef = useRef(null);

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
            setError("Không thể tải danh sách sách.");
            setLoading(false);
        }
    };

    const handleFileUpload = async (e, type, mode = 'new') => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${BASE_URL}/api/v1/files/upload`, formData);
            const fileUrl = response.data.fileUrl;
            
            if (mode === 'new') {
              setNewBook(prev => ({ ...prev, [type === 'pdf' ? 'pdfUrl' : 'coverUrl']: fileUrl }));
            } else {
              setEditForm(prev => ({ ...prev, [type === 'pdf' ? 'pdfUrl' : 'coverUrl']: fileUrl }));
            }
            alert(`Tải lên ${type.toUpperCase()} thành công!`);
        } catch (error) {
            console.error("Error uploading: ", error);
            alert("Lỗi khi tải lên tệp.");
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/v1/library`, newBook);
            fetchBooks();
            setNewBook({ bookname: '', author: '', pdfUrl: '', coverUrl: '' });
            alert("Thêm sách thành công!");
        } catch (error) {
            console.error("Error adding book: ", error);
            alert("Lỗi khi thêm sách.");
        }
    };

    const handleDeleteBook = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
            try {
                await axios.delete(`${BASE_URL}/api/v1/library/${id}`);
                fetchBooks();
            } catch (error) {
                console.error("Error deleting book: ", error);
            }
        }
    };

    const handleUpdateBook = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/api/v1/library/${editingBook}`, editForm);
            fetchBooks();
            setEditingBook(null);
            alert("Cập nhật sách thành công!");
        } catch (error) {
            console.error("Error updating book: ", error);
            alert("Lỗi khi cập nhật sách.");
        }
    };

    const startEdit = (book) => {
        setEditingBook(book.id || book._id);
        setEditForm({
            bookname: book.bookname,
            author: book.author,
            pdfUrl: book.pdfUrl || '',
            coverUrl: book.coverUrl || ''
        });
    };

    const getAbsoluteUrl = (url) => {
        if (!url) return "";
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return (
        <div className="admin-library-page">
            <div className="library-header">
                <h1><BookIcon size={32} color="#0ea5e9" /> Quản lý Thư viện</h1>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Tổng cộng: {books.length} đầu sách
                </div>
            </div>

            {/* Form Section */}
            <div className="book-form-card">
              <h2>Thêm sách mới</h2>
              <form onSubmit={handleAddBook}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tên sách</label>
                    <input
                      className="form-control"
                      placeholder="VD: Giải tích 12"
                      value={newBook.bookname}
                      onChange={(e) => setNewBook({ ...newBook, bookname: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tác giả</label>
                    <input
                      className="form-control"
                      placeholder="VD: Ngô Bảo Châu"
                      value={newBook.author}
                      onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tài liệu (PDF & Ảnh bìa)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        type="button" 
                        onClick={() => pdfInputRef.current.click()}
                        className={`action-btn ${newBook.pdfUrl ? 'edit-btn' : ''}`}
                        title="Tải lên PDF"
                        style={{ flex: 1, justifyContent: 'center', height: '44px' }}
                      >
                        <FileText size={18} /> {newBook.pdfUrl ? 'Đã có PDF' : 'PDF'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => coverInputRef.current.click()}
                        className={`action-btn ${newBook.coverUrl ? 'edit-btn' : ''}`}
                        title="Tải lên Ảnh bìa"
                        style={{ flex: 1, justifyContent: 'center', height: '44px' }}
                      >
                        <ImageIcon size={18} /> {newBook.coverUrl ? 'Đã có Ảnh' : 'Bìa'}
                      </button>
                    </div>
                    <input type="file" ref={pdfInputRef} style={{ display: 'none' }} accept=".pdf" onChange={(e) => handleFileUpload(e, 'pdf', 'new')} />
                    <input type="file" ref={coverInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'cover', 'new')} />
                  </div>
                </div>
                <button type="submit" className="submit-btn">
                  <Plus size={18} /> Thêm vào thư viện
                </button>
              </form>
            </div>

            {/* List Section */}
            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Đang tải danh sách...</p>
              </div>
            ) : (
              <div className="books-grid">
                {books.length === 0 && (
                  <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                    <BookIcon size={64} />
                    <h3>Thư viện trống</h3>
                  </div>
                )}
                {books.map((book) => (
                  <div key={book.id || book._id} className="book-card">
                    {book.coverUrl ? (
                      <img src={getAbsoluteUrl(book.coverUrl)} alt={book.bookname} className="book-cover" />
                    ) : (
                      <div className="book-cover-placeholder">
                        <BookOpen size={48} />
                        <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Digital Library</div>
                      </div>
                    )}
                    <div className="book-name" title={book.bookname}>{book.bookname}</div>
                    <div className="book-author">Tác giả: {book.author}</div>
                    
                    <div className="book-actions">
                      {book.pdfUrl ? (
                        <a 
                          href={getAbsoluteUrl(book.pdfUrl)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="read-btn"
                        >
                          <BookOpen size={16} /> Đọc sách
                        </a>
                      ) : (
                        <div className="read-btn" style={{ background: '#cbd5e1', cursor: 'not-allowed' }}>
                          <X size={16} /> No PDF
                        </div>
                      )}
                      
                      <button className="icon-btn edit-btn" onClick={() => startEdit(book)}>
                        <Edit3 size={18} />
                      </button>
                      <button className="icon-btn delete-btn" onClick={() => handleDeleteBook(book.id || book._id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Edit Modal */}
            {editingBook && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2>Chỉnh sửa sách</h2>
                    <button onClick={() => setEditingBook(null)} className="icon-btn" style={{ border: 'none' }}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleUpdateBook}>
                    <div className="form-group">
                      <label>Tên sách</label>
                      <input className="form-control" value={editForm.bookname} onChange={(e) => setEditForm({ ...editForm, bookname: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Tác giả</label>
                      <input className="form-control" value={editForm.author} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Cập nhật tài liệu</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" onClick={() => editPdfInputRef.current.click()} className="action-btn" style={{ flex: 1, justifyContent: 'center' }}>
                          <FileText size={16} /> Update PDF
                        </button>
                        <button type="button" onClick={() => editCoverInputRef.current.click()} className="action-btn" style={{ flex: 1, justifyContent: 'center' }}>
                          <ImageIcon size={16} /> Update Bìa
                        </button>
                      </div>
                      <input type="file" ref={editPdfInputRef} style={{ display: 'none' }} accept=".pdf" onChange={(e) => handleFileUpload(e, 'pdf', 'edit')} />
                      <input type="file" ref={editCoverInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'cover', 'edit')} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                      <button type="submit" className="submit-btn" style={{ flex: 1 }}>Lưu</button>
                      <button type="button" className="action-btn cancel-btn" style={{ flex: 1 }} onClick={() => setEditingBook(null)}>Hủy</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
        </div>
    );
};

export default Library;
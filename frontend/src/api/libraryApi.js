import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/api/v1/library`;

// Get all books
export const getAllBooks = async () => {
    const response = await axios.get(`${API_URL}/getall`);
    return response.data.books || [];
};

// Get book by ID
export const getBookById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Create new book
export const createBook = async (bookData) => {
    const response = await axios.post(API_URL, bookData);
    return response.data;
};

// Update book - backend chưa có, dùng tạm
export const updateBook = async (id, bookData) => {
    const response = await axios.put(`${API_URL}/${id}`, bookData);
    return response.data;
};

// Delete book - backend chưa có, dùng tạm  
export const deleteBook = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

// Borrow book - backend chưa có API này
export const borrowBook = async (bookId, studentId) => {
    console.warn("Borrow book API not implemented in backend");
    return { success: true, message: "Mock borrow" };
};

// Return book - backend chưa có API này
export const returnBook = async (bookId, studentId) => {
    console.warn("Return book API not implemented in backend");
    return { success: true, message: "Mock return" };
};

// Get borrowed books by student - backend chưa có API này
export const getBorrowedBooksByStudent = async (studentId) => {
    console.warn("Borrowed books API not implemented in backend");
    return [];
};

// Search books - client-side filter
export const searchBooks = async (query) => {
    const books = await getAllBooks();
    if (!query) return books;
    return books.filter(b => 
        b.bookname?.toLowerCase().includes(query.toLowerCase()) ||
        b.author?.toLowerCase().includes(query.toLowerCase())
    );
};

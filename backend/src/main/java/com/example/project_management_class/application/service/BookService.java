package com.example.project_management_class.application.service;

import com.example.project_management_class.domain.model.Book;
import java.util.List;

public interface BookService {
    Book addBook(Book book);
    List<Book> getAllBooks();
    Book updateBook(String id, Book book);
    void deleteBook(String id);
}

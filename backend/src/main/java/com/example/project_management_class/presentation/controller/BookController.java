package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.service.BookService;
import com.example.project_management_class.domain.model.Book;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/library")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addBook(@RequestBody Book book) {
        bookService.addBook(book);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Book Created!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getall")
    public ResponseEntity<Map<String, Object>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("books", books);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateBook(@PathVariable String id, @RequestBody Book book) {
        bookService.updateBook(id, book);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Book Updated!");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteBook(@PathVariable String id) {
        bookService.deleteBook(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Book Deleted!");
        return ResponseEntity.ok(response);
    }
}

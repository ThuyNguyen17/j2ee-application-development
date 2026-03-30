package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "library")
public class Book {
    @Id
    private String id;
    private String bookname;
    private String author;
    private String pdfUrl;
    private String coverUrl;
}

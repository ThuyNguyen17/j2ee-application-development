package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "academic_years")
@Data
public class AcademicYear {

    @Id
    private String id;

    private String name;        // 2024-2025
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;     // năm học hiện tại
}
package com.example.project_management_class.domain.model;

import com.example.project_management_class.domain.enums.ScoreType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ScoreItem {

    private ScoreType type;     // ORAL | QUIZ | MIDTERM | FINAL
    private Double value;
    private Double weight;
    private LocalDate date;
}
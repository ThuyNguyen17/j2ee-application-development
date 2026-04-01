package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.dto.TimetableResponseDTO;
import com.example.project_management_class.application.service.TimetableService;
import com.example.project_management_class.domain.model.SchoolClass;
import com.example.project_management_class.domain.repository.SchoolClassRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
@CrossOrigin
public class ClassTimetableController {

    private final TimetableService timetableService;
    private final SchoolClassRepository schoolClassRepository;

    @GetMapping("/{classIdentifier}/timetable")
    public ResponseEntity<List<TimetableResponseDTO>> getClassTimetable(
            @PathVariable String classIdentifier,
            @RequestParam int week,
            @RequestParam int year,
            @RequestParam int semester
    ) {
        log.info("Fetching timetable for class identifier: {}, week: {}, year: {}, semester: {}", classIdentifier, week, year, semester);
        try {
            String className = classIdentifier;
            
            // If classIdentifier looks like ObjectId (24 chars), try to find class by ID first
            if (classIdentifier.length() == 24) {
                Optional<SchoolClass> schoolClassOpt = schoolClassRepository.findById(classIdentifier);
                if (schoolClassOpt.isPresent()) {
                    SchoolClass schoolClass = schoolClassOpt.get();
                    className = schoolClass.getGradeLevel() + schoolClass.getClassName();
                    log.info("Resolved ObjectId {} to className: {}", classIdentifier, className);
                } else {
                    log.warn("Could not find class with ObjectId: {}, using as className", classIdentifier);
                }
            }
            
            List<TimetableResponseDTO> result = timetableService.getClassTimetable(className, week, year, semester);
            log.info("Found {} timetable entries for class: {}", result.size(), className);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching timetable for class {}: {}", classIdentifier, e.getMessage(), e);
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }
}


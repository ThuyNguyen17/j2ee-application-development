package com.example.project_management_class.application.service;

import com.example.project_management_class.domain.model.SchoolClass;
import java.util.List;

public interface SchoolClassService {
    void addClass(SchoolClass schoolClass);
    List<SchoolClass> getAllClasses();
    void deleteClass(String id);
    SchoolClass updateClass(String id, SchoolClass schoolClass);
}

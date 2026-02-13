package com.example.project_management_class.infrastructure.config;

import com.example.project_management_class.domain.enums.DayOfWeek;
import com.example.project_management_class.domain.model.TeachingAssignment;
import com.example.project_management_class.domain.model.Timetable;
import com.example.project_management_class.domain.repository.TeachingAssignmentRepository;
import com.example.project_management_class.domain.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TimetableRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            Timetable tt1 = Timetable.builder()
                    .teachingAssignmentId("698ed7405104054d9773da30")
                    .week(3)
                    .dayOfWeek(DayOfWeek.MONDAY) // ✅ sửa ở đây
                    .period(1)
                    .room("L2-03")
                    .note("")
                    .build();

            repository.save(tt1);
            System.out.println("Seed dữ liệu TeachingAssignment thành công!");
        }
    }
}

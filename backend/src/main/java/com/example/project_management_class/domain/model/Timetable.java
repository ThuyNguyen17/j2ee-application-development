package com.example.project_management_class.domain.model;

import com.example.project_management_class.domain.enums.DayOfWeek;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "timetables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Timetable {
    @Id
    private String id;
    private String teachingAssignmentId;
    private int week;            // optional (chỉ để hiển thị nếu cần)
    private DayOfWeek dayOfWeek; // thứ trong tuần
    private int period;          // tiết
    private String room;
    private String note;
    private LocalDate actualDate; // 🔥 QUAN TRỌNG NHẤT
}
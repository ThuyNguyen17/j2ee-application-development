package com.example.project_management_class.domain.model;

import com.example.project_management_class.domain.enums.DayOfWeek;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private int week;            // Tuần thứ bao nhiêu (1-35)
    private DayOfWeek dayOfWeek; // Enum
    private int period;          // Tiết số (1-10)
    private String room;
    private String note;         // Dạy bù, đổi phòng, nghỉ lễ...
}

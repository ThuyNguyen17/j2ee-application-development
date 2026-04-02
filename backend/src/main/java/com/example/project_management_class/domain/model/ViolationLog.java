package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "violation_logs")
public class ViolationLog {
    @Id
    private String id;
    private String userId;
    private String assignmentId;
    private String violationType; // TAB_SWITCH, DEVTOOLS_OPEN, COPY_PASTE, FULLSCREEN_EXIT
    private String details;
    private LocalDateTime timestamp;
}

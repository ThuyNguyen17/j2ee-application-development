package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "events")
public class Event {
    @Id
    private String id;
    
    // Basic information
    private String title;
    private String description;
    private String events; // Keep for backward compatibility
    
    // Date and time
    private LocalDate date;
    private String startTime;
    private String endTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Location and organizer
    private String location;
    private String organizer;
    private String organizerId; // ID of who created the event
    
    // Event categorization
    private String eventType; // academic, cultural, sports, meeting, other
    private String targetAudience; // all, students, teachers
    
    // Event status
    private String status; // DRAFT, PUBLISHED, CANCELLED, COMPLETED
    private boolean isActive = true;
    
    // Additional fields
    private String notes;
    private Integer maxParticipants;
    private Integer currentParticipants = 0;
    
    // For backward compatibility
    public String getDisplayTitle() {
        return title != null ? title : events;
    }
    
    public void setDisplayTitle(String title) {
        this.title = title;
        this.events = title; // Keep both in sync for compatibility
    }
}

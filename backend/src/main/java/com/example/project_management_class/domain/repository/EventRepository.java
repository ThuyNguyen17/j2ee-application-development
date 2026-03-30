package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    
    // Find active events
    List<Event> findByIsActiveTrueOrderByDateAsc();
    
    // Find events by type
    List<Event> findByEventTypeAndIsActiveTrueOrderByDateAsc(String eventType);
    
    // Find events by target audience
    List<Event> findByTargetAudienceAndIsActiveTrueOrderByDateAsc(String targetAudience);
    
    // Find events by multiple audiences
    List<Event> findByTargetAudienceInAndIsActiveTrueOrderByDateAsc(List<String> audiences);
    
    // Find events by status
    List<Event> findByStatusOrderByDateAsc(String status);
    
    // Find events by organizer
    List<Event> findByOrganizerIdOrderByDateAsc(String organizerId);
    
    // Find events by date range
    List<Event> findByDateBetweenOrderByDateAsc(java.time.LocalDate startDate, java.time.LocalDate endDate);
}

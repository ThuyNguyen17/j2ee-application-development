package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.service.EventService;
import com.example.project_management_class.application.service.NotificationService;
import com.example.project_management_class.domain.model.Event;
import com.example.project_management_class.domain.model.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;
    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addEvent(@RequestBody Event event) {
        // Set timestamps and default values
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        if (event.getStatus() == null) {
            event.setStatus("PUBLISHED");
        }
        
        // For backward compatibility
        if (event.getTitle() != null && event.getEvents() == null) {
            event.setEvents(event.getTitle());
        }
        
        Event savedEvent = eventService.addEvent(event);
        
        // Auto-create notification based on target audience
        createNotificationForEvent(savedEvent);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Event Created!");
        response.put("event", savedEvent);
        return ResponseEntity.ok(response);
    }
    
    private void createNotificationForEvent(Event event) {
        String targetAudience = event.getTargetAudience();
        if (targetAudience == null || targetAudience.isEmpty()) {
            targetAudience = "all";
        }
        
        // Determine target role for notification
        String targetRole;
        switch (targetAudience.toLowerCase()) {
            case "teachers":
                targetRole = "TEACHER";
                break;
            case "students":
                targetRole = "STUDENT";
                break;
            case "all":
            default:
                targetRole = "ALL";
                break;
        }
        
        // Create notification
        Notification notification = new Notification();
        notification.setTitle("Sự kiện mới: " + event.getTitle());
        notification.setContent("Thông báo về sự kiện: " + event.getTitle() + 
            "\nThời gian: " + (event.getDate() != null ? event.getDate() : "Chưa xác định") +
            "\nĐịa điểm: " + (event.getLocation() != null ? event.getLocation() : "Chưa xác định") +
            "\nMô tả: " + (event.getDescription() != null ? event.getDescription() : "Không có mô tả"));
        notification.setTargetRole(targetRole);
        notification.setClassId(null); // Events are general, not class-specific
        notification.setAcademicYearId(null);
        
        notificationService.createNotification(notification);
    }

    @GetMapping("/getall")
    public ResponseEntity<Map<String, Object>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("events", events);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getEventById(@PathVariable String id) {
        Event event = eventService.getEventById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("event", event);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateEvent(@PathVariable String id, @RequestBody Event event) {
        event.setId(id);
        event.setUpdatedAt(LocalDateTime.now());
        
        // For backward compatibility
        if (event.getTitle() != null && event.getEvents() == null) {
            event.setEvents(event.getTitle());
        }
        
        Event updatedEvent = eventService.updateEvent(event);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Event Updated!");
        response.put("event", updatedEvent);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Event Deleted!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveEvents() {
        List<Event> events = eventService.getActiveEvents();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("events", events);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type/{eventType}")
    public ResponseEntity<Map<String, Object>> getEventsByType(@PathVariable String eventType) {
        List<Event> events = eventService.getEventsByType(eventType);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("events", events);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/audience/{targetAudience}")
    public ResponseEntity<Map<String, Object>> getEventsByAudience(@PathVariable String targetAudience) {
        // Build list of potential matches for the audience
        List<String> audiences = new java.util.ArrayList<>(java.util.Arrays.asList("all", "All", "ALL"));
        String lCase = targetAudience.toLowerCase();
        audiences.add(lCase);
        audiences.add(targetAudience.toUpperCase());
        audiences.add(lCase.substring(0, 1).toUpperCase() + lCase.substring(1));
        
        // Handle common plural/singular variants
        if (lCase.endsWith("s")) {
            audiences.add(lCase.substring(0, lCase.length() - 1));
        } else {
            audiences.add(lCase + "s");
        }
        
        List<Event> events = eventService.getEventsByAudiences(audiences);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("events", events);
        return ResponseEntity.ok(response);
    }
}

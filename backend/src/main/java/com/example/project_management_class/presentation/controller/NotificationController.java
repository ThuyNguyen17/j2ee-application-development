package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.service.NotificationService;
import com.example.project_management_class.domain.model.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {
    
    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createNotification(@RequestBody Notification notification) {
        notificationService.createNotification(notification);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Notification created successfully!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getall")
    public ResponseEntity<Map<String, Object>> getAllNotifications() {
        List<Notification> notifications = notificationService.getAllNotifications();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("notifications", notifications);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/role/{targetRole}")
    public ResponseEntity<Map<String, Object>> getNotificationsByRole(@PathVariable String targetRole) {
        List<Notification> notifications = notificationService.getNotificationsByRole(targetRole);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("notifications", notifications);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<Map<String, Object>> getNotificationsByClass(@PathVariable String classId) {
        List<Notification> notifications = notificationService.getNotificationsByClass(classId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("notifications", notifications);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/class/{classId}/role/{targetRole}")
    public ResponseEntity<Map<String, Object>> getNotificationsByClassAndRole(
            @PathVariable String classId, 
            @PathVariable String targetRole) {
        List<Notification> notifications = notificationService.getNotificationsByClassAndRole(classId, targetRole);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("notifications", notifications);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNotification(@PathVariable String id) {
        notificationService.deleteNotification(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Notification deleted successfully!");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateNotification(@PathVariable String id, @RequestBody Notification notification) {
        Notification updatedNotification = notificationService.updateNotification(id, notification);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Notification updated successfully!");
        response.put("notification", updatedNotification);
        return ResponseEntity.ok(response);
    }
}

package com.example.project_management_class.application.service;

import com.example.project_management_class.domain.model.Notification;

import java.util.List;

public interface NotificationService {
    void createNotification(Notification notification);
    List<Notification> getAllNotifications();
    List<Notification> getNotificationsByRole(String targetRole);
    List<Notification> getNotificationsByClass(String classId);
    List<Notification> getNotificationsByClassAndRole(String classId, String targetRole);
    void deleteNotification(String id);
    Notification updateNotification(String id, Notification notification);
}

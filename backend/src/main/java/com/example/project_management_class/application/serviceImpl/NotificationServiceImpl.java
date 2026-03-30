package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.NotificationService;
import com.example.project_management_class.domain.model.Notification;
import com.example.project_management_class.domain.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    
    private final NotificationRepository notificationRepository;

    @Override
    public void createNotification(Notification notification) {
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public List<Notification> getNotificationsByRole(String targetRole) {
        return notificationRepository.findByTargetRoleOrAll(targetRole);
    }

    @Override
    public List<Notification> getNotificationsByClass(String classId) {
        return notificationRepository.findByClassId(classId);
    }

    @Override
    public List<Notification> getNotificationsByClassAndRole(String classId, String targetRole) {
        return notificationRepository.findByClassIdAndTargetRole(classId, targetRole);
    }

    @Override
    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }

    @Override
    public Notification updateNotification(String id, Notification notification) {
        notification.setId(id);
        return notificationRepository.save(notification);
    }
}

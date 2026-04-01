package com.example.project_management_class.application.service;

import com.example.project_management_class.domain.model.Announcement;
import java.util.List;

public interface AnnouncementService {
    void addAnnouncement(Announcement announcement);
    List<Announcement> getAllAnnouncements();
    List<Announcement> getAnnouncementsByAudiences(List<String> audiences);
    
    // Merged from NotificationService
    void createAnnouncement(Announcement announcement);
    List<Announcement> getAnnouncementsByRole(String targetRole);
    List<Announcement> getAnnouncementsByClass(String classId);
    List<Announcement> getAnnouncementsByClassAndRole(String classId, String targetRole);
    
    void deleteAnnouncement(String id);
    Announcement updateAnnouncement(String id, Announcement announcement);
}

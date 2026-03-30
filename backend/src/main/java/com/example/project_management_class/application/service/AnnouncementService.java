package com.example.project_management_class.application.service;

import com.example.project_management_class.domain.model.Announcement;
import java.util.List;

public interface AnnouncementService {
    void addAnnouncement(Announcement announcement);
    List<Announcement> getAllAnnouncements();
    List<Announcement> getAnnouncementsByAudiences(List<String> audiences);
    void deleteAnnouncement(String id);
    Announcement updateAnnouncement(String id, Announcement announcement);
}

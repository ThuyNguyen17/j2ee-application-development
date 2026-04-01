package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.AnnouncementService;
import com.example.project_management_class.domain.model.Announcement;
import com.example.project_management_class.domain.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {
    private final AnnouncementRepository announcementRepository;

    @Override
    public void addAnnouncement(Announcement announcement) {
        announcementRepository.save(announcement);
    }

    @Override
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    @Override
    public List<Announcement> getAnnouncementsByAudiences(List<String> audiences) {
        return announcementRepository.findByTargetAudienceIn(audiences);
    }

    // Merged from NotificationService
    @Override
    public void createAnnouncement(Announcement announcement) {
        announcement.setCreatedAt(LocalDateTime.now());
        announcementRepository.save(announcement);
    }

    @Override
    public List<Announcement> getAnnouncementsByRole(String targetRole) {
        return announcementRepository.findByTargetRoleOrAll(targetRole);
    }

    @Override
    public List<Announcement> getAnnouncementsByClass(String classId) {
        return announcementRepository.findByClassId(classId);
    }

    @Override
    public List<Announcement> getAnnouncementsByClassAndRole(String classId, String targetRole) {
        return announcementRepository.findByClassIdAndTargetRole(classId, targetRole);
    }

    @Override
    public void deleteAnnouncement(String id) {
        announcementRepository.deleteById(id);
    }

    @Override
    public Announcement updateAnnouncement(String id, Announcement announcement) {
        announcement.setId(id);
        return announcementRepository.save(announcement);
    }
}

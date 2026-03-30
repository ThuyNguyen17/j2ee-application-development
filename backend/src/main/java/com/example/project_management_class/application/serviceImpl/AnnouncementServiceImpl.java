package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.AnnouncementService;
import com.example.project_management_class.domain.model.Announcement;
import com.example.project_management_class.domain.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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

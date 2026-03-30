package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.Announcement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends MongoRepository<Announcement, String> {
    List<Announcement> findByTargetAudienceIn(List<String> audiences);
}

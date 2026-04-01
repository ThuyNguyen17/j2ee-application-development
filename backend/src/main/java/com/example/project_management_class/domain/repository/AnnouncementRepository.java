package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.Announcement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends MongoRepository<Announcement, String> {
    List<Announcement> findByTargetAudienceIn(List<String> audiences);
    
    // Methods from Notification (merged)
    @Query("{ 'targetRole': ?0 }")
    List<Announcement> findByTargetRole(String targetRole);
    
    @Query("{ 'classId': ?0 }")
    List<Announcement> findByClassId(String classId);
    
    @Query("{ '$or': [ { 'targetRole': ?0 }, { 'targetRole': 'ALL' } ] }")
    List<Announcement> findByTargetRoleOrAll(String targetRole);
    
    @Query("{ '$and': [ { 'classId': ?0 }, { '$or': [ { 'targetRole': ?1 }, { 'targetRole': 'ALL' } ] } ] }")
    List<Announcement> findByClassIdAndTargetRole(String classId, String targetRole);
}

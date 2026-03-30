package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    
    @Query("{ 'targetRole': ?0 }")
    List<Notification> findByTargetRole(String targetRole);
    
    @Query("{ 'classId': ?0 }")
    List<Notification> findByClassId(String classId);
    
    @Query("{ '$or': [ { 'targetRole': ?0 }, { 'targetRole': 'ALL' } ] }")
    List<Notification> findByTargetRoleOrAll(String targetRole);
    
    @Query("{ '$and': [ { 'classId': ?0 }, { '$or': [ { 'targetRole': ?1 }, { 'targetRole': 'ALL' } ] } ] }")
    List<Notification> findByClassIdAndTargetRole(String classId, String targetRole);
}

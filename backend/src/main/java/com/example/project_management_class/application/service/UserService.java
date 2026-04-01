package com.example.project_management_class.application.service;

import com.example.project_management_class.domain.model.User;

public interface UserService {
    User registerAdmin(User user);
    User updateUser(String id, User user);
}

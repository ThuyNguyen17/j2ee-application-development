package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.UserService;
import com.example.project_management_class.domain.enums.Role;
import com.example.project_management_class.domain.model.User;
import com.example.project_management_class.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public User registerAdmin(User user) {
        if(userRepository.findByUsername(user.getUsername()).isPresent()){
            throw new RuntimeException("User already exists!");
        }
        user.setRole(Role.ADMIN);
        user.setActive(true);
        return userRepository.save(user);
    }

    @Override
    public User updateUser(String id, User user) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getUsername() != null && !user.getUsername().trim().isEmpty()) {
            existing.setUsername(user.getUsername());
        }

        // Keep old password if password is null/empty (frontend sends empty string when "optional")
        if (user.getPassword() != null && !user.getPassword().trim().isEmpty()) {
            existing.setPassword(user.getPassword());
        }

        return userRepository.save(existing);
    }
}

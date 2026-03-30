package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.service.UserService;
import com.example.project_management_class.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;

    @PostMapping("/register-admin")
    public ResponseEntity<Map<String, Object>> registerAdmin(@RequestBody User user) {
        try {
            userService.registerAdmin(user);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin Registered successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable String id,
            @RequestBody User user
    ) {
        try {
            User updated = userService.updateUser(id, user);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User Updated!");
            response.put("user", updated);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Update failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

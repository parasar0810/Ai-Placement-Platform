package com.placement.platform.controller;

import com.placement.platform.domain.Profile;
import com.placement.platform.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<Profile> getProfile(Authentication authentication) {
        return ResponseEntity.ok(studentService.getProfile(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<Profile> updateProfile(
            Authentication authentication,
            @RequestBody Profile profile) {
        return ResponseEntity.ok(studentService.updateProfile(authentication.getName(), profile));
    }
}

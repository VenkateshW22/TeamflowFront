package com.teamflow.controller;

import com.teamflow.dto.AuthRequest;
import com.teamflow.dto.AuthResponse;
import com.teamflow.dto.SignupRequest;
import com.teamflow.model.User;
import com.teamflow.service.AuthService;
import com.teamflow.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashSet;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody AuthRequest authRequest) {
        AuthResponse response = authService.authenticate(authRequest.getUsername(), authRequest.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(signupRequest.getPassword());
        user.setRoles(new HashSet<>(Arrays.asList("ROLE_MEMBER")));

        User savedUser = userService.createUser(user);
        AuthResponse response = authService.authenticate(signupRequest.getUsername(), signupRequest.getPassword());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(currentUser);
    }
} 
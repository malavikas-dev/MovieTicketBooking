package com.movieticket.booking.controller;

import com.movieticket.booking.entity.User;
import com.movieticket.booking.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {

        User savedUser = authService.register(user);

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Registration successful");
        response.put("userId", savedUser.getId());
        response.put("name", savedUser.getName());

        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        User user = authService.login(email, password);

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login successful");
        response.put("userId", user.getId());
        response.put("name", user.getName());
        response.put("token", "demo-token-" + user.getId());

        return response;
    }
}
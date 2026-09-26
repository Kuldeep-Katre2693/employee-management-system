package com.kuldeep.ems.controller;

import com.kuldeep.ems.dto.AuthRequest;
import com.kuldeep.ems.dto.AuthResponse;
import com.kuldeep.ems.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody AuthRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }
}
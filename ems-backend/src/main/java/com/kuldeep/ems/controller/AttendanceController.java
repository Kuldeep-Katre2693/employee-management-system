package com.kuldeep.ems.controller;

import com.kuldeep.ems.dto.AttendanceResponse;
import com.kuldeep.ems.entity.AttendanceStatus;
import com.kuldeep.ems.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService) {

        this.attendanceService = attendanceService;
    }

    @PostMapping("/mark")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<AttendanceResponse> markAttendance(
            @RequestParam AttendanceStatus status,
            Authentication authentication) {

        return ResponseEntity.ok(
                AttendanceResponse.from(
                        attendanceService.markAttendance(
                                authentication.getName(),
                                status
                        )
                )
        );
    }

    @PutMapping("/checkout")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<AttendanceResponse> checkOut(
            Authentication authentication) {

        return ResponseEntity.ok(
                AttendanceResponse.from(
                        attendanceService.checkOut(
                                authentication.getName()
                        )
                )
        );
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<AttendanceResponse>> getMyAttendance(
            Authentication authentication) {

        return ResponseEntity.ok(
                attendanceService
                        .getEmployeeAttendance(authentication.getName())
                        .stream()
                        .map(AttendanceResponse::from)
                        .toList()
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<AttendanceResponse>> getAllAttendance() {

        return ResponseEntity.ok(
                attendanceService
                        .getAllAttendance()
                        .stream()
                        .map(AttendanceResponse::from)
                        .toList()
        );
    }
}
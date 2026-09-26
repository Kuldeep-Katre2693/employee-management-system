package com.kuldeep.ems.controller;

import com.kuldeep.ems.entity.Attendance;
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
    public ResponseEntity<Attendance> markAttendance(
            @RequestParam AttendanceStatus status,
            Authentication authentication) {

        return ResponseEntity.ok(
                attendanceService.markAttendance(
                        authentication.getName(),
                        status
                )
        );
    }

    @PutMapping("/checkout")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Attendance> checkOut(
            Authentication authentication) {

        return ResponseEntity.ok(
                attendanceService.checkOut(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<Attendance>> getMyAttendance(
            Authentication authentication) {

        return ResponseEntity.ok(
                attendanceService.getEmployeeAttendance(
                        authentication.getName()
                )
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<Attendance>> getAllAttendance() {

        return ResponseEntity.ok(
                attendanceService.getAllAttendance()
        );
    }
}
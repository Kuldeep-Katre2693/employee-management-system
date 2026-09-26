package com.kuldeep.ems.controller;

import com.kuldeep.ems.entity.LeaveRequest;
import com.kuldeep.ems.service.LeaveRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(
            LeaveRequestService leaveRequestService) {

        this.leaveRequestService = leaveRequestService;
    }

   @PostMapping
@PreAuthorize("hasRole('EMPLOYEE')")
public ResponseEntity<LeaveRequest> applyLeave(
        @RequestBody LeaveRequest leaveRequest,
        org.springframework.security.core.Authentication authentication) {

    String username = authentication.getName();

    return ResponseEntity.ok(
            leaveRequestService.applyLeave(
                    username,
                    leaveRequest
            )
    );
}

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<LeaveRequest>> getAllLeaves() {

        return ResponseEntity.ok(
                leaveRequestService.getAllLeaves()
        );
    }

    @GetMapping("/my")
@PreAuthorize("hasRole('EMPLOYEE')")
public ResponseEntity<List<LeaveRequest>> getMyLeaves(
        Authentication authentication) {

    String username = authentication.getName();

    return ResponseEntity.ok(
            leaveRequestService.getMyLeaves(username)
    );
}

    @GetMapping("/employee/{employeeId}")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")    public ResponseEntity<List<LeaveRequest>> getEmployeeLeaves(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                leaveRequestService
                        .getEmployeeLeaves(employeeId)
        );
    }

    @PutMapping("/{leaveId}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<LeaveRequest> approveLeave(
            @PathVariable Long leaveId) {

        return ResponseEntity.ok(
                leaveRequestService.approveLeave(leaveId)
        );
    }

    @PutMapping("/{leaveId}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<LeaveRequest> rejectLeave(
            @PathVariable Long leaveId) {

        return ResponseEntity.ok(
                leaveRequestService.rejectLeave(leaveId)
        );
    }
}
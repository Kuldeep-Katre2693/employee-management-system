package com.kuldeep.ems.controller;

import com.kuldeep.ems.entity.LeaveRequest;
import com.kuldeep.ems.service.LeaveRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.kuldeep.ems.dto.LeaveResponse;

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
public ResponseEntity<LeaveResponse> applyLeave(
        @RequestBody LeaveRequest leaveRequest,
        org.springframework.security.core.Authentication authentication) {

    String username = authentication.getName();

    return ResponseEntity.ok(
            LeaveResponse.from(leaveRequestService.applyLeave(
                username,
                leaveRequest
            ))
    );
}

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<LeaveResponse>> getAllLeaves() {

        return ResponseEntity.ok(
            leaveRequestService.getAllLeaves()
                .stream()
                .map(LeaveResponse::from)
                .toList()
        );
    }

    @GetMapping("/my")
@PreAuthorize("hasRole('EMPLOYEE')")
public ResponseEntity<List<LeaveResponse>> getMyLeaves(
        Authentication authentication) {

    String username = authentication.getName();

    return ResponseEntity.ok(
        leaveRequestService.getMyLeaves(username)
            .stream()
            .map(LeaveResponse::from)
            .toList()
    );
}

    @GetMapping("/employee/{employeeId}")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
 public ResponseEntity<List<LeaveResponse>> getEmployeeLeaves(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
            leaveRequestService.getEmployeeLeaves(employeeId)
                .stream()
                .map(LeaveResponse::from)
                .toList()
        );
    }

    @PutMapping("/{leaveId}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<LeaveResponse> approveLeave(
            @PathVariable Long leaveId) {

        return ResponseEntity.ok(
            LeaveResponse.from(leaveRequestService.approveLeave(leaveId))
        );
    }

    @PutMapping("/{leaveId}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<LeaveResponse> rejectLeave(
            @PathVariable Long leaveId) {

            return ResponseEntity.ok(
                LeaveResponse.from(leaveRequestService.rejectLeave(leaveId))
            );
    }
}
package com.kuldeep.ems.controller;

import com.kuldeep.ems.dto.PayrollResponse;
import com.kuldeep.ems.service.PayrollService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @PostMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PayrollResponse> createPayroll(
            @PathVariable Long employeeId,
            @RequestParam String payrollMonth,
            @RequestParam BigDecimal basicSalary,
            @RequestParam BigDecimal allowance,
            @RequestParam BigDecimal deduction) {

        return ResponseEntity.ok(
                PayrollResponse.from(
                        payrollService.createPayroll(
                                employeeId,
                                payrollMonth,
                                basicSalary,
                                allowance,
                                deduction
                        )
                )
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<PayrollResponse>> getAllPayrolls() {

        return ResponseEntity.ok(
                payrollService.getAllPayrolls()
                        .stream()
                        .map(PayrollResponse::from)
                        .toList()
        );
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<PayrollResponse>> getEmployeePayrolls(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                payrollService.getEmployeePayrolls(employeeId)
                        .stream()
                        .map(PayrollResponse::from)
                        .toList()
        );
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<PayrollResponse>> getMyPayrolls(
            Authentication authentication) {

        return ResponseEntity.ok(
                payrollService.getMyPayrolls(authentication.getName())
                        .stream()
                        .map(PayrollResponse::from)
                        .toList()
        );
    }

    @PutMapping("/{payrollId}/pay")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PayrollResponse> markAsPaid(
            @PathVariable Long payrollId) {

        return ResponseEntity.ok(
                PayrollResponse.from(
                        payrollService.markAsPaid(payrollId)
                )
        );
    }
}
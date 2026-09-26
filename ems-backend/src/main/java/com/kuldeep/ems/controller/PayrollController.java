package com.kuldeep.ems.controller;

import com.kuldeep.ems.entity.Payroll;
import com.kuldeep.ems.service.PayrollService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Payroll> createPayroll(
            @PathVariable Long employeeId,
            @RequestParam String payrollMonth,
            @RequestParam Double basicSalary,
            @RequestParam Double allowance,
            @RequestParam Double deduction) {

        return ResponseEntity.ok(
                payrollService.createPayroll(
                        employeeId,
                        payrollMonth,
                        basicSalary,
                        allowance,
                        deduction
                )
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<Payroll>> getAllPayrolls() {

        return ResponseEntity.ok(
                payrollService.getAllPayrolls()
        );
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<Payroll>> getEmployeePayrolls(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                payrollService.getEmployeePayrolls(employeeId)
        );
    }

    @PutMapping("/{payrollId}/pay")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Payroll> markAsPaid(
            @PathVariable Long payrollId) {

        return ResponseEntity.ok(
                payrollService.markAsPaid(payrollId)
        );
    }
    
    @GetMapping("/my")
@PreAuthorize("hasRole('EMPLOYEE')")
public ResponseEntity<List<Payroll>> getMyPayrolls(
        org.springframework.security.core.Authentication authentication) {

    return ResponseEntity.ok(
            payrollService.getMyPayrolls(
                    authentication.getName()
            )
    );
}
}
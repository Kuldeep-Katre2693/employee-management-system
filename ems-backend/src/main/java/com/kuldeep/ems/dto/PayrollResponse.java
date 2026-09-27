package com.kuldeep.ems.dto;

import com.kuldeep.ems.entity.Payroll;

import java.math.BigDecimal;

public record PayrollResponse(
        Long id,
        Long employeeId,
        String employeeName,
        String employeeCode,
        String payrollMonth,
        BigDecimal basicSalary,
        BigDecimal allowance,
        BigDecimal deduction,
        BigDecimal netSalary,
        String paymentStatus
) {

    public static PayrollResponse from(Payroll payroll) {

        var employee = payroll.getEmployee();

        String employeeName = employee != null
                ? employee.getFirstName() + " " + employee.getLastName()
                : "";

        String employeeCode = employee != null
                ? employee.getEmployeeCode()
                : "";

        return new PayrollResponse(
                payroll.getId(),
                employee != null ? employee.getId() : null,
                employeeName,
                employeeCode,
                payroll.getPayrollMonth(),
                payroll.getBasicSalary(),
                payroll.getAllowance(),
                payroll.getDeduction(),
                payroll.getNetSalary(),
                payroll.getPaymentStatus() != null
                        ? payroll.getPaymentStatus().name()
                        : null
        );
    }
}
package com.kuldeep.ems.service;

import com.kuldeep.ems.entity.Employee;
import com.kuldeep.ems.entity.Payroll;
import com.kuldeep.ems.entity.PaymentStatus;
import com.kuldeep.ems.repository.EmployeeRepository;
import com.kuldeep.ems.repository.PayrollRepository;
import org.springframework.stereotype.Service;
import com.kuldeep.ems.exception.ResourceNotFoundException;
import java.math.BigDecimal;

import java.util.List;

@Service
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollService(
            PayrollRepository payrollRepository,
            EmployeeRepository employeeRepository) {

        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
    }

    public Payroll createPayroll(
            Long employeeId,
            String payrollMonth,
            BigDecimal basicSalary,
            BigDecimal allowance,
            BigDecimal deduction) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
    "Employee not found with id: " + employeeId)
);

        if (payrollRepository
                .findByEmployeeIdAndPayrollMonth(
                        employeeId, payrollMonth)
                .isPresent()) {

           throw new IllegalArgumentException(
        "Payroll already exists for this employee and month");
        }

       if (basicSalary.compareTo(BigDecimal.ZERO) < 0
        || allowance.compareTo(BigDecimal.ZERO) < 0
        || deduction.compareTo(BigDecimal.ZERO) < 0) {

    throw new IllegalArgumentException(
            "Salary values cannot be negative");
}

BigDecimal netSalary = basicSalary
        .add(allowance)
        .subtract(deduction);

if (netSalary.compareTo(BigDecimal.ZERO) < 0) {
    throw new IllegalArgumentException(
            "Net salary cannot be negative");
}

        Payroll payroll = new Payroll();

        payroll.setEmployee(employee);
        payroll.setPayrollMonth(payrollMonth);
        payroll.setBasicSalary(basicSalary);
        payroll.setAllowance(allowance);
        payroll.setDeduction(deduction);
        payroll.setNetSalary(netSalary);
        payroll.setPaymentStatus(PaymentStatus.PENDING);

        return payrollRepository.save(payroll);
    }

    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }

    public List<Payroll> getEmployeePayrolls(Long employeeId) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException(
    "Employee not found with id: " + employeeId
);
        }

        return payrollRepository.findByEmployeeId(employeeId);
    }

    public Payroll markAsPaid(Long payrollId) {

        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() ->
                       new ResourceNotFoundException(
    "Payroll not found with id: " + payrollId)
);

        payroll.setPaymentStatus(PaymentStatus.PAID);

        return payrollRepository.save(payroll);
    }

    public List<Payroll> getMyPayrolls(String username) {

    return payrollRepository
            .findByEmployeeUserUsername(username);
}
}
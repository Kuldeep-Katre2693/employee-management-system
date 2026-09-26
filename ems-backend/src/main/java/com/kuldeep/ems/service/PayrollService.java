package com.kuldeep.ems.service;

import com.kuldeep.ems.entity.Employee;
import com.kuldeep.ems.entity.Payroll;
import com.kuldeep.ems.entity.PaymentStatus;
import com.kuldeep.ems.repository.EmployeeRepository;
import com.kuldeep.ems.repository.PayrollRepository;
import org.springframework.stereotype.Service;

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
            Double basicSalary,
            Double allowance,
            Double deduction) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));

        if (payrollRepository
                .findByEmployeeIdAndPayrollMonth(
                        employeeId, payrollMonth)
                .isPresent()) {

            throw new RuntimeException(
                    "Payroll already exists for this employee and month");
        }

        if (basicSalary < 0 || allowance < 0 || deduction < 0) {
            throw new RuntimeException(
                    "Salary values cannot be negative");
        }

        Double netSalary =
                basicSalary + allowance - deduction;

        if (netSalary < 0) {
            throw new RuntimeException(
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
            throw new RuntimeException("Employee not found");
        }

        return payrollRepository.findByEmployeeId(employeeId);
    }

    public Payroll markAsPaid(Long payrollId) {

        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() ->
                        new RuntimeException("Payroll not found"));

        payroll.setPaymentStatus(PaymentStatus.PAID);

        return payrollRepository.save(payroll);
    }

    public List<Payroll> getMyPayrolls(String username) {

    return payrollRepository
            .findByEmployeeUserUsername(username);
}
}
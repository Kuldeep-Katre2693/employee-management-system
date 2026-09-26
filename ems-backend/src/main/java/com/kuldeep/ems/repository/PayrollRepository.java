package com.kuldeep.ems.repository;

import com.kuldeep.ems.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PayrollRepository
        extends JpaRepository<Payroll, Long> {

    List<Payroll> findByEmployeeId(Long employeeId);
    List<Payroll> findByEmployeeUserUsername(String username);

    Optional<Payroll> findByEmployeeIdAndPayrollMonth(
            Long employeeId,
            String payrollMonth
    );
}
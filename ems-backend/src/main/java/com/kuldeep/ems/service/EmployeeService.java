package com.kuldeep.ems.service;

import com.kuldeep.ems.dto.EmployeeRequest;
import com.kuldeep.ems.entity.Employee;
import com.kuldeep.ems.exception.ResourceNotFoundException;
import com.kuldeep.ems.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() ->
 new ResourceNotFoundException(
                            "Employee not found with id: " + id
                    )   );
                 }

    public Employee createEmployee(EmployeeRequest request) {

        Employee employee = new Employee();

        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setSalary(request.getSalary());

        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, EmployeeRequest request) {

        Employee employee = getEmployeeById(id);

        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setSalary(request.getSalary());

        return employeeRepository.save(employee);
    }

   public void deleteEmployee(Long id) {

    Employee employee = employeeRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Employee not found with id: " + id
                    )
            );

    employeeRepository.delete(employee);
}
}
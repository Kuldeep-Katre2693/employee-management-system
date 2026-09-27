package com.kuldeep.ems.service;

import com.kuldeep.ems.entity.Employee;
import com.kuldeep.ems.entity.LeaveRequest;
import com.kuldeep.ems.entity.LeaveStatus;
import com.kuldeep.ems.exception.ResourceNotFoundException;
import com.kuldeep.ems.repository.EmployeeRepository;
import com.kuldeep.ems.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveRequestService(
            LeaveRequestRepository leaveRequestRepository,
            EmployeeRepository employeeRepository) {

        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
    }

   public LeaveRequest applyLeave(
        String username,
        LeaveRequest leaveRequest) {

    Employee employee = employeeRepository
            .findByUserUsername(username)
            .orElseThrow(() ->
                    new RuntimeException("Employee profile not found"));

    if (leaveRequest.getStartDate()
            .isAfter(leaveRequest.getEndDate())) {

        throw new RuntimeException(
                "Start date cannot be after end date");
    }

    leaveRequest.setEmployee(employee);
    leaveRequest.setStatus(LeaveStatus.PENDING);

    return leaveRequestRepository.save(leaveRequest);
}

    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAll();
    }

    public List<LeaveRequest> getEmployeeLeaves(Long employeeId) {

        if (!employeeRepository.existsById(employeeId)) {
throw new ResourceNotFoundException(
    "Employee not found with id: " + employeeId
);        }

        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    public List<LeaveRequest> getMyLeaves(String username) {
    Employee employee = employeeRepository.findByUserUsername(username)
            .orElseThrow(() -> new RuntimeException("Employee profile not found"));

    return leaveRequestRepository.findByEmployeeId(employee.getId());
}

    public LeaveRequest approveLeave(Long leaveId) {

        LeaveRequest leaveRequest = getLeaveById(leaveId);

        leaveRequest.setStatus(LeaveStatus.APPROVED);

        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest rejectLeave(Long leaveId) {

        LeaveRequest leaveRequest = getLeaveById(leaveId);

        leaveRequest.setStatus(LeaveStatus.REJECTED);

        return leaveRequestRepository.save(leaveRequest);
    }

    private LeaveRequest getLeaveById(Long leaveId) {

        return leaveRequestRepository.findById(leaveId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Leave request not found with id: " + leaveId));
    }
}
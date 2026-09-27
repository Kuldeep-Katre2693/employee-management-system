package com.kuldeep.ems.dto;

import com.kuldeep.ems.entity.LeaveRequest;
import com.kuldeep.ems.entity.LeaveStatus;

import java.time.LocalDate;

public record LeaveResponse(
        Long id,
        Long employeeId,
        String employeeCode,
        String employeeName,
        LocalDate startDate,
        LocalDate endDate,
        String reason,
        LeaveStatus status
) {

    public static LeaveResponse from(LeaveRequest leave) {

        return new LeaveResponse(
                leave.getId(),
                leave.getEmployee().getId(),
                leave.getEmployee().getEmployeeCode(),
                leave.getEmployee().getFirstName() + " "
                        + leave.getEmployee().getLastName(),
                leave.getStartDate(),
                leave.getEndDate(),
                leave.getReason(),
                leave.getStatus()
        );
    }
}
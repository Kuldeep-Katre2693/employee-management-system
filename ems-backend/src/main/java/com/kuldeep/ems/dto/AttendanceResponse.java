package com.kuldeep.ems.dto;

import com.kuldeep.ems.entity.Attendance;

import java.time.LocalDate;
import java.time.LocalTime;

public record AttendanceResponse(
        Long id,
        Long employeeId,
        String employeeName,
        String employeeCode,
        LocalDate attendanceDate,
        LocalTime checkIn,
        LocalTime checkOut,
        String status
) {

    public static AttendanceResponse from(Attendance attendance) {

        var employee = attendance.getEmployee();

        String employeeName = employee != null
                ? employee.getFirstName() + " " + employee.getLastName()
                : "";

        String employeeCode = employee != null
                ? employee.getEmployeeCode()
                : "";

        return new AttendanceResponse(
                attendance.getId(),
                employee != null ? employee.getId() : null,
                employeeName,
                employeeCode,
                attendance.getAttendanceDate(),
                attendance.getCheckIn(),
                attendance.getCheckOut(),
                attendance.getStatus() != null
                        ? attendance.getStatus().name()
                        : null
        );
    }
}
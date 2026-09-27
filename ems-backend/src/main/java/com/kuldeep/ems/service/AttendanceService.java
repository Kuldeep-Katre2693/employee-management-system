package com.kuldeep.ems.service;

import com.kuldeep.ems.entity.Attendance;
import com.kuldeep.ems.entity.AttendanceStatus;
import com.kuldeep.ems.entity.Employee;
import com.kuldeep.ems.repository.AttendanceRepository;
import com.kuldeep.ems.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import com.kuldeep.ems.exception.ResourceNotFoundException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            EmployeeRepository employeeRepository) {

        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    public Attendance markAttendance(
            String username,
            AttendanceStatus status) {

        Employee employee = employeeRepository
                .findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with username: " + username));
        LocalDate today = LocalDate.now();

        if (attendanceRepository
                .findByEmployeeIdAndAttendanceDate(
                        employee.getId(), today)
                .isPresent()) {

            throw new IllegalArgumentException(
        "Attendance already marked for today");
        }

        Attendance attendance = new Attendance();

        attendance.setEmployee(employee);
        attendance.setAttendanceDate(today);
        attendance.setCheckIn(LocalTime.now());
        attendance.setStatus(status);

        return attendanceRepository.save(attendance);
    }

    public Attendance checkOut(String username) {

        Employee employee = employeeRepository
                .findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with username: " + username));
        Attendance attendance = attendanceRepository
                .findByEmployeeIdAndAttendanceDate(
                        employee.getId(),
                        LocalDate.now())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Attendance record not found for today"));

        if (attendance.getCheckOut() != null) {
           throw new IllegalArgumentException(
        "Attendance already checked out");
        }

        attendance.setCheckOut(LocalTime.now());

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getEmployeeAttendance(
            String username) {

        Employee employee = employeeRepository
                .findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with username: " + username));
        return attendanceRepository
                .findByEmployeeId(employee.getId());
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }
}
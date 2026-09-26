package com.kuldeep.ems.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        System.out.println("ADMIN: " + encoder.encode("admin123"));
        System.out.println("MANAGER: " + encoder.encode("manager123"));
        System.out.println("EMPLOYEE: " + encoder.encode("employee123"));
    }
}
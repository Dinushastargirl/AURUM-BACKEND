
import { CodeSnippet } from './types';

export const AURUM_PROJECT_FILES: CodeSnippet[] = [
  {
    id: 'booking-entity',
    name: 'Booking.java',
    path: 'com.aurum.studio.entity.Booking',
    language: 'java',
    description: 'The core domain model for studio appointments.',
    content: `package com.aurum.studio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String clientName;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private LocalDateTime appointmentTime;
    
    @Column(nullable = false)
    private String status = "PENDING";
    
    @Column
    private String payherePaymentId;
}`
  },
  {
    id: 'user-entity',
    name: 'User.java',
    path: 'com.aurum.studio.entity.User',
    language: 'java',
    description: 'Simple user entity for basic authentication roles.',
    content: `package com.aurum.studio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
}`
  },
  {
    id: 'repository',
    name: 'BookingRepository.java',
    path: 'com.aurum.studio.repository.BookingRepository',
    language: 'java',
    description: 'Standard JPA repository for database interaction.',
    content: `package com.aurum.studio.repository;

import com.aurum.studio.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Standard CRUD inherited from JpaRepository
}`
  },
  {
    id: 'service',
    name: 'BookingService.java',
    path: 'com.aurum.studio.service.BookingService',
    language: 'java',
    description: 'Service layer implementing the "Monday" and "Business Hours" rules.',
    content: `package com.aurum.studio.service;

import com.aurum.studio.entity.Booking;
import com.aurum.studio.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    
    public Booking createBooking(Booking booking) {
        validateTime(booking);
        return bookingRepository.save(booking);
    }
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    private void validateTime(Booking booking) {
        var dt = booking.getAppointmentTime();
        var time = dt.toLocalTime();
        
        // The "Monday" Rule
        if (dt.getDayOfWeek() == DayOfWeek.MONDAY) {
            throw new RuntimeException("Validation Error: Mondays are closed.");
        }
        
        // The "Hours" Rule (08:30 - 19:30)
        LocalTime opening = LocalTime.of(8, 30);
        LocalTime closing = LocalTime.of(19, 30);
        
        if (time.isBefore(opening) || time.isAfter(closing)) {
            throw new RuntimeException("Validation Error: Appointments must be 08:30 - 19:30.");
        }
    }
}`
  },
  {
    id: 'controller',
    name: 'BookingController.java',
    path: 'com.aurum.studio.controller.BookingController',
    language: 'java',
    description: 'Main REST Controller for booking operations.',
    content: `package com.aurum.studio.controller;

import com.aurum.studio.entity.Booking;
import com.aurum.studio.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    
    private final BookingService bookingService;
    
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Booking booking) {
        try {
            return ResponseEntity.ok(bookingService.createBooking(booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping
    public List<Booking> getAll() {
        return bookingService.getAllBookings();
    }
}`
  },
  {
    id: 'auth-controller',
    name: 'AuthController.java',
    path: 'com.aurum.studio.controller.AuthController',
    language: 'java',
    description: 'Auth endpoint returning "SUCCESS" on valid credentials.',
    content: `package com.aurum.studio.controller;

import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        boolean validUser = "admin".equals(request.getUsername()) || "client".equals(request.getUsername());
        boolean validPass = "1234".equals(request.getPassword());
        
        if (validUser && validPass) {
            return ResponseEntity.ok("SUCCESS");
        }
        return ResponseEntity.status(401).body("FAILURE");
    }

    @Data
    static class LoginRequest {
        private String username;
        private String password;
    }
}`
  },
  {
    id: 'config',
    name: 'WebConfig.java',
    path: 'com.aurum.studio.config.WebConfig',
    language: 'java',
    description: 'CORS Configuration enabling requests from localhost:3000.',
    content: `package com.aurum.studio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}`
  }
];

export const SPRING_DEPENDENCIES = [
  { name: 'Spring Web', desc: 'Build web, including RESTful, applications using Spring MVC.' },
  { name: 'Spring Data JPA', desc: 'Persist data in SQL stores with Java Persistence API.' },
  { name: 'PostgreSQL Driver', desc: 'A JDBC driver that allows Java programs to connect to a PostgreSQL database.' },
  { name: 'Lombok', desc: 'Java library that helps to reduce boilerplate code.' },
  { name: 'Spring Boot DevTools', desc: 'Provides fast application restarts, LiveReload, and configurations for enhanced development experience.' }
];


import { CodeSnippet } from './types';

export const AURUM_PROJECT_FILES: CodeSnippet[] = [
  {
    id: 'entity',
    name: 'Booking.java',
    path: 'com.aurum.bookings.entity.Booking',
    language: 'java',
    description: 'The core domain model representing a client appointment.',
    content: `package com.aurum.bookings.entity;

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
    private String phoneNumber;
    
    @Column(nullable = false)
    private String serviceType;
    
    @Column(nullable = false)
    private LocalDateTime appointmentDate;
    
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;
    
    public enum BookingStatus {
        PENDING, CONFIRMED, CANCELLED, COMPLETED
    }
}`
  },
  {
    id: 'repository',
    name: 'BookingRepository.java',
    path: 'com.aurum.bookings.repository.BookingRepository',
    language: 'java',
    description: 'Data access layer for database operations.',
    content: `package com.aurum.bookings.repository;

import com.aurum.bookings.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
export interface BookingRepository extends JpaRepository<Booking, Long> {
    // Custom query to find bookings by date range if needed
    List<Booking> findAllByAppointmentDateBetween(LocalDateTime start, LocalDateTime end);
}`
  },
  {
    id: 'service',
    name: 'BookingService.java',
    path: 'com.aurum.bookings.service.BookingService',
    language: 'java',
    description: 'Business logic layer handling validation and processing.',
    content: `package com.aurum.bookings.service;

import com.aurum.bookings.entity.Booking;
import com.aurum.bookings.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    
    public Booking saveBooking(Booking booking) {
        validateAppointmentTime(booking);
        return bookingRepository.save(booking);
    }
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    private void validateAppointmentTime(Booking booking) {
        var date = booking.getAppointmentDate();
        var time = date.toLocalTime();
        
        // Rule 1: No Mondays
        if (date.getDayOfWeek() == DayOfWeek.MONDAY) {
            throw new IllegalArgumentException("Bookings are not available on Mondays.");
        }
        
        // Rule 2: Business Hours (08:30 - 19:30)
        LocalTime openingTime = LocalTime.of(8, 30);
        LocalTime closingTime = LocalTime.of(19, 30);
        
        if (time.isBefore(openingTime) || time.isAfter(closingTime)) {
            throw new IllegalArgumentException("Appointments must be between 08:30 and 19:30.");
        }
    }
}`
  },
  {
    id: 'controller',
    name: 'BookingController.java',
    path: 'com.aurum.bookings.controller.BookingController',
    language: 'java',
    description: 'REST API entry points for client and admin operations.',
    content: `package com.aurum.bookings.controller;

import com.aurum.bookings.entity.Booking;
import com.aurum.bookings.service.BookingService;
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
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            Booking saved = bookingService.saveBooking(booking);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}`
  },
  {
    id: 'config',
    name: 'WebConfig.java',
    path: 'com.aurum.bookings.config.WebConfig',
    language: 'java',
    description: 'Security configuration for CORS and frontend integration.',
    content: `package com.aurum.bookings.config;

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

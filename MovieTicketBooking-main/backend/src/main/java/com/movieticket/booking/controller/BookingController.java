
package com.movieticket.booking.controller;

import com.movieticket.booking.entity.Booking;
import com.movieticket.booking.repository.BookingRepository;
import com.movieticket.booking.service.BookingService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.movieticket.booking.entity.User;
import com.movieticket.booking.repository.UserRepository;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://127.0.0.1:8000")
public class BookingController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingController(
        BookingService bookingService,
        BookingRepository bookingRepository,
        UserRepository userRepository) {

    this.bookingService = bookingService;
    this.bookingRepository = bookingRepository;
    this.userRepository = userRepository;
}

    // Get all bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // Create a booking
    @PostMapping
    public Booking createBooking(
            @RequestBody BookingRequest request) {
return bookingService.createBooking(
        request.getShowId(),
        request.getSeatIds(),
        request.getCustomerName(),
        request.getCustomerEmail()
);
    }

    // Get a booking by ID
    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));
    }

    // Get bookings for a user
@GetMapping("/user/{userId}")
public List<Booking> getBookingsByUser(@PathVariable Long userId) {

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return bookingRepository.findByCustomerEmail(user.getEmail());
}

    // Request format from frontend
    public static class BookingRequest {

        private Long movieId;
        private Long showId;
        private List<Long> seatIds;
        private String customerName;
private String customerEmail;

        public Long getMovieId() {
            return movieId;
        }

        public void setMovieId(Long movieId) {
            this.movieId = movieId;
        }

        public Long getShowId() {
            return showId;
        }

        public void setShowId(Long showId) {
            this.showId = showId;
        }

        public List<Long> getSeatIds() {
            return seatIds;
        }

        public void setSeatIds(List<Long> seatIds) {
            this.seatIds = seatIds;
        }

        public String getCustomerName() {
            return customerName;
        }

        public void setCustomerName(String customerName) {
            this.customerName = customerName;
        }

        public String getCustomerEmail() {
            return customerEmail;
        }

        public void setCustomerEmail(String customerEmail) {
            this.customerEmail = customerEmail;
        }
    }
}
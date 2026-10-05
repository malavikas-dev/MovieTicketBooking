package com.movieticket.booking.service;

import com.movieticket.booking.entity.Booking;
import com.movieticket.booking.entity.Showtime;
import com.movieticket.booking.entity.ShowtimeSeat;
import com.movieticket.booking.repository.BookingRepository;
import com.movieticket.booking.repository.ShowtimeRepository;
import com.movieticket.booking.repository.ShowtimeSeatRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShowtimeRepository showtimeRepository;
    private final ShowtimeSeatRepository seatRepository;

    public BookingService(
            BookingRepository bookingRepository,
            ShowtimeRepository showtimeRepository,
            ShowtimeSeatRepository seatRepository) {

        this.bookingRepository = bookingRepository;
        this.showtimeRepository = showtimeRepository;
        this.seatRepository = seatRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional
    public Booking createBooking(
            Long showId,
            List<Long> seatIds,
            String customerName,
            String customerEmail) {

        // Customer validation
        if (customerName == null || customerName.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name is required");
        }

        if (customerName.trim().length() > 100) {
            throw new IllegalArgumentException("Customer name is too long");
        }

        if (customerEmail == null || customerEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email is required");
        }

        if (!customerEmail.matches(
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException(
                    "Please provide a valid email address");
        }

        // Showtime validation
        if (showId == null) {
            throw new IllegalArgumentException(
                    "Showtime ID is required");
        }

        Showtime showtime = showtimeRepository.findById(showId)
                .orElseThrow(() ->
                        new RuntimeException("Showtime not found"));

        // Seat validation
        if (seatIds == null || seatIds.isEmpty()) {
            throw new IllegalArgumentException(
                    "Please select at least one seat");
        }

        if (seatIds.stream().distinct().count() != seatIds.size()) {
            throw new IllegalArgumentException(
                    "Duplicate seat IDs are not allowed");
        }

        // Lock selected seats during this transaction
        List<ShowtimeSeat> seats =
                seatRepository.findAllByIdsForUpdate(seatIds);

        if (seats.size() != seatIds.size()) {
            throw new IllegalArgumentException(
                    "One or more seats do not exist");
        }

        // Verify seats belong to this showtime
        for (ShowtimeSeat seat : seats) {

            if (!seat.getShowtime().getId().equals(showId)) {
                throw new IllegalArgumentException(
                        "A selected seat does not belong to this showtime");
            }

            if (seat.isBooked()) {
                throw new IllegalStateException(
                        "One or more selected seats are already booked");
            }
        }

        // Create booking
        Booking booking = new Booking();

        booking.setShowtime(showtime);
        booking.setCustomerName(customerName.trim());
        booking.setCustomerEmail(customerEmail.trim());
        booking.setNumberOfSeats(seats.size());

        booking.setTotalAmount(
                showtime.getTicketPrice() * seats.size());

        booking.setStatus("CONFIRMED");
        booking.setSeats(seats);

        // Mark seats as booked
        for (ShowtimeSeat seat : seats) {
            seat.setBooked(true);
        }

        seatRepository.saveAll(seats);

        return bookingRepository.save(booking);
    }
}
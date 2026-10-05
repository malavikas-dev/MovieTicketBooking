package com.movieticket.booking.repository;

import com.movieticket.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerEmail(String customerEmail);

    List<Booking> findByShowtimeId(Long showtimeId);
}
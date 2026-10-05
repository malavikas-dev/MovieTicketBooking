package com.movieticket.booking.repository;

import com.movieticket.booking.entity.ShowtimeSeat;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShowtimeSeatRepository
        extends JpaRepository<ShowtimeSeat, Long> {

    // Used by the seat-selection page
    List<ShowtimeSeat> findByShowtimeId(Long showtimeId);

    // Used during booking to prevent simultaneous double-booking
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT s
            FROM ShowtimeSeat s
            WHERE s.id IN :seatIds
            """)
    List<ShowtimeSeat> findAllByIdsForUpdate(
            @Param("seatIds") List<Long> seatIds);
}
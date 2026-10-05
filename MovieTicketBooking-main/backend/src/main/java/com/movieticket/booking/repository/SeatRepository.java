
package com.movieticket.booking.repository;

import com.movieticket.booking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByTheatreId(Long theatreId);

}
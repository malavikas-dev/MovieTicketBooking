
package com.movieticket.booking.repository;

import com.movieticket.booking.entity.Showtime;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
List<Showtime> findByMovieId(Long movieId);

List<Showtime> findByTheatreId(Long theatreId);

List<Showtime> findByMovieIdAndTheatreId(
        Long movieId, Long theatreId);
    }
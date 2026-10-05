package com.movieticket.booking.controller;

import com.movieticket.booking.entity.ShowtimeSeat;
import com.movieticket.booking.repository.ShowtimeSeatRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/showtime-seats")
@CrossOrigin(origins = "*")
public class ShowtimeSeatController {

    private final ShowtimeSeatRepository repository;

    public ShowtimeSeatController(ShowtimeSeatRepository repository) {
        this.repository = repository;
    }

    // Get all seat records
    @GetMapping
    public List<ShowtimeSeat> getAllSeats() {
        return repository.findAll();
    }

    // Get seats for a particular showtime
    @GetMapping("/showtime/{showtimeId}")
    public List<ShowtimeSeat> getSeatsByShowtime(
            @PathVariable Long showtimeId) {
        return repository.findByShowtimeId(showtimeId);
    }

    // Create a seat record for a showtime
    @PostMapping
    public ShowtimeSeat addShowtimeSeat(
            @RequestBody ShowtimeSeat showtimeSeat) {
        return repository.save(showtimeSeat);
    }
}
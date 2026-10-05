package com.movieticket.booking.controller;

import com.movieticket.booking.entity.Seat;
import com.movieticket.booking.repository.SeatRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "*")
public class SeatController {

    private final SeatRepository seatRepository;

    public SeatController(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    // Get all seats
    @GetMapping
    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    // Get seats by theatre ID
    @GetMapping("/theatre/{theatreId}")
    public List<Seat> getSeatsByTheatre(@PathVariable Long theatreId) {
        return seatRepository.findByTheatreId(theatreId);
    }

    // Add a seat
    @PostMapping
    public Seat addSeat(@RequestBody Seat seat) {
        return seatRepository.save(seat);
    }
}
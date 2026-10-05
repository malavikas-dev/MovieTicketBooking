
package com.movieticket.booking.controller;

import com.movieticket.booking.entity.Showtime;
import com.movieticket.booking.repository.ShowtimeRepository;
import com.movieticket.booking.service.PricingService;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "*")
public class ShowtimeController {

    private final ShowtimeRepository showtimeRepository;
    private final PricingService pricingService;

    public ShowtimeController(
            ShowtimeRepository showtimeRepository,
            PricingService pricingService) {
        this.showtimeRepository = showtimeRepository;
        this.pricingService = pricingService;
    }

    @GetMapping
public List<Showtime> getAllShowtimes(
        @RequestParam(required = false) Long movieId,
        @RequestParam(required = false) Long theatreId) {

    if (movieId != null && theatreId != null) {
        return showtimeRepository
                .findByMovieIdAndTheatreId(movieId, theatreId);
    }

    if (movieId != null) {
        return showtimeRepository.findByMovieId(movieId);
    }

    if (theatreId != null) {
        return showtimeRepository.findByTheatreId(theatreId);
    }

    return showtimeRepository.findAll();
}

    @PostMapping
    public Showtime addShowtime(@RequestBody Showtime showtime) {
        return showtimeRepository.save(showtime);
    }

    @GetMapping("/{id}")
    public Showtime getShowtimeById(@PathVariable Long id) {
        return showtimeRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Showtime not found"));
    }

    @GetMapping("/{id}/price")
    public double getTicketPrice(@PathVariable Long id) {

        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Showtime not found"));

        double basePrice = showtime.getTicketPrice();

        double price = pricingService.calculatePrice(
                basePrice,
                showtime.getShowTime()
        );

        LocalDateTime showDateTime = LocalDateTime.of(
                showtime.getShowDate(),
                showtime.getShowTime()
        );

        LocalDateTime now = LocalDateTime.now();

        if (now.isAfter(showDateTime.minusHours(1))
                && now.isBefore(showDateTime)) {
            price = price * 0.90;
        }

        return Math.round(price * 100.0) / 100.0;
    }
}

package com.movieticket.booking.controller;

import com.movieticket.booking.entity.Theatre;
import com.movieticket.booking.repository.TheatreRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/theatres")
@CrossOrigin(origins = "*")
public class TheatreController {

    private final TheatreRepository theatreRepository;

    public TheatreController(TheatreRepository theatreRepository) {
        this.theatreRepository = theatreRepository;
    }

    @GetMapping
    public List<Theatre> getAllTheatres() {
        return theatreRepository.findAll();
    }

    @GetMapping("/city/{city}")
public List<Theatre> getTheatresByCity(@PathVariable String city) {
    return theatreRepository.findByCityIgnoreCase(city);
}

    @PostMapping
    public Theatre addTheatre(@RequestBody Theatre theatre) {
        return theatreRepository.save(theatre);
    }

    @GetMapping("/{id}")
    public Theatre getTheatreById(@PathVariable Long id) {
        return theatreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theatre not found"));
    }

}

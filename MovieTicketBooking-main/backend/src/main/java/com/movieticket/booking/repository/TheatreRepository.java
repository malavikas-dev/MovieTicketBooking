
package com.movieticket.booking.repository;

import com.movieticket.booking.entity.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TheatreRepository extends JpaRepository<Theatre, Long> {
    List<Theatre> findByCityIgnoreCase(String city);
}
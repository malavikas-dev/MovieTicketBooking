
package com.movieticket.booking.service;

import org.springframework.stereotype.Service;
import java.time.LocalTime;

@Service
public class PricingService {

    public double calculatePrice(double basePrice, LocalTime showTime) {

        double price;

        if (showTime.isBefore(LocalTime.NOON)) {
            price = basePrice - 10;
        } else if (showTime.isBefore(LocalTime.of(17, 0))) {
            price = basePrice - 30;
        } else {
            price = basePrice + 30;
        }

        return Math.max(price, 0);
    }
}
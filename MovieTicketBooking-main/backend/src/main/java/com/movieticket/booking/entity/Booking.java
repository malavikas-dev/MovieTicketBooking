
package com.movieticket.booking.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String customerEmail;
    private int numberOfSeats;
    private double totalAmount;

    private LocalDateTime bookingTime;

    private String status = "CONFIRMED";

    @ManyToOne
    @JoinColumn(name = "showtime_id")
    private Showtime showtime;

    @ManyToMany
    @JoinTable(
        name = "booking_seats",
        joinColumns = @JoinColumn(name = "booking_id"),
        inverseJoinColumns = @JoinColumn(name = "showtime_seat_id")
    )
    private List<ShowtimeSeat> seats = new ArrayList<>();

    public Booking() {
    }

    @PrePersist
    public void setBookingTime() {
        bookingTime = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public int getNumberOfSeats() {
        return numberOfSeats;
    }

    public void setNumberOfSeats(int numberOfSeats) {
        this.numberOfSeats = numberOfSeats;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Showtime getShowtime() {
        return showtime;
    }

    public void setShowtime(Showtime showtime) {
        this.showtime = showtime;
    }

    public List<ShowtimeSeat> getSeats() {
        return seats;
    }

    public void setSeats(List<ShowtimeSeat> seats) {
        this.seats = seats;
    }
}
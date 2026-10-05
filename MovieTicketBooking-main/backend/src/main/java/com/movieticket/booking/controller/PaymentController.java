package com.movieticket.booking.controller;

import com.movieticket.booking.entity.Payment;
import com.movieticket.booking.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public Payment processPayment(
            @RequestBody PaymentRequest request) {

        return paymentService.processPayment(
                request.getBookingId(),
                request.getAmount(),
                request.getPaymentMethod()
        );
    }

    public static class PaymentRequest {

        private Long bookingId;
        private Double amount;
        private String paymentMethod;

        public Long getBookingId() {
            return bookingId;
        }

        public void setBookingId(Long bookingId) {
            this.bookingId = bookingId;
        }

        public Double getAmount() {
            return amount;
        }

        public void setAmount(Double amount) {
            this.amount = amount;
        }

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }
    }
}
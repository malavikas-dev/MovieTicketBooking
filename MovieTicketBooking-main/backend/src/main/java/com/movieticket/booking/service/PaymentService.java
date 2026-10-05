package com.movieticket.booking.service;

import com.movieticket.booking.entity.Payment;
import com.movieticket.booking.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment processPayment(
            Long bookingId,
            Double amount,
            String paymentMethod) {

        Payment payment = new Payment();

        payment.setBookingId(bookingId);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentStatus("SUCCESS");

        payment.setTransactionId(
                "PAY-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );

        payment.setPaymentTime(LocalDateTime.now());

        return paymentRepository.save(payment);
    }
}
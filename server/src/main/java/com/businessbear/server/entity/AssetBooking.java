package com.businessbear.server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AssetBooking extends BaseEntity {

    @Column(name = "booking_number", unique = true, nullable = false, length = 100)
    private String bookingNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "real_asset_id", nullable = false)
    private RealAsset realAsset;

    @Column(name = "client_name", nullable = false, length = 150)
    private String clientName;

    @Column(name = "client_email", nullable = false, length = 150)
    private String clientEmail;

    @Column(name = "client_phone", length = 50)
    private String clientPhone;

    @Column(name = "agreed_price", precision = 15, scale = 2)
    private BigDecimal agreedPrice;

    @Column(name = "booking_type", length = 50)
    @Builder.Default
    private String bookingType = "BOOKING"; // "BOOKING" or "SALE"

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", length = 30, nullable = false)
    @Builder.Default
    private BookingStatus bookingStatus = BookingStatus.PENDING;

    @Column(name = "booking_date")
    private LocalDateTime bookingDate;

    @Override
    protected void onCreate() {
        super.onCreate();
        if (this.bookingDate == null) {
            this.bookingDate = LocalDateTime.now();
        }
    }
}

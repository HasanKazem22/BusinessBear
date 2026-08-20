package com.businessbear.server.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetBookingRequestDto {

    @NotNull(message = "Real asset ID is required")
    private Long realAssetId;

    @NotBlank(message = "Client name is required")
    private String clientName;

    @NotBlank(message = "Client email is required")
    @Email(message = "Invalid email format")
    private String clientEmail;

    private String clientPhone;
    private BigDecimal agreedPrice;
    private String bookingType; // "BOOKING" or "SALE"
}

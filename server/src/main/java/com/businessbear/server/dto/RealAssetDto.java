package com.businessbear.server.dto;

import com.businessbear.server.entity.AssetStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RealAssetDto {
    private Long id;
    private String code;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private String imageUrl;
    private Integer beds;
    private Double baths;
    private Integer sqft;
    private AssetStatus status;
    private String description;
    private Boolean isFeatured;
}

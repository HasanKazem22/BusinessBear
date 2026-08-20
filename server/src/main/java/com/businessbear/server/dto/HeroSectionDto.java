package com.businessbear.server.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeroSectionDto {
    private Long id;
    private String logoUrl;
    private String title;
    private String description;
}

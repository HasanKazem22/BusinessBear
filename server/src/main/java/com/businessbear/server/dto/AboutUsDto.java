package com.businessbear.server.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AboutUsDto {
    private Long id;
    private String fullName;
    private String designation;
    private String bio;
    private String avatarUrl;
    private String email;
    private String phone;
    private String location;
    private String socialLinksJson;
}

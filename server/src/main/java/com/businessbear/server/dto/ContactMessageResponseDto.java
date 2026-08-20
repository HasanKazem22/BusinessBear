package com.businessbear.server.dto;

import com.businessbear.server.entity.InquiryStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessageResponseDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String message;
    private InquiryStatus status;
    private LocalDateTime createdAt;
}

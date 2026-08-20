package com.businessbear.server.service;

import com.businessbear.server.dto.ContactMessageRequestDto;
import com.businessbear.server.dto.ContactMessageResponseDto;
import com.businessbear.server.entity.InquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContactMessageService {
    ContactMessageResponseDto submitContactMessage(ContactMessageRequestDto requestDto);
    Page<ContactMessageResponseDto> getAllMessages(InquiryStatus status, Pageable pageable);
    ContactMessageResponseDto updateMessageStatus(Long id, InquiryStatus status);
}

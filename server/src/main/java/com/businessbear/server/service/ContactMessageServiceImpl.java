package com.businessbear.server.service;

import com.businessbear.server.dto.ContactMessageRequestDto;
import com.businessbear.server.dto.ContactMessageResponseDto;
import com.businessbear.server.entity.ContactMessage;
import com.businessbear.server.entity.InquiryStatus;
import com.businessbear.server.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactMessageServiceImpl implements ContactMessageService {

    private final ContactMessageRepository repository;

    @Override
    public ContactMessageResponseDto submitContactMessage(ContactMessageRequestDto requestDto) {
        ContactMessage entity = ContactMessage.builder()
                .name(requestDto.getName())
                .email(requestDto.getEmail())
                .phone(requestDto.getPhone())
                .message(requestDto.getMessage())
                .status(InquiryStatus.NEW)
                .build();
        ContactMessage saved = repository.save(entity);
        return mapToDto(saved);
    }

    @Override
    public Page<ContactMessageResponseDto> getAllMessages(InquiryStatus status, Pageable pageable) {
        Page<ContactMessage> page;
        if (status != null) {
            page = repository.findByStatus(status, pageable);
        } else {
            page = repository.findAllByOrderByCreatedAtDesc(pageable);
        }
        return page.map(this::mapToDto);
    }

    @Override
    public ContactMessageResponseDto updateMessageStatus(Long id, InquiryStatus status) {
        ContactMessage entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact message not found with id: " + id));
        entity.setStatus(status);
        ContactMessage updated = repository.save(entity);
        return mapToDto(updated);
    }

    private ContactMessageResponseDto mapToDto(ContactMessage entity) {
        return ContactMessageResponseDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .message(entity.getMessage())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}

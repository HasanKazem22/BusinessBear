package com.businessbear.server.controller;

import com.businessbear.server.dto.ApiResponse;
import com.businessbear.server.dto.ContactMessageRequestDto;
import com.businessbear.server.dto.ContactMessageResponseDto;
import com.businessbear.server.entity.InquiryStatus;
import com.businessbear.server.service.ContactMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contact-messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessageResponseDto>> submitContactMessage(
            @Valid @RequestBody ContactMessageRequestDto requestDto) {
        ContactMessageResponseDto response = contactMessageService.submitContactMessage(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Message submitted successfully. Thank you!"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ContactMessageResponseDto>>> getAllMessages(
            @RequestParam(required = false) InquiryStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ContactMessageResponseDto> messages = contactMessageService.getAllMessages(status, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(messages, "Contact messages fetched successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ContactMessageResponseDto>> updateMessageStatus(
            @PathVariable Long id,
            @RequestParam InquiryStatus status) {
        ContactMessageResponseDto updated = contactMessageService.updateMessageStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Message status updated successfully"));
    }
}

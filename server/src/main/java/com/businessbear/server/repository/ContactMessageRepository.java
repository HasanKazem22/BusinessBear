package com.businessbear.server.repository;

import com.businessbear.server.entity.ContactMessage;
import com.businessbear.server.entity.InquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    Page<ContactMessage> findByStatus(InquiryStatus status, Pageable pageable);
    Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);
}

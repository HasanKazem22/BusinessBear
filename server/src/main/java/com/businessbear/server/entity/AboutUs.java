package com.businessbear.server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "about_us")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AboutUs extends BaseEntity {

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(length = 150)
    private String designation;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;

    @Column(length = 150)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(length = 255)
    private String location;

    @Column(name = "social_links_json", columnDefinition = "TEXT")
    private String socialLinksJson;
}

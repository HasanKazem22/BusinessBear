package com.businessbear.server.service;

import com.businessbear.server.dto.AboutUsDto;
import com.businessbear.server.dto.HeroSectionDto;
import com.businessbear.server.entity.AboutUs;
import com.businessbear.server.entity.HeroSection;
import com.businessbear.server.repository.AboutUsRepository;
import com.businessbear.server.repository.HeroSectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    private final HeroSectionRepository heroSectionRepository;
    private final AboutUsRepository aboutUsRepository;

    @Override
    @Transactional(readOnly = true)
    public HeroSectionDto getHeroSection() {
        HeroSection hero = heroSectionRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> HeroSection.builder()
                        .logoUrl("/BusinessBearLogo.png")
                        .title("Welcome to Business Bear")
                        .description("Welcome to our digital agency where innovation meets aesthetics.")
                        .build());
        return mapToHeroDto(hero);
    }

    @Override
    @Transactional
    public HeroSectionDto updateHeroSection(HeroSectionDto heroDto) {
        HeroSection hero = heroSectionRepository.findFirstByOrderByIdAsc()
                .orElse(new HeroSection());
        hero.setLogoUrl(heroDto.getLogoUrl());
        hero.setTitle(heroDto.getTitle());
        hero.setDescription(heroDto.getDescription());
        HeroSection saved = heroSectionRepository.save(hero);
        return mapToHeroDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AboutUsDto getAboutUs() {
        AboutUs about = aboutUsRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> AboutUs.builder()
                        .fullName("Hasibul Hasan")
                        .designation("Lead Software Engineer & Designer")
                        .bio("With over a decade of experience in software architecture...")
                        .avatarUrl("/ProfilePicture.png")
                        .email("hello@businessbear.com")
                        .phone("+1 (555) 123-4567")
                        .location("123 Innovation Drive, NY")
                        .build());
        return mapToAboutDto(about);
    }

    @Override
    @Transactional
    public AboutUsDto updateAboutUs(AboutUsDto dto) {
        AboutUs about = aboutUsRepository.findFirstByOrderByIdAsc()
                .orElse(new AboutUs());
        about.setFullName(dto.getFullName());
        about.setDesignation(dto.getDesignation());
        about.setBio(dto.getBio());
        about.setAvatarUrl(dto.getAvatarUrl());
        about.setEmail(dto.getEmail());
        about.setPhone(dto.getPhone());
        about.setLocation(dto.getLocation());
        about.setSocialLinksJson(dto.getSocialLinksJson());
        AboutUs saved = aboutUsRepository.save(about);
        return mapToAboutDto(saved);
    }

    private HeroSectionDto mapToHeroDto(HeroSection entity) {
        return HeroSectionDto.builder()
                .id(entity.getId())
                .logoUrl(entity.getLogoUrl())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .build();
    }

    private AboutUsDto mapToAboutDto(AboutUs entity) {
        return AboutUsDto.builder()
                .id(entity.getId())
                .fullName(entity.getFullName())
                .designation(entity.getDesignation())
                .bio(entity.getBio())
                .avatarUrl(entity.getAvatarUrl())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .location(entity.getLocation())
                .socialLinksJson(entity.getSocialLinksJson())
                .build();
    }
}

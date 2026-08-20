package com.businessbear.server.controller;

import com.businessbear.server.dto.AboutUsDto;
import com.businessbear.server.dto.ApiResponse;
import com.businessbear.server.dto.HeroSectionDto;
import com.businessbear.server.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/home")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HomeController {

    private final HomeService homeService;

    @GetMapping("/hero")
    public ResponseEntity<ApiResponse<HeroSectionDto>> getHeroSection() {
        HeroSectionDto hero = homeService.getHeroSection();
        return ResponseEntity.ok(ApiResponse.success(hero, "Hero section retrieved successfully"));
    }

    @PutMapping("/hero")
    public ResponseEntity<ApiResponse<HeroSectionDto>> updateHeroSection(@RequestBody HeroSectionDto heroDto) {
        HeroSectionDto updated = homeService.updateHeroSection(heroDto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Hero section updated successfully"));
    }

    @GetMapping("/about")
    public ResponseEntity<ApiResponse<AboutUsDto>> getAboutUs() {
        AboutUsDto about = homeService.getAboutUs();
        return ResponseEntity.ok(ApiResponse.success(about, "About us retrieved successfully"));
    }

    @PutMapping("/about")
    public ResponseEntity<ApiResponse<AboutUsDto>> updateAboutUs(@RequestBody AboutUsDto aboutUsDto) {
        AboutUsDto updated = homeService.updateAboutUs(aboutUsDto);
        return ResponseEntity.ok(ApiResponse.success(updated, "About us updated successfully"));
    }
}

package com.businessbear.server.service;

import com.businessbear.server.dto.AboutUsDto;
import com.businessbear.server.dto.HeroSectionDto;

public interface HomeService {
    HeroSectionDto getHeroSection();
    HeroSectionDto updateHeroSection(HeroSectionDto heroDto);

    AboutUsDto getAboutUs();
    AboutUsDto updateAboutUs(AboutUsDto aboutUsDto);
}

package com.businessbear.server.config;

import com.businessbear.server.entity.*;
import com.businessbear.server.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    private final HeroSectionRepository heroSectionRepository;
    private final ServiceRepository serviceRepository;
    private final AboutUsRepository aboutUsRepository;
    private final ProductRepository productRepository;
    private final RealAssetRepository realAssetRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedPermissions();
        seedRoles();
        seedAdminUser();
        seedHeroSection();
        seedServices();
        seedAboutUs();
        seedProducts();
        seedRealAssets();
    }

    private void seedPermissions() {
        List<String> permissionNames = Arrays.asList(
                "VIEW_USER_MANAGEMENT",
                "EDIT_USER",
                "CREATE_ROLE",
                "EDIT_ROLE",
                "VIEW_DASHBOARD",
                "MANAGE_PRODUCTS"
        );

        for (String name : permissionNames) {
            if (permissionRepository.findByName(name).isEmpty()) {
                permissionRepository.save(Permission.builder()
                        .name(name)
                        .description("Allows: " + name)
                        .build());
            }
        }
    }

    private void seedRoles() {
        if (roleRepository.findByName("ROLE_CUSTOMER").isEmpty()) {
            Role customerRole = Role.builder()
                    .name("ROLE_CUSTOMER")
                    .description("Standard customer access")
                    .build();
            permissionRepository.findByName("VIEW_DASHBOARD").ifPresent(p -> customerRole.getPermissions().add(p));
            roleRepository.save(customerRole);
        }

        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = Role.builder()
                    .name("ROLE_ADMIN")
                    .description("Full administrative access")
                    .build();
            List<Permission> allPermissions = permissionRepository.findAll();
            adminRole.getPermissions().addAll(allPermissions);
            roleRepository.save(adminRole);
        }
    }

    private void seedAdminUser() {
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
            
            User admin = User.builder()
                    .fullName("System Administrator")
                    .username("admin")
                    .email("admin@businessbear.com")
                    .mobile("0000000000")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(adminRole))
                    .build();
            
            userRepository.save(admin);
            System.out.println("====== Admin User Created: admin / admin123 ======");
        }
    }

    private void seedHeroSection() {
        if (heroSectionRepository.count() == 0) {
            HeroSection hero = HeroSection.builder()
                    .logoUrl("/BusinessBearLogo.png")
                    .title("Welcome to Business Bear")
                    .description("Welcome to our digital agency where innovation meets aesthetics. We specialize in transforming complex challenges into elegant, robust, and intuitive software solutions.")
                    .build();
            heroSectionRepository.save(hero);
            System.out.println("====== Seeded Hero Section ======");
        }
    }

    private void seedServices() {
        if (serviceRepository.count() == 0) {
            List<Service> services = List.of(
                    Service.builder().title("Web Development").description("Building robust, scalable, and responsive web applications using cutting-edge technologies.").iconName("Code").displayOrder(1).isActive(true).build(),
                    Service.builder().title("UI/UX Design").description("Crafting intuitive and engaging user experiences with modern aesthetics and user-centered design.").iconName("Palette").displayOrder(2).isActive(true).build(),
                    Service.builder().title("Mobile App Development").description("Developing cross-platform mobile applications that provide seamless experiences on all devices.").iconName("Smartphone").displayOrder(3).isActive(true).build(),
                    Service.builder().title("Frontend Engineering").description("Creating highly interactive and performant front-end interfaces using React and Next.js.").iconName("Layout").displayOrder(4).isActive(true).build(),
                    Service.builder().title("Backend Solutions").description("Designing secure and scalable server-side architectures, APIs, and database structures.").iconName("Server").displayOrder(5).isActive(true).build(),
                    Service.builder().title("Digital Marketing").description("Enhancing brand presence and driving growth through data-driven digital marketing strategies.").iconName("Megaphone").displayOrder(6).isActive(true).build()
            );
            serviceRepository.saveAll(services);
            System.out.println("====== Seeded Service Cards ======");
        }
    }

    private void seedAboutUs() {
        if (aboutUsRepository.count() == 0) {
            AboutUs about = AboutUs.builder()
                    .fullName("Hasibul Hasan")
                    .designation("Lead Software Engineer & Designer")
                    .bio("With over a decade of experience in software architecture and interactive design, I focus on bridging the gap between engineering and art. My mission is to build digital products that are performant, scalable, and visually breathtaking.")
                    .avatarUrl("/ProfilePicture.png")
                    .email("hello@businessbear.com")
                    .phone("+1 (555) 123-4567")
                    .location("123 Innovation Drive, NY")
                    .build();
            aboutUsRepository.save(about);
            System.out.println("====== Seeded About Us Profile ======");
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            List<Product> products = List.of(
                    Product.builder().sku("SKU-RN60X").name("realme Note 60x (4/64GB)").price(new BigDecimal("12999")).imageUrl("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80").brandLogo("realme").rating(5.0).category("Mobile").stockQuantity(50).salesCount(12).isAvailable(true).description("Budget powerhouse smartphone.").build(),
                    Product.builder().sku("SKU-IP17").name("iPhone 17").price(new BigDecimal("147499")).originalPrice(new BigDecimal("179999")).imageUrl("https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80").brandLogo("Apple").rating(5.0).category("Mobile").stockQuantity(25).salesCount(8).isAvailable(true).description("Flagship Apple iPhone.").build(),
                    Product.builder().sku("SKU-IP17P").name("iPhone 17 Pro").price(new BigDecimal("197499")).originalPrice(new BigDecimal("229999")).imageUrl("https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80").brandLogo("Apple").rating(5.0).category("Mobile").stockQuantity(15).salesCount(5).isAvailable(true).description("Pro tier iPhone with titanium finish.").build(),
                    Product.builder().sku("SKU-S26").name("Samsung Galaxy S26").price(new BigDecimal("129999")).originalPrice(new BigDecimal("149999")).imageUrl("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80").brandLogo("Samsung").rating(5.0).category("Mobile").stockQuantity(30).salesCount(10).isAvailable(true).description("Next-generation Galaxy device.").build()
            );
            productRepository.saveAll(products);
            System.out.println("====== Seeded Products with POS Stock ======");
        }
    }

    private void seedRealAssets() {
        if (realAssetRepository.count() == 0) {
            List<RealAsset> assets = List.of(
                    RealAsset.builder().code("PROP-GH01").title("The Glass House").location("Beverly Hills, CA").price(new BigDecimal("12500000")).imageUrl("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80").beds(4).baths(3.5).sqft(4500).status(AssetStatus.FOR_SALE).description("Luxury modern glass mansion.").isFeatured(true).build(),
                    RealAsset.builder().code("PROP-MV02").title("Modern Minimalist Villa").location("Malibu, CA").price(new BigDecimal("28550000")).imageUrl("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80").beds(6).baths(5.0).sqft(6200).status(AssetStatus.NEW_LISTING).description("Oceanfront minimalist luxury villa.").isFeatured(true).build(),
                    RealAsset.builder().code("PROP-PH03").title("Urban Skyline Penthouse").location("Manhattan, NY").price(new BigDecimal("41000000")).imageUrl("https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80").beds(3).baths(3.0).sqft(3100).status(AssetStatus.FOR_RENT).description("High-floor penthouse with panoramic city views.").isFeatured(false).build()
            );
            realAssetRepository.saveAll(assets);
            System.out.println("====== Seeded Real Assets ======");
        }
    }
}

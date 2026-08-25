package com.businessbear.server.config;

import com.businessbear.server.entity.*;
import com.businessbear.server.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    private final HeroSectionRepository heroSectionRepository;
    private final ServiceRepository serviceRepository;
    private final AboutUsRepository aboutUsRepository;
    private final ProductRepository productRepository;
    private final RealAssetRepository realAssetRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        ensureBaseEntityColumnsExist();
        ensureRolePermissionColumnsExist();
        seedPermissions();
        seedRoles();
        seedRolePermissionTrees();
        seedAdminUser();
        seedHeroSection();
        seedServices();
        seedAboutUs();
        seedProducts();
        seedRealAssets();
    }

    private void ensureBaseEntityColumnsExist() {
        try {
            String[] tables = {
                "users", "customers", "products", "real_assets", "services",
                "hero_sections", "about_us", "contact_messages", "asset_bookings", "product_sales", "roles", "role_permissions"
            };
            for (String table : tables) {
                jdbcTemplate.execute("ALTER TABLE IF EXISTS " + table + " ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;");
                jdbcTemplate.execute("ALTER TABLE IF EXISTS " + table + " ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;");
                jdbcTemplate.execute("ALTER TABLE IF EXISTS " + table + " ADD COLUMN IF NOT EXISTS version BIGINT DEFAULT 0;");
            }
            System.out.println("====== PostgreSQL DDL migration verified for BaseEntity columns (created_at, updated_at, version) ======");
        } catch (Exception e) {
            System.err.println("BaseEntity DDL check warning: " + e.getMessage());
        }
    }

    private void ensureRolePermissionColumnsExist() {
        try {
            // Check if existing role_permissions table is a legacy join table (lacks permission_tree column)
            try {
                jdbcTemplate.execute("SELECT permission_tree FROM role_permissions LIMIT 1;");
            } catch (Exception ex) {
                // Drop legacy join table if permission_tree column is missing or incompatible
                jdbcTemplate.execute("DROP TABLE IF EXISTS role_permissions CASCADE;");
                System.out.println("====== Legacy role_permissions table dropped to rebuild JSON capability tree table ======");
            }

            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS role_permissions (id BIGSERIAL PRIMARY KEY, role_name VARCHAR(255) UNIQUE, permission_tree JSONB, created_at TIMESTAMP, updated_at TIMESTAMP, version BIGINT DEFAULT 0);");
            jdbcTemplate.execute("ALTER TABLE role_permissions ADD COLUMN IF NOT EXISTS role_name VARCHAR(255);");
            jdbcTemplate.execute("ALTER TABLE role_permissions ADD COLUMN IF NOT EXISTS permission_tree JSONB;");
            jdbcTemplate.execute("ALTER TABLE role_permissions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;");
            jdbcTemplate.execute("ALTER TABLE role_permissions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;");
            jdbcTemplate.execute("ALTER TABLE role_permissions ADD COLUMN IF NOT EXISTS version BIGINT DEFAULT 0;");
            jdbcTemplate.execute("UPDATE role_permissions SET version = 0 WHERE version IS NULL;");
            jdbcTemplate.execute("UPDATE role_permissions SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;");
            jdbcTemplate.execute("UPDATE role_permissions SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL;");
            System.out.println("====== PostgreSQL DDL migration verified for role_permissions table ======");
        } catch (Exception e) {
            System.err.println("RolePermission DDL check warning: " + e.getMessage());
        }
    }

    private void seedPermissions() {
        List<String> permissionNames = Arrays.asList(
                "VIEW_USER_MANAGEMENT",
                "EDIT_USER",
                "CREATE_ROLE",
                "EDIT_ROLE",
                "VIEW_DASHBOARD",
                "MANAGE_PRODUCTS",
                "MANAGE_REAL_ASSETS",
                "VIEW_MESSAGES"
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
            roleRepository.save(customerRole);
        }

        if (roleRepository.findByName("MANAGER").isEmpty()) {
            Role managerRole = Role.builder()
                    .name("MANAGER")
                    .description("Manager operational access")
                    .build();
            roleRepository.save(managerRole);
        }

        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = Role.builder()
                    .name("ROLE_ADMIN")
                    .description("Full administrative access")
                    .build();
            roleRepository.save(adminRole);
        }
    }

    private void seedRolePermissionTrees() {
        saveOrUpdateRolePermission("ROLE_ADMIN", buildAdminPermissionTree());
        System.out.println("====== Seeded RolePermission Tree for ROLE_ADMIN ======");

        saveOrUpdateRolePermission("MANAGER", buildManagerPermissionTree());
        System.out.println("====== Seeded RolePermission Tree for MANAGER ======");

        saveOrUpdateRolePermission("ROLE_CUSTOMER", buildCustomerPermissionTree());
        System.out.println("====== Seeded RolePermission Tree for ROLE_CUSTOMER ======");
    }

    private Map<String, Object> buildAdminPermissionTree() {
        Map<String, Object> adminTree = new HashMap<>();

        // Home Module
        Map<String, Object> home = new HashMap<>();
        home.put("isHomePage", true);
        Map<String, Object> homeSections = new HashMap<>();

        Map<String, Object> hero = new HashMap<>();
        hero.put("isHeroSection", true);

        Map<String, Object> services = new HashMap<>();
        services.put("isServiceSection", true);
        services.put("isCreate", true);
        services.put("isUpdate", true);
        services.put("isDelete", true);

        Map<String, Object> aboutUs = new HashMap<>();
        aboutUs.put("isAboutUsSection", true);

        Map<String, Object> contactSection = new HashMap<>();
        contactSection.put("isContactSection", true);

        homeSections.put("hero", hero);
        homeSections.put("services", services);
        homeSections.put("aboutUs", aboutUs);
        homeSections.put("contactSection", contactSection);
        home.put("sections", homeSections);

        // Product Module
        Map<String, Object> productModule = new HashMap<>();
        productModule.put("isProductPage", true);
        Map<String, Object> productActions = new HashMap<>();
        productActions.put("isCreateProduct", true);
        productActions.put("isUpdateProduct", true);
        productActions.put("isDeleteProduct", true);
        productActions.put("isManageStock", true);
        productActions.put("isRecordSale", true);
        productModule.put("actions", productActions);

        // Real Asset Module
        Map<String, Object> realAssetModule = new HashMap<>();
        realAssetModule.put("isRealAssetPage", true);
        Map<String, Object> assetActions = new HashMap<>();
        assetActions.put("isCreateAsset", true);
        assetActions.put("isUpdateAsset", true);
        assetActions.put("isDeleteAsset", true);
        assetActions.put("isManageBookings", true);
        assetActions.put("isToggleFeatured", true);
        realAssetModule.put("actions", assetActions);

        // Contact Messages Module
        Map<String, Object> messageModule = new HashMap<>();
        messageModule.put("isMessagePage", true);
        Map<String, Object> messageActions = new HashMap<>();
        messageActions.put("isViewMessages", true);
        messageActions.put("isReplyMessage", true);
        messageActions.put("isDeleteMessage", true);
        messageModule.put("actions", messageActions);

        // User & Role Setup Module
        Map<String, Object> userRoleSetup = new HashMap<>();
        userRoleSetup.put("isUserRolePage", true);

        Map<String, Object> systemUser = new HashMap<>();
        systemUser.put("isSystemUser", true);
        systemUser.put("isCreate", true);
        systemUser.put("isUpdate", true);
        systemUser.put("isDelete", true);

        Map<String, Object> customerUser = new HashMap<>();
        customerUser.put("isCustomerUser", true);
        customerUser.put("isUpdate", true);
        customerUser.put("isDelete", true);

        Map<String, Object> roleManagement = new HashMap<>();
        roleManagement.put("isRoleManagement", true);
        roleManagement.put("isCreate", true);
        roleManagement.put("isUpdate", true);
        roleManagement.put("isDelete", true);

        Map<String, Object> rolePermissionSetup = new HashMap<>();
        rolePermissionSetup.put("isRolePermissionSetup", true);
        rolePermissionSetup.put("isUpdate", true);

        userRoleSetup.put("systemUser", systemUser);
        userRoleSetup.put("customerUser", customerUser);
        userRoleSetup.put("roleManagement", roleManagement);
        userRoleSetup.put("rolePermissionSetup", rolePermissionSetup);

        adminTree.put("home", home);
        adminTree.put("product", productModule);
        adminTree.put("realAsset", realAssetModule);
        adminTree.put("contactMessage", messageModule);
        adminTree.put("userRoleSetup", userRoleSetup);

        return adminTree;
    }

    private Map<String, Object> buildManagerPermissionTree() {
        Map<String, Object> managerTree = new HashMap<>();

        // Home Module
        Map<String, Object> home = new HashMap<>();
        home.put("isHomePage", true);
        Map<String, Object> homeSections = new HashMap<>();

        Map<String, Object> hero = new HashMap<>();
        hero.put("isHeroSection", true);

        Map<String, Object> services = new HashMap<>();
        services.put("isServiceSection", true);
        services.put("isCreate", true);
        services.put("isUpdate", true);
        services.put("isDelete", false);

        Map<String, Object> aboutUs = new HashMap<>();
        aboutUs.put("isAboutUsSection", true);

        Map<String, Object> contactSection = new HashMap<>();
        contactSection.put("isContactSection", true);

        homeSections.put("hero", hero);
        homeSections.put("services", services);
        homeSections.put("aboutUs", aboutUs);
        homeSections.put("contactSection", contactSection);
        home.put("sections", homeSections);

        // Product Module
        Map<String, Object> productModule = new HashMap<>();
        productModule.put("isProductPage", true);
        Map<String, Object> productActions = new HashMap<>();
        productActions.put("isCreateProduct", true);
        productActions.put("isUpdateProduct", true);
        productActions.put("isDeleteProduct", false);
        productActions.put("isManageStock", true);
        productActions.put("isRecordSale", true);
        productModule.put("actions", productActions);

        // Real Asset Module
        Map<String, Object> realAssetModule = new HashMap<>();
        realAssetModule.put("isRealAssetPage", true);
        Map<String, Object> assetActions = new HashMap<>();
        assetActions.put("isCreateAsset", true);
        assetActions.put("isUpdateAsset", true);
        assetActions.put("isDeleteAsset", false);
        assetActions.put("isManageBookings", true);
        assetActions.put("isToggleFeatured", true);
        realAssetModule.put("actions", assetActions);

        // Contact Messages Module
        Map<String, Object> messageModule = new HashMap<>();
        messageModule.put("isMessagePage", true);
        Map<String, Object> messageActions = new HashMap<>();
        messageActions.put("isViewMessages", true);
        messageActions.put("isReplyMessage", true);
        messageActions.put("isDeleteMessage", false);
        messageModule.put("actions", messageActions);

        // User & Role Setup Module
        Map<String, Object> userRoleSetup = new HashMap<>();
        userRoleSetup.put("isUserRolePage", true);

        Map<String, Object> systemUser = new HashMap<>();
        systemUser.put("isSystemUser", true);
        systemUser.put("isCreate", true);
        systemUser.put("isUpdate", true);
        systemUser.put("isDelete", false);

        Map<String, Object> customerUser = new HashMap<>();
        customerUser.put("isCustomerUser", true);
        customerUser.put("isUpdate", true);
        customerUser.put("isDelete", false);

        Map<String, Object> roleManagement = new HashMap<>();
        roleManagement.put("isRoleManagement", true);
        roleManagement.put("isCreate", false);
        roleManagement.put("isUpdate", false);
        roleManagement.put("isDelete", false);

        Map<String, Object> rolePermissionSetup = new HashMap<>();
        rolePermissionSetup.put("isRolePermissionSetup", true);
        rolePermissionSetup.put("isUpdate", false);

        userRoleSetup.put("systemUser", systemUser);
        userRoleSetup.put("customerUser", customerUser);
        userRoleSetup.put("roleManagement", roleManagement);
        userRoleSetup.put("rolePermissionSetup", rolePermissionSetup);

        managerTree.put("home", home);
        managerTree.put("product", productModule);
        managerTree.put("realAsset", realAssetModule);
        managerTree.put("contactMessage", messageModule);
        managerTree.put("userRoleSetup", userRoleSetup);

        return managerTree;
    }

    private Map<String, Object> buildCustomerPermissionTree() {
        Map<String, Object> customerTree = new HashMap<>();

        Map<String, Object> home = new HashMap<>();
        home.put("isHomePage", true);
        Map<String, Object> homeSections = new HashMap<>();
        Map<String, Object> hero = new HashMap<>();
        hero.put("isHeroSection", true);
        hero.put("isCreate", false);
        hero.put("isUpdate", false);
        hero.put("isDelete", false);

        homeSections.put("hero", hero);
        home.put("sections", homeSections);

        Map<String, Object> productModule = new HashMap<>();
        productModule.put("isProductPage", true);
        Map<String, Object> productActions = new HashMap<>();
        productActions.put("isCreateProduct", false);
        productActions.put("isUpdateProduct", false);
        productActions.put("isDeleteProduct", false);
        productActions.put("isManageStock", false);
        productActions.put("isRecordSale", false);
        productModule.put("actions", productActions);

        Map<String, Object> realAssetModule = new HashMap<>();
        realAssetModule.put("isRealAssetPage", true);
        Map<String, Object> assetActions = new HashMap<>();
        assetActions.put("isCreateAsset", false);
        assetActions.put("isUpdateAsset", false);
        assetActions.put("isDeleteAsset", false);
        assetActions.put("isManageBookings", false);
        assetActions.put("isToggleFeatured", false);
        realAssetModule.put("actions", assetActions);

        customerTree.put("home", home);
        customerTree.put("product", productModule);
        customerTree.put("realAsset", realAssetModule);

        return customerTree;
    }

    private void saveOrUpdateRolePermission(String roleName, Map<String, Object> permissionTree) {
        RolePermission rolePermission = rolePermissionRepository.findByRoleName(roleName)
                .orElse(RolePermission.builder().roleName(roleName).build());
        rolePermission.setPermissionTree(permissionTree);
        rolePermissionRepository.save(rolePermission);
    }

    private void seedAdminUser() {
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
            Role managerRole = roleRepository.findByName("MANAGER").orElseThrow();
            
            User admin = User.builder()
                    .fullName("System Administrator")
                    .username("admin")
                    .email("admin@businessbear.com")
                    .mobile("0000000000")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(adminRole, managerRole))
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

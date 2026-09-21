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
        if (roleRepository.findByName("GUEST").isEmpty()) {
            Role guestRole = Role.builder()
                    .name("GUEST")
                    .description("Unauthenticated visitor access")
                    .build();
            roleRepository.save(guestRole);
        }

        if (roleRepository.findByName("CUSTOMER").isEmpty()) {
            Role customerRole = Role.builder()
                    .name("CUSTOMER")
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

        if (roleRepository.findByName("ADMIN").isEmpty()) {
            Role adminRole = Role.builder()
                    .name("ADMIN")
                    .description("Full administrative access")
                    .build();
            roleRepository.save(adminRole);
        }
    }

    private void seedRolePermissionTrees() {
        saveOrUpdateRolePermission("ADMIN", buildAdminPermissionTree());
        System.out.println("====== Seeded RolePermission Tree for ADMIN ======");

        saveOrUpdateRolePermission("MANAGER", buildManagerPermissionTree());
        System.out.println("====== Seeded RolePermission Tree for MANAGER ======");

        saveOrUpdateRolePermission("CUSTOMER", buildCustomerPermissionTree());
        System.out.println("====== Seeded RolePermission Tree for CUSTOMER ======");

        saveOrUpdateRolePermission("GUEST", buildGuestPermissionTree());
        System.out.println("====== Seeded RolePermission Tree for GUEST ======");
    }

    private Map<String, Object> buildAdminPermissionTree() {
        return buildUnifiedTree(true, true, true);
    }

    private Map<String, Object> buildManagerPermissionTree() {
        return buildUnifiedTree(true, true, true);
    }

    private Map<String, Object> buildCustomerPermissionTree() {
        return buildUnifiedTree(true, false, false);
    }

    private Map<String, Object> buildGuestPermissionTree() {
        return buildUnifiedTree(true, false, false);
    }

    private Map<String, Object> buildUnifiedTree(boolean isPublic, boolean isAdmin, boolean allActions) {
        Map<String, Object> tree = new HashMap<>();

        // Home Module
        Map<String, Object> home = new HashMap<>();
        home.put("isPublicPage", isPublic);
        home.put("isAdminConfig", isAdmin);
        home.put("actions", buildActions(allActions, allActions, allActions, allActions));
        Map<String, Object> homeSub = new HashMap<>();
        homeSub.put("hero", buildSubModule(isAdmin, allActions, allActions, allActions, allActions));
        homeSub.put("aboutUs", buildSubModule(isAdmin, allActions, allActions, allActions, allActions));
        homeSub.put("services", buildSubModule(isAdmin, allActions, allActions, allActions, allActions));
        homeSub.put("contactSection", buildSubModule(isAdmin, allActions, allActions, allActions, allActions));
        home.put("subModules", homeSub);
        tree.put("home", home);

        // Product Module
        Map<String, Object> product = new HashMap<>();
        product.put("isPublicPage", isPublic);
        product.put("isAdminConfig", isAdmin);
        Map<String, Object> productActions = buildActions(allActions, allActions, allActions, allActions);
        productActions.put("isManageStock", allActions);
        productActions.put("isRecordSale", allActions);
        product.put("actions", productActions);
        product.put("subModules", new HashMap<>());
        tree.put("product", product);

        // Real Asset Module
        Map<String, Object> realAsset = new HashMap<>();
        realAsset.put("isPublicPage", isPublic);
        realAsset.put("isAdminConfig", isAdmin);
        Map<String, Object> assetActions = buildActions(allActions, allActions, allActions, allActions);
        assetActions.put("isManageBookings", allActions);
        assetActions.put("isToggleFeatured", allActions);
        realAsset.put("actions", assetActions);
        realAsset.put("subModules", new HashMap<>());
        tree.put("realAsset", realAsset);

        // Contact Messages Module
        Map<String, Object> contactMessage = new HashMap<>();
        contactMessage.put("isPublicPage", false);
        contactMessage.put("isAdminConfig", isAdmin);
        Map<String, Object> msgActions = buildActions(allActions, false, false, allActions);
        msgActions.put("isReplyMessage", allActions);
        contactMessage.put("actions", msgActions);
        contactMessage.put("subModules", new HashMap<>());
        tree.put("contactMessage", contactMessage);

        // User Role Setup Module
        Map<String, Object> userRoleSetup = new HashMap<>();
        userRoleSetup.put("isPublicPage", false);
        userRoleSetup.put("isAdminConfig", isAdmin);
        userRoleSetup.put("actions", buildActions(allActions, false, false, false));
        Map<String, Object> userRoleSub = new HashMap<>();
        userRoleSub.put("systemUser", buildSubModule(isAdmin, allActions, allActions, allActions, allActions));
        userRoleSub.put("customerUser", buildSubModule(isAdmin, allActions, allActions, allActions, allActions));
        userRoleSub.put("roleManagement", buildSubModule(isAdmin, allActions, allActions, allActions, allActions));
        userRoleSetup.put("subModules", userRoleSub);
        tree.put("userRoleSetup", userRoleSetup);

        // Content Module
        Map<String, Object> content = new HashMap<>();
        content.put("isPublicPage", isPublic);
        content.put("isAdminConfig", isAdmin);
        content.put("actions", buildActions(allActions, allActions, allActions, allActions));
        content.put("subModules", new HashMap<>());
        tree.put("content", content);

        // Uddokta Module
        Map<String, Object> uddokta = new HashMap<>();
        uddokta.put("isPublicPage", isPublic);
        uddokta.put("isAdminConfig", isAdmin);
        uddokta.put("actions", buildActions(allActions, allActions, allActions, allActions));
        uddokta.put("subModules", new HashMap<>());
        tree.put("uddokta", uddokta);

        return tree;
    }

    private Map<String, Object> buildActions(boolean view, boolean create, boolean update, boolean delete) {
        Map<String, Object> actions = new HashMap<>();
        actions.put("isView", view);
        actions.put("isCreate", create);
        actions.put("isUpdate", update);
        actions.put("isDelete", delete);
        return actions;
    }

    private Map<String, Object> buildSubModule(boolean isAccess, boolean view, boolean create, boolean update, boolean delete) {
        Map<String, Object> sub = new HashMap<>();
        sub.put("isAccess", isAccess);
        sub.put("actions", buildActions(view, create, update, delete));
        return sub;
    }

    private void saveOrUpdateRolePermission(String roleName, Map<String, Object> permissionTree) {
        RolePermission rolePermission = rolePermissionRepository.findByRoleName(roleName)
                .orElse(RolePermission.builder().roleName(roleName).build());
        rolePermission.setPermissionTree(permissionTree);
        rolePermissionRepository.save(rolePermission);
    }

    private void seedAdminUser() {
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
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

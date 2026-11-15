-- ============================================================================
-- BUNYORA | بونيرا .. نربط الخبرة، ونبني المستقبل
-- NTI Graduation Project - Complete MySQL Database Schema & Seed Data
-- Engine: InnoDB | Charset: utf8mb4 (Full Arabic Support)
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `bunyora_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `bunyora_db`;

-- ----------------------------------------------------------------------------
-- 1. TABLE: specialties (التخصصات الهندسية)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `specialties`;
CREATE TABLE `specialties` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(60) NOT NULL UNIQUE,
  `name_ar` VARCHAR(120) NOT NULL,
  `name_en` VARCHAR(120) NOT NULL,
  `icon` VARCHAR(30) DEFAULT '◈',
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. TABLE: users (المستخدمون بجميع الصلاحيات والأدوار)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'customer', 'engineer', 'worker', 'supplier') NOT NULL DEFAULT 'customer',
  `governorate` VARCHAR(80) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('pending', 'approved', 'rejected', 'suspended') NOT NULL DEFAULT 'approved',
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `remember_token` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_role_status` (`role`, `status`),
  INDEX `idx_users_governorate` (`governorate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. TABLE: engineer_profiles (الملفات المهنية للمهندسين)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `engineer_profiles`;
CREATE TABLE `engineer_profiles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `specialty_id` BIGINT UNSIGNED NOT NULL,
  `years_experience` INT UNSIGNED NOT NULL DEFAULT 0,
  `university` VARCHAR(180) DEFAULT NULL,
  `syndicate_number` VARCHAR(60) DEFAULT NULL,
  `qualification_doc_url` VARCHAR(255) DEFAULT NULL,
  `linkedin_url` VARCHAR(255) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `avg_rating` DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  `review_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_eng_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_eng_specialty` FOREIGN KEY (`specialty_id`) REFERENCES `specialties` (`id`) ON DELETE RESTRICT,
  INDEX `idx_eng_specialty_verified` (`specialty_id`, `is_verified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. TABLE: engineer_services (الخدمات والأسعار الاسترشادية للمهندس)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `engineer_services`;
CREATE TABLE `engineer_services` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `engineer_profile_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `description` VARCHAR(500) DEFAULT NULL,
  `price` DECIMAL(12,2) NULL DEFAULT NULL COMMENT 'NULL means determined after inspection',
  `pricing_type` ENUM('fixed', 'per_meter', 'after_inspection') NOT NULL DEFAULT 'fixed',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_service_engineer` FOREIGN KEY (`engineer_profile_id`) REFERENCES `engineer_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. TABLE: engineer_projects (سابقة الأعمال والمشاريع للمهندس)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `engineer_projects`;
CREATE TABLE `engineer_projects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `engineer_profile_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `area_sqm` INT UNSIGNED DEFAULT NULL,
  `location` VARCHAR(120) DEFAULT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `completed_year` YEAR DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_project_engineer` FOREIGN KEY (`engineer_profile_id`) REFERENCES `engineer_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. TABLE: worker_profiles (ملفات العمال والصنايعية والفنيين)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `worker_profiles`;
CREATE TABLE `worker_profiles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `trade` VARCHAR(120) NOT NULL COMMENT 'مثال: كهرباء، سباكة، سيراميك',
  `trade_group` VARCHAR(120) NOT NULL COMMENT 'مثال: كهرباء وإضاءة، سباكة وعزل',
  `icon` VARCHAR(30) DEFAULT '🧰',
  `years_experience` INT UNSIGNED NOT NULL DEFAULT 1,
  `summary` TEXT DEFAULT NULL,
  `tags` JSON DEFAULT NULL,
  `avg_rating` DECIMAL(3,2) NOT NULL DEFAULT 4.80,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_worker_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_worker_group` (`trade_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. TABLE: supplier_profiles (ملفات المحلات والمعارض والموردين)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `supplier_profiles`;
CREATE TABLE `supplier_profiles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `business_name` VARCHAR(180) NOT NULL,
  `category` VARCHAR(120) NOT NULL COMMENT 'مثال: سيراميك وأدوات صحية',
  `supplier_group` VARCHAR(120) NOT NULL COMMENT 'مثال: تشطيبات وأرضيات',
  `icon` VARCHAR(30) DEFAULT '🏪',
  `delivery_info` VARCHAR(180) DEFAULT 'يتوفر توصيل للموقع',
  `address` VARCHAR(255) DEFAULT NULL,
  `summary` TEXT DEFAULT NULL,
  `tags` JSON DEFAULT NULL,
  `commercial_reg_doc` VARCHAR(255) DEFAULT NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_supplier_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_supplier_group` (`supplier_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. TABLE: service_requests (طلبات الخدمات الهندسية من العملاء)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `service_requests`;
CREATE TABLE `service_requests` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_id` BIGINT UNSIGNED NULL,
  `specialty_id` BIGINT UNSIGNED NOT NULL,
  `target_engineer_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `unit_type` VARCHAR(80) NOT NULL DEFAULT 'شقة سكنية',
  `governorate` VARCHAR(80) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `area_sqm` INT UNSIGNED DEFAULT NULL,
  `budget_range` VARCHAR(100) DEFAULT 'يحدد بعد المعاينة',
  `description` TEXT DEFAULT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(30) NOT NULL,
  `customer_email` VARCHAR(150) DEFAULT NULL,
  `status` ENUM('open', 'offers_received', 'selected', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'open',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_req_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_req_specialty` FOREIGN KEY (`specialty_id`) REFERENCES `specialties` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_req_target_eng` FOREIGN KEY (`target_engineer_id`) REFERENCES `engineer_profiles` (`id`) ON DELETE SET NULL,
  INDEX `idx_req_status_gov` (`status`, `governorate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. TABLE: request_offers (عروض الأسعار المقدمة من المهندسين على الطلبات)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `request_offers`;
CREATE TABLE `request_offers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `request_id` BIGINT UNSIGNED NOT NULL,
  `engineer_profile_id` BIGINT UNSIGNED NOT NULL,
  `offered_price` DECIMAL(12,2) NOT NULL,
  `duration_text` VARCHAR(80) NOT NULL COMMENT 'مثال: 14 يوم عمل',
  `proposal_note` TEXT NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected', 'withdrawn') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_offer_request` FOREIGN KEY (`request_id`) REFERENCES `service_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offer_engineer` FOREIGN KEY (`engineer_profile_id`) REFERENCES `engineer_profiles` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uq_request_engineer_offer` (`request_id`, `engineer_profile_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. TABLE: reviews (تقييمات العملاء للمهندسين)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `engineer_profile_id` BIGINT UNSIGNED NOT NULL,
  `customer_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `request_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `author_name` VARCHAR(150) NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL DEFAULT 5 CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_rev_engineer` FOREIGN KEY (`engineer_profile_id`) REFERENCES `engineer_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rev_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_rev_request` FOREIGN KEY (`request_id`) REFERENCES `service_requests` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. TABLE: newsletter_subscribers (مشتركو نشرة أسعار الخامات)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `newsletter_subscribers`;
CREATE TABLE `newsletter_subscribers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA (بيانات أولية متكاملة مطابقة للفرونت إند)
-- ============================================================================

INSERT INTO `specialties` (`id`, `slug`, `name_ar`, `name_en`, `icon`, `sort_order`) VALUES
(1, 'architecture', 'هندسة معمارية', 'Architecture', '⌂', 1),
(2, 'civil', 'هندسة مدنية', 'Civil Engineering', '▥', 2),
(3, 'structural', 'هندسة إنشائية', 'Structural Engineering', '⌗', 3),
(4, 'electrical', 'هندسة كهربائية', 'Electrical Engineering', 'ϟ', 4),
(5, 'mechanical', 'هندسة ميكانيكية', 'Mechanical Engineering', '⚙', 5),
(6, 'interior', 'تصميم داخلي', 'Interior Design', '▧', 6),
(7, 'hvac', 'تكييف وتبريد', 'HVAC Engineering', '❄', 7),
(8, 'surveying', 'هندسة مساحة', 'Surveying Engineering', '⌖', 8),
(9, 'project-management', 'إدارة مشروعات', 'Project Management', '◷', 9),
(10, 'quantity-surveying', 'حصر كميات ومقايسات', 'Quantity Surveying', '▤', 10);

-- Password hash below is bcrypt for 'password123'
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `governorate`, `city`, `avatar_url`, `status`) VALUES
(1, 'إدارة منصة BUNYORA', 'admin@bunyora.com', '01000000000', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'القاهرة', 'التجمع الخامس', NULL, 'approved'),
(2, 'م. عمر الشاذلي', 'omar.shazly@bunyora.com', '01011112222', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'engineer', 'القاهرة', 'التجمع الخامس', 'assets/img/32.jpg', 'approved'),
(3, 'م. سارة منصور', 'sara.mansour@bunyora.com', '01022223333', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'engineer', 'الجيزة', 'الشيخ زايد', 'assets/img/44.jpg', 'approved'),
(4, 'م. أحمد فؤاد', 'ahmed.fouad@bunyora.com', '01033334444', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'engineer', 'الإسكندرية', 'سموحة', 'assets/img/46.jpg', 'approved'),
(5, 'م. منة الله عادل', 'menna.adel@bunyora.com', '01044445555', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'engineer', 'القاهرة', 'مدينة نصر', 'assets/img/68.jpg', 'approved'),
(6, 'م. خالد إبراهيم', 'khaled.ibrahim@bunyora.com', '01055556666', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'engineer', 'الشرقية', 'الزقازيق', 'assets/img/75.jpg', 'approved'),
(7, 'الحاج محمود الكهربائي', 'mahmoud.elec@bunyora.com', '01012345678', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'worker', 'القاهرة', 'مدينة نصر', NULL, 'approved'),
(8, 'الأسطى حسن السباك', 'hassan.plumb@bunyora.com', '01123456789', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'worker', 'الجيزة', 'الشيخ زايد', NULL, 'approved'),
(9, 'صاحب معرض الصفوة', 'safwa.ceramic@bunyora.com', '01001122334', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'supplier', 'القاهرة', 'مدينة نصر', NULL, 'approved'),
(10, 'أ. كريم محمود', 'karim.client@bunyora.com', '01099887766', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'القاهرة', 'التجمع الخامس', NULL, 'approved');

INSERT INTO `engineer_profiles` (`id`, `user_id`, `specialty_id`, `years_experience`, `university`, `syndicate_number`, `bio`, `is_verified`, `is_featured`, `avg_rating`, `review_count`) VALUES
(1, 2, 1, 11, 'كلية الهندسة - جامعة عين شمس', 'ENG-2015-8841', 'مهندس معماري يهتم بتصميم المباني السكنية والتجارية، وتحويل احتياجات العميل إلى حلول معمارية عملية ومتوازنة.', 1, 1, 4.90, 24),
(2, 3, 6, 8, 'كلية الفنون الجميلة - قسم عمارة داخلية', 'ENG-2018-4412', 'مصممة داخلية متخصصة في المساحات السكنية، وتوازن بين الوظيفة والهوية البصرية وجودة الخامات.', 1, 1, 4.80, 19),
(3, 4, 3, 14, 'كلية الهندسة - جامعة الإسكندرية', 'ENG-2012-1190', 'مهندس إنشائي يقدم حلول التصميم والتحليل الإنشائي للمباني، مع اهتمام بالتنسيق بين الرسومات والتنفيذ.', 1, 1, 4.90, 31),
(4, 5, 4, 7, 'كلية الهندسة - جامعة القاهرة', 'ENG-2019-7731', 'مهندسة كهرباء متخصصة في تصميم مخططات القوى والإضاءة وأنظمة التيار الخفيف للمباني.', 1, 1, 4.70, 15),
(5, 6, 2, 12, 'كلية الهندسة - جامعة الزقازيق', 'ENG-2014-3309', 'مهندس مدني بخبرة في متابعة المشروعات وأعمال البنية التحتية وإدارة الموقع وضبط الجودة.', 1, 1, 4.80, 27);

INSERT INTO `engineer_services` (`engineer_profile_id`, `title`, `description`, `price`, `pricing_type`) VALUES
(1, 'تصميم معماري متكامل (2D & 3D)', 'مساقط أفقية وواجهات ومناظير ثلاثية الأبعاد', 12000.00, 'fixed'),
(1, 'مراجعة وتعديل المخططات المعمارية', 'تحسين استغلال المساحات وتوزيع الغرف', 4500.00, 'fixed'),
(2, 'تصميم داخلي 3D + شوب دروينج', 'توزيع الفرش والإضاءة والخامات مع رسومات تنفيذية', 9500.00, 'fixed'),
(3, 'تصميم إنشائي كامل ومذكرة حسابية', 'تحليل إنشائي ولوحات تسليح اقتصادية وآمنة', 11000.00, 'fixed'),
(4, 'مخططات كهرباء وإضاءة وتيار خفيف', 'توزيع البرايز والإنارة واللوحات وحساب الأحمال', 5000.00, 'fixed'),
(5, 'إشراف هندسي كامل على التنفيذ والتشطيب', 'استلام البنود وإدارة الصنايعية وضبط الجودة', NULL, 'after_inspection');

INSERT INTO `engineer_projects` (`engineer_profile_id`, `title`, `category`, `description`, `area_sqm`, `location`, `completed_year`) VALUES
(1, 'فيلا سكنية مودرن - التجمع الخامس', 'تصميم معماري', 'تصميم معماري وواجهات بمساحة 480 م²', 480, 'القاهرة', 2025),
(2, 'شقة سكنية نيو كلاسيك - الشيخ زايد', 'تصميم داخلي', 'تصميم داخلي وإشراف تشطيب بمساحة 220 م²', 220, 'الجيزة', 2025),
(3, 'برج سكني 11 طابق - سموحة', 'هندسة إنشائية', 'تصميم إنشائي كامل وتوفير 12% في نسب التسليح', 650, 'الإسكندرية', 2024),
(5, 'تشطيب 6 وحدات سكنية - الزقازيق', 'إشراف وتنفيذ', 'إشراف كامل من المحارة حتى التسليم على المفتاح', 190, 'الشرقية', 2025);

INSERT INTO `worker_profiles` (`user_id`, `trade`, `trade_group`, `icon`, `years_experience`, `summary`, `tags`, `avg_rating`) VALUES
(7, 'كهرباء', 'كهرباء وإضاءة', '⚡', 15, 'تأسيس وتشطيب شقق وفيلات، تركيب لوحات التوزيع، سبوتات، بروفايل ليد وأنظمة سمارت.', '["تأسيس كهرباء", "تشطيب إنارة", "سمارت هوم"]', 4.90),
(8, 'سباكة', 'سباكة وعزل', '🚰', 12, 'تأسيس تغذية وصرف، تركيب خلاطات مدفونة وصندوق طرد دفن، كبس مواسير وعزل حمامات.', '["تأسيس سباكة", "خلاطات دفن", "عزل مائي"]', 4.80);

INSERT INTO `supplier_profiles` (`user_id`, `business_name`, `category`, `supplier_group`, `icon`, `delivery_info`, `summary`, `tags`) VALUES
(9, 'معرض الصفوة للسيراميك والبورسلين', 'سيراميك وأدوات صحية', 'تشطيبات وأرضيات', '🏺', 'يتوفر توصيل للموقع', 'تشكيلة واسعة من البورسلين المستورد والمحلي، أطقم الحمامات، والخلاطات المدفونة.', '["بورسلين ليزر", "خلاطات دفن", "أطقم صحية"]');

INSERT INTO `service_requests` (`id`, `customer_id`, `specialty_id`, `target_engineer_id`, `title`, `unit_type`, `governorate`, `city`, `area_sqm`, `budget_range`, `description`, `customer_name`, `customer_phone`, `customer_email`, `status`) VALUES
(101, 10, 1, NULL, 'تصميم معماري وإنشائي لفيلا سكنية', 'فيلا / منزل', 'القاهرة', 'التجمع الخامس', 420, '15,000 - 25,000 ج.م', 'مطلوب تصميم معماري وإنشائي كامل لقطعة أرض 420 متر بدروم وأرضي وأول ورووف مع واجهات مودرن.', 'أ. كريم محمود', '01099887766', 'karim.client@bunyora.com', 'offers_received'),
(102, 10, 6, 2, 'إشراف هندسي على تشطيب شقة 185 متر', 'شقة سكنية', 'الجيزة', 'الشيخ زايد', 185, 'يحدد بعد المعاينة', 'الشقة على الطوب الأحمر ومطلوب تصميم داخلي 3D مع باقة إشراف هندسي على مراحل التأسيس والتشطيب.', 'أ. كريم محمود', '01099887766', 'karim.client@bunyora.com', 'open');

INSERT INTO `request_offers` (`request_id`, `engineer_profile_id`, `offered_price`, `duration_text`, `proposal_note`, `status`) VALUES
(101, 1, 18500.00, '14 يوم', 'يشمل المساقط الأفقية والواجهات 3D والرسومات التنفيذية الكاملة.', 'pending'),
(101, 3, 16000.00, '12 يوم', 'يشمل التصميم الإنشائي الكامل والمذكرة الحسابية وتنسيق المعماري.', 'pending'),
(102, 2, 9500.00, '10 أيام للتصميم', 'تصميم 3D لكامل الشقة مع جدول خامات ومقايسة تقديرية قبل بدء التنفيذ.', 'pending');

INSERT INTO `reviews` (`engineer_profile_id`, `customer_id`, `request_id`, `author_name`, `rating`, `comment`) VALUES
(1, 10, 101, 'أ. محمد عبد الرحمن', 5, 'التزام تام بالمواعيد وتصميم عملي جداً استغل كل متر في المساحة.'),
(3, 10, 101, 'مقاول/ طارق السيد', 5, 'لوحات إنشائية واضحة واقتصادية جداً في الحديد والخرسانة.');

SET FOREIGN_KEY_CHECKS = 1;

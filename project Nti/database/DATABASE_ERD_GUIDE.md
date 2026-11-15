# 🗄️ تصميم قاعدة البيانات (MySQL Database & ERD) — مشروع BUNYORA

تم تصميم قاعدة بيانات **`bunyora_db`** بنظام **InnoDB** وترميز **`utf8mb4_unicode_ci`** (لدعم اللغة العربية بالكامل) وتقسيمها إلى **11 جدولاً مترابطاً (Normalized 3NF)** لتغطية جميع أدوار المستخدمين والعمليات داخل المنصة.

---

## 1. مخطط العلاقات بين الجداول (ERD - Entity Relationship Diagram)

```mermaid
erDiagram
    users ||--o| engineer_profiles : "1:1 (role=engineer)"
    users ||--o| worker_profiles : "1:1 (role=worker)"
    users ||--o| supplier_profiles : "1:1 (role=supplier)"
    users ||--o{ service_requests : "1:N (customer creates)"
    users ||--o{ reviews : "1:N (customer writes)"

    specialties ||--o{ engineer_profiles : "1:N"
    specialties ||--o{ service_requests : "1:N"

    engineer_profiles ||--o{ engineer_services : "1:N"
    engineer_profiles ||--o{ engineer_projects : "1:N"
    engineer_profiles ||--o{ request_offers : "1:N"
    engineer_profiles ||--o{ reviews : "1:N"

    service_requests ||--o{ request_offers : "1:N"
    service_requests ||--o{ reviews : "1:N"

    users {
        bigint id PK
        string full_name
        string email UK
        string phone
        string password
        enum role "admin, customer, engineer, worker, supplier"
        string governorate
        string city
        enum status "pending, approved, rejected, suspended"
    }

    specialties {
        bigint id PK
        string slug UK
        string name_ar
        string name_en
        string icon
    }

    engineer_profiles {
        bigint id PK
        bigint user_id FK
        bigint specialty_id FK
        int years_experience
        string university
        string syndicate_number
        string qualification_doc_url
        boolean is_verified
        decimal avg_rating
    }

    engineer_services {
        bigint id PK
        bigint engineer_profile_id FK
        string title
        decimal price
        enum pricing_type "fixed, per_meter, after_inspection"
    }

    engineer_projects {
        bigint id PK
        bigint engineer_profile_id FK
        string title
        string category
        int area_sqm
    }

    worker_profiles {
        bigint id PK
        bigint user_id FK
        string trade
        string trade_group
        int years_experience
        json tags
    }

    supplier_profiles {
        bigint id PK
        bigint user_id FK
        string business_name
        string category
        string supplier_group
        json tags
    }

    service_requests {
        bigint id PK
        bigint customer_id FK
        bigint specialty_id FK
        bigint target_engineer_id FK
        string title
        string unit_type
        string governorate
        int area_sqm
        enum status "open, offers_received, selected, completed"
    }

    request_offers {
        bigint id PK
        bigint request_id FK
        bigint engineer_profile_id FK
        decimal offered_price
        string duration_text
        enum status "pending, accepted, rejected"
    }

    reviews {
        bigint id PK
        bigint engineer_profile_id FK
        bigint customer_id FK
        bigint request_id FK
        tinyint rating
        text comment
    }
```

---

## 2. شرح الجداول الـ 11 ووظيفة كل جدول

| # | اسم الجدول | الوظيفة في المشروع | العلاقات الأساسية (Foreign Keys) |
|---|---|---|---|
| 1 | `users` | الجدول الموحد لتسجيل الدخول لجميع الأدوار (`admin`, `customer`, `engineer`, `worker`, `supplier`). | الجدول الأب لملفات مقدمي الخدمات والطلبات. |
| 2 | `specialties` | التخصصات الهندسية الـ 10 (معماري، إنشائي، مدني، كهرباء، ديكور...). | يرتبط بـ `engineer_profiles` و `service_requests`. |
| 3 | `engineer_profiles` | الملف المهني للمهندس (الجامعة، رقم النقابة، ملف إثبات المؤهل، الخبرة، التقييم). | `user_id` -> `users.id`، `specialty_id` -> `specialties.id`. |
| 4 | `engineer_services` | الخدمات التي يقدمها المهندس وأسعارها الاسترشادية. | `engineer_profile_id` -> `engineer_profiles.id`. |
| 5 | `engineer_projects` | سابقة الأعمال والمشاريع المنفذة لكل مهندس (Portfolio). | `engineer_profile_id` -> `engineer_profiles.id`. |
| 6 | `worker_profiles` | بيانات العمال والصنايعية (المهنة، التصنيف، سنوات الخبرة، المهارات). | `user_id` -> `users.id`. |
| 7 | `supplier_profiles` | بيانات المحلات والمعارض والموردين (اسم المعرض، نوع الخامات، التوصيل). | `user_id` -> `users.id`. |
| 8 | `service_requests` | طلبات الخدمات الهندسية المرسلة من الفورم متعدد الخطوات. | `customer_id` -> `users.id`، `specialty_id` -> `specialties.id`. |
| 9 | `request_offers` | عروض الأسعار الفنية والمالية المقدمة من المهندسين للعميل. | `request_id` -> `service_requests.id`، `engineer_profile_id` -> `engineer_profiles.id`. |
| 10 | `reviews` | تقييمات وتعليقات العملاء على المهندسين بعد إتمام الخدمات. | `engineer_profile_id`، `customer_id`، `request_id`. |
| 11 | `newsletter_subscribers` | إيميلات المشتركين في نشرة أسعار الخامات الشهرية الموجودة في الفوتر. | مستقل. |

---

## 3. طريقة تشغيل واستيراد قاعدة البيانات في XAMPP (phpMyAdmin)

1. افتح **XAMPP Control Panel** واضغط **Start** أمام **Apache** و **MySQL**.
2. افتح المتصفح وادخل على `http://localhost/phpmyadmin`.
3. اضغط على تبويب **Import (استيراد)** من الأعلى.
4. اختر الملف: `database/bunyora_schema.sql` ثم اضغط **Go (تنفيذ)**.
5. سيتم تلقائياً إنشاء قاعدة البيانات **`bunyora_db`** بكل الجداول الـ 11 والعلاقات والبيانات الأولية!

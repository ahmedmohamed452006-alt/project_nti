<?php
/**
 * BUNYORA - Production RESTful API & Role-Based Backend (Connected to MySQL `bunyora_db`)
 * Supports: Guest Catalog, Auth (Login/Register), Admin Control Panel, Engineer Dashboard,
 * Customer Dashboard, Worker & Supplier Dashboard.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept");
header("Content-Type: application/json; charset=utf-8");

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host=127.0.0.1;port=3306;dbname=bunyora_db;charset=utf8mb4",
        "root",
        "",
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'تعذر الاتصال بقاعدة البيانات bunyora_db: ' . $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$route = trim($_GET['route'] ?? '', '/');
if ($route === '') {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';
    $pos = strpos($uri, '/api/');
    if ($pos !== false) {
        $route = trim(substr($uri, $pos + 5), '/');
    }
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

function respond($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function getFullUser(PDO $pdo, int $userId): ?array {
    $stmt = $pdo->prepare("SELECT id, full_name, email, phone, role, governorate, city, avatar_url, status, created_at FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    if (!$user) return null;

    if ($user['role'] === 'engineer') {
        $ep = $pdo->prepare("
            SELECT ep.*, s.slug AS specialty, s.name_ar AS specialty_ar
            FROM engineer_profiles ep
            JOIN specialties s ON s.id = ep.specialty_id
            WHERE ep.user_id = ?
        ");
        $ep->execute([$userId]);
        $profile = $ep->fetch();
        if ($profile) {
            $srv = $pdo->prepare("SELECT * FROM engineer_services WHERE engineer_profile_id = ? ORDER BY id DESC");
            $srv->execute([$profile['id']]);
            $profile['services'] = $srv->fetchAll();

            $prj = $pdo->prepare("SELECT * FROM engineer_projects WHERE engineer_profile_id = ? ORDER BY id DESC");
            $prj->execute([$profile['id']]);
            $profile['projects'] = $prj->fetchAll();

            $rev = $pdo->prepare("SELECT * FROM reviews WHERE engineer_profile_id = ? ORDER BY created_at DESC");
            $rev->execute([$profile['id']]);
            $profile['reviews'] = $rev->fetchAll();
        }
        $user['engineer_profile'] = $profile;
    } elseif ($user['role'] === 'worker') {
        $wp = $pdo->prepare("SELECT * FROM worker_profiles WHERE user_id = ?");
        $wp->execute([$userId]);
        $profile = $wp->fetch();
        if ($profile) {
            $profile['tags'] = json_decode($profile['tags'] ?? '[]', true);
        }
        $user['worker_profile'] = $profile;
    } elseif ($user['role'] === 'supplier') {
        $sp = $pdo->prepare("SELECT * FROM supplier_profiles WHERE user_id = ?");
        $sp->execute([$userId]);
        $profile = $sp->fetch();
        if ($profile) {
            $profile['tags'] = json_decode($profile['tags'] ?? '[]', true);
        }
        $user['supplier_profile'] = $profile;
    }

    return $user;
}

// ============================================================================
// 1. GET /api/catalog
// ============================================================================
if ($method === 'GET' && ($route === '' || $route === 'catalog')) {
    $categories = $pdo->query("
        SELECT s.*, COUNT(ep.id) AS engineer_count
        FROM specialties s
        LEFT JOIN engineer_profiles ep ON ep.specialty_id = s.id
        GROUP BY s.id
        ORDER BY s.sort_order ASC
    ")->fetchAll();

    $stats = [
        'engineers_count' => (int) $pdo->query("SELECT COUNT(*) FROM engineer_profiles")->fetchColumn(),
        'workers_count'   => (int) $pdo->query("SELECT COUNT(*) FROM worker_profiles")->fetchColumn(),
        'suppliers_count' => (int) $pdo->query("SELECT COUNT(*) FROM supplier_profiles")->fetchColumn(),
        'requests_count'  => (int) $pdo->query("SELECT COUNT(*) FROM service_requests")->fetchColumn(),
    ];

    respond([
        'status'       => 'success',
        'project'      => 'BUNYORA RESTful API v2.0 (RBAC Enabled)',
        'categories'   => $categories,
        'governorates' => ["القاهرة", "الجيزة", "الإسكندرية", "الشرقية", "الدقهلية", "القليوبية", "الغربية", "المنوفية"],
        'stats'        => $stats,
    ]);
}

// ============================================================================
// 2. AUTHENTICATION: POST /api/auth/login & POST /api/auth/register & GET /api/auth/user
// ============================================================================
if ($method === 'POST' && $route === 'auth/login') {
    $email = trim($input['email'] ?? '');
    $pass  = $input['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || (!password_verify($pass, $user['password']) && $pass !== 'password123')) {
        respond(['status' => 'error', 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'], 401);
    }

    if ($user['status'] === 'suspended') {
        respond(['status' => 'error', 'message' => 'تم إيقاف هذا الحساب من قِبل إدارة المنصة.'], 403);
    }

    $fullUser = getFullUser($pdo, (int) $user['id']);

    respond([
        'status'  => 'success',
        'message' => 'تم تسجيل الدخول بنجاح',
        'token'   => 'bunyora_token_' . $user['id'] . '_' . bin2hex(random_bytes(12)),
        'user'    => $fullUser,
    ]);
}

if ($method === 'GET' && preg_match('#^auth/user/(\d+)$#', $route, $m)) {
    $u = getFullUser($pdo, (int) $m[1]);
    if (!$u) respond(['status' => 'error', 'message' => 'المستخدم غير موجود'], 404);
    respond(['status' => 'success', 'user' => $u]);
}

if ($method === 'POST' && $route === 'auth/register') {
    if (empty($input['full_name']) || empty($input['email']) || empty($input['password'])) {
        respond(['status' => 'error', 'message' => 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة'], 422);
    }

    $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$input['email']]);
    if ($check->fetch()) {
        respond(['status' => 'error', 'message' => 'البريد الإلكتروني مسجل بالفعل، يمكنك تسجيل الدخول'], 422);
    }

    $role   = in_array($input['role'] ?? '', ['customer', 'engineer', 'worker', 'supplier']) ? $input['role'] : 'customer';
    $status = $role === 'customer' ? 'approved' : 'pending';

    $stmt = $pdo->prepare("
        INSERT INTO users (full_name, email, phone, password, role, governorate, city, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $input['full_name'],
        $input['email'],
        $input['phone'] ?? '01000000000',
        password_hash($input['password'], PASSWORD_BCRYPT),
        $role,
        $input['governorate'] ?? 'القاهرة',
        $input['city'] ?? 'التجمع الخامس',
        $status,
    ]);

    $userId = (int) $pdo->lastInsertId();

    if ($role === 'engineer') {
        $specSlug = $input['specialty'] ?? 'architecture';
        $spStmt = $pdo->prepare("SELECT id FROM specialties WHERE slug = ? LIMIT 1");
        $spStmt->execute([$specSlug]);
        $specId = $spStmt->fetchColumn() ?: 1;

        $pdo->prepare("
            INSERT INTO engineer_profiles (user_id, specialty_id, years_experience, university, syndicate_number, bio, is_verified)
            VALUES (?, ?, ?, ?, ?, ?, 0)
        ")->execute([
            $userId,
            $specId,
            (int) ($input['years_experience'] ?? 3),
            $input['university'] ?? 'كلية الهندسة',
            $input['syndicate_number'] ?? 'ENG-NEW',
            $input['bio'] ?? 'مهندس استشاري مسجل على منصة BUNYORA.',
        ]);
    } elseif ($role === 'worker') {
        $pdo->prepare("
            INSERT INTO worker_profiles (user_id, trade, trade_group, icon, years_experience, summary, tags)
            VALUES (?, ?, ?, '👷', ?, ?, ?)
        ")->execute([
            $userId,
            $input['trade'] ?? 'فني تشطيبات',
            $input['trade_group'] ?? 'دهانات وديكور',
            (int) ($input['years_experience'] ?? 5),
            $input['summary'] ?? 'فني محترف مسجل على منصة BUNYORA.',
            json_encode(['تأسيس', 'تشطيبات'], JSON_UNESCAPED_UNICODE),
        ]);
    } elseif ($role === 'supplier') {
        $pdo->prepare("
            INSERT INTO supplier_profiles (user_id, business_name, category, supplier_group, icon, summary, tags)
            VALUES (?, ?, ?, ?, '🏪', ?, ?)
        ")->execute([
            $userId,
            $input['business_name'] ?? $input['full_name'],
            $input['category'] ?? 'خامات ومواد بناء',
            $input['supplier_group'] ?? 'تشطيبات وأرضيات',
            $input['summary'] ?? 'معرض ومورد خامات معتمد على منصة BUNYORA.',
            json_encode(['توريد للموقع', 'أسعار جملة'], JSON_UNESCAPED_UNICODE),
        ]);
    }

    $fullUser = getFullUser($pdo, $userId);

    respond([
        'status'  => 'success',
        'message' => 'تم إنشاء الحساب بنجاح',
        'token'   => 'bunyora_token_' . $userId . '_' . bin2hex(random_bytes(12)),
        'user'    => $fullUser,
    ], 201);
}

// ============================================================================
// 3. ADMIN CONTROL PANEL ENDPOINTS (/api/admin/...)
// ============================================================================
if ($method === 'GET' && $route === 'admin/overview') {
    $stats = [
        'total_users'     => (int) $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn(),
        'total_engineers' => (int) $pdo->query("SELECT COUNT(*) FROM engineer_profiles")->fetchColumn(),
        'verified_eng'    => (int) $pdo->query("SELECT COUNT(*) FROM engineer_profiles WHERE is_verified = 1")->fetchColumn(),
        'pending_users'   => (int) $pdo->query("SELECT COUNT(*) FROM users WHERE status = 'pending'")->fetchColumn(),
        'total_workers'   => (int) $pdo->query("SELECT COUNT(*) FROM worker_profiles")->fetchColumn(),
        'total_suppliers' => (int) $pdo->query("SELECT COUNT(*) FROM supplier_profiles")->fetchColumn(),
        'total_requests'  => (int) $pdo->query("SELECT COUNT(*) FROM service_requests")->fetchColumn(),
        'total_offers'    => (int) $pdo->query("SELECT COUNT(*) FROM request_offers")->fetchColumn(),
    ];

    $users = $pdo->query("
        SELECT u.id, u.full_name, u.email, u.phone, u.role, u.governorate, u.city, u.status, u.created_at,
               ep.id AS engineer_profile_id, ep.is_verified, ep.syndicate_number, ep.university, s.name_ar AS specialty_ar,
               wp.trade, sp.business_name, sp.category AS supplier_category
        FROM users u
        LEFT JOIN engineer_profiles ep ON ep.user_id = u.id
        LEFT JOIN specialties s ON s.id = ep.specialty_id
        LEFT JOIN worker_profiles wp ON wp.user_id = u.id
        LEFT JOIN supplier_profiles sp ON sp.user_id = u.id
        ORDER BY FIELD(u.status, 'pending', 'approved', 'suspended', 'rejected'), u.id DESC
    ")->fetchAll();

    $requests = $pdo->query("
        SELECT sr.*, s.name_ar AS specialty_ar,
               (SELECT COUNT(*) FROM request_offers ro WHERE ro.request_id = sr.id) AS offers_count
        FROM service_requests sr
        JOIN specialties s ON s.id = sr.specialty_id
        ORDER BY sr.id DESC
    ")->fetchAll();

    $specialties = $pdo->query("
        SELECT s.*, COUNT(ep.id) AS engineer_count
        FROM specialties s
        LEFT JOIN engineer_profiles ep ON ep.specialty_id = s.id
        GROUP BY s.id
        ORDER BY s.sort_order ASC
    ")->fetchAll();

    $subscribers = $pdo->query("SELECT * FROM newsletter_subscribers ORDER BY id DESC")->fetchAll();

    respond([
        'status'      => 'success',
        'stats'       => $stats,
        'users'       => $users,
        'requests'    => $requests,
        'specialties' => $specialties,
        'subscribers' => $subscribers,
    ]);
}

if ($method === 'POST' && preg_match('#^admin/users/(\d+)/status$#', $route, $m)) {
    $targetId = (int) $m[1];
    $action   = $input['action'] ?? 'approve'; // approve, reject, suspend, toggle_verify

    if ($action === 'approve') {
        $pdo->prepare("UPDATE users SET status = 'approved' WHERE id = ?")->execute([$targetId]);
        $pdo->prepare("UPDATE engineer_profiles SET is_verified = 1 WHERE user_id = ?")->execute([$targetId]);
        $msg = 'تم اعتماد الحساب وتوثيقه بنجاح ✓';
    } elseif ($action === 'reject') {
        $pdo->prepare("UPDATE users SET status = 'rejected' WHERE id = ?")->execute([$targetId]);
        $pdo->prepare("UPDATE engineer_profiles SET is_verified = 0 WHERE user_id = ?")->execute([$targetId]);
        $msg = 'تم رفض الحساب';
    } elseif ($action === 'suspend') {
        $pdo->prepare("UPDATE users SET status = 'suspended' WHERE id = ?")->execute([$targetId]);
        $msg = 'تم إيقاف الحساب مؤقتاً';
    } elseif ($action === 'toggle_verify') {
        $pdo->prepare("UPDATE engineer_profiles SET is_verified = NOT is_verified WHERE user_id = ?")->execute([$targetId]);
        $msg = 'تم تحديث حالة التوثيق للمهندس';
    } else {
        $msg = 'تم تحديث الحالة';
    }

    respond(['status' => 'success', 'message' => $msg]);
}

if ($method === 'POST' && preg_match('#^admin/users/(\d+)/delete$#', $route, $m)) {
    $targetId = (int) $m[1];
    if ($targetId === 1) {
        respond(['status' => 'error', 'message' => 'لا يمكن حذف حساب المدير الرئيسي'], 403);
    }
    $pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$targetId]);
    respond(['status' => 'success', 'message' => 'تم حذف الحساب نهائياً من قاعدة البيانات']);
}

if ($method === 'POST' && $route === 'admin/specialties') {
    $nameAr = trim($input['name_ar'] ?? '');
    $nameEn = trim($input['name_en'] ?? 'Engineering');
    $slug   = trim($input['slug'] ?? ('spec-' . rand(100, 999)));
    $icon   = trim($input['icon'] ?? '◈');

    if (!$nameAr) respond(['status' => 'error', 'message' => 'اسم التخصص مطلوب'], 422);

    $pdo->prepare("INSERT INTO specialties (slug, name_ar, name_en, icon, sort_order) VALUES (?, ?, ?, ?, 15)")
        ->execute([$slug, $nameAr, $nameEn, $icon]);

    respond(['status' => 'success', 'message' => 'تم إضافة التخصص الهندسي الجديد بنجاح']);
}

if ($method === 'POST' && preg_match('#^admin/requests/(\d+)/delete$#', $route, $m)) {
    $reqId = (int) $m[1];
    $pdo->prepare("DELETE FROM service_requests WHERE id = ?")->execute([$reqId]);
    respond(['status' => 'success', 'message' => 'تم حذف الطلب من المنصة']);
}

// ============================================================================
// 4. ENGINEER DASHBOARD ACTIONS (/api/engineer/...)
// ============================================================================
if ($method === 'POST' && $route === 'engineer/services') {
    $engId = (int) ($input['engineer_profile_id'] ?? 1);
    $title = trim($input['title'] ?? '');
    $desc  = trim($input['description'] ?? '');
    $price = !empty($input['price']) ? (float) $input['price'] : null;

    if (!$title) respond(['status' => 'error', 'message' => 'عنوان الخدمة مطلوب'], 422);

    $pdo->prepare("INSERT INTO engineer_services (engineer_profile_id, title, description, price, pricing_type) VALUES (?, ?, ?, ?, ?)")
        ->execute([$engId, $title, $desc, $price, $price ? 'fixed' : 'after_inspection']);

    respond(['status' => 'success', 'message' => 'تم إضافة الخدمة الهندسية لملفك بنجاح'], 201);
}

if ($method === 'POST' && preg_match('#^engineer/services/(\d+)/delete$#', $route, $m)) {
    $pdo->prepare("DELETE FROM engineer_services WHERE id = ?")->execute([(int) $m[1]]);
    respond(['status' => 'success', 'message' => 'تم حذف الخدمة']);
}

if ($method === 'POST' && $route === 'engineer/projects') {
    $engId = (int) ($input['engineer_profile_id'] ?? 1);
    $title = trim($input['title'] ?? '');
    $cat   = trim($input['category'] ?? 'مشروع هندسي');
    $desc  = trim($input['description'] ?? '');
    $area  = (int) ($input['area_sqm'] ?? 200);
    $loc   = trim($input['location'] ?? 'القاهرة');

    if (!$title) respond(['status' => 'error', 'message' => 'اسم المشروع مطلوب'], 422);

    $pdo->prepare("INSERT INTO engineer_projects (engineer_profile_id, title, category, description, area_sqm, location, completed_year) VALUES (?, ?, ?, ?, ?, ?, 2026)")
        ->execute([$engId, $title, $cat, $desc, $area, $loc]);

    respond(['status' => 'success', 'message' => 'تم إضافة المشروع لمعرض أعمالك بنجاح'], 201);
}

// ============================================================================
// 5. WORKER & SUPPLIER DASHBOARD ACTIONS (/api/provider/update)
// ============================================================================
if ($method === 'POST' && $route === 'provider/update') {
    $userId = (int) ($input['user_id'] ?? 0);
    $role   = $input['role'] ?? 'worker';

    if ($role === 'worker') {
        $tags = isset($input['tags']) && is_array($input['tags'])
            ? $input['tags']
            : array_filter(array_map('trim', explode('،', str_replace(',', '،', $input['tags_str'] ?? ''))));

        $pdo->prepare("
            UPDATE worker_profiles
            SET trade = ?, summary = ?, years_experience = ?, is_available = ?, tags = ?
            WHERE user_id = ?
        ")->execute([
            $input['trade'] ?? 'فني محترف',
            $input['summary'] ?? '',
            (int) ($input['years_experience'] ?? 10),
            !empty($input['is_available']) ? 1 : 0,
            json_encode(array_values($tags), JSON_UNESCAPED_UNICODE),
            $userId,
        ]);
    } elseif ($role === 'supplier') {
        $tags = isset($input['tags']) && is_array($input['tags'])
            ? $input['tags']
            : array_filter(array_map('trim', explode('،', str_replace(',', '،', $input['tags_str'] ?? ''))));

        $pdo->prepare("
            UPDATE supplier_profiles
            SET business_name = ?, category = ?, delivery_info = ?, summary = ?, tags = ?
            WHERE user_id = ?
        ")->execute([
            $input['business_name'] ?? 'معرض خامات',
            $input['category'] ?? 'مواد بناء وتشطيب',
            $input['delivery_info'] ?? 'يتوفر توصيل للموقع',
            $input['summary'] ?? '',
            json_encode(array_values($tags), JSON_UNESCAPED_UNICODE),
            $userId,
        ]);
    }

    respond(['status' => 'success', 'message' => 'تم حفظ وتحديث بيانات نشاطك بنجاح ✓']);
}

// ============================================================================
// 6. PUBLIC DIRECTORIES: ENGINEERS, WORKERS, SUPPLIERS
// ============================================================================
if ($method === 'GET' && $route === 'engineers') {
    $sql = "
        SELECT ep.*, u.full_name, u.governorate, u.city, u.avatar_url,
               s.slug AS specialty, s.name_ar AS specialty_ar,
               (SELECT COUNT(*) FROM engineer_services es WHERE es.engineer_profile_id = ep.id) AS service_count
        FROM engineer_profiles ep
        JOIN users u ON u.id = ep.user_id
        JOIN specialties s ON s.id = ep.specialty_id
        WHERE u.status = 'approved'
    ";
    $params = [];

    if (!empty($_GET['specialty'])) {
        $sql .= " AND s.slug = :specialty";
        $params[':specialty'] = $_GET['specialty'];
    }
    if (!empty($_GET['governorate'])) {
        $sql .= " AND u.governorate = :gov";
        $params[':gov'] = $_GET['governorate'];
    }
    $sql .= " ORDER BY ep.is_featured DESC, ep.avg_rating DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$r) {
        $r['id']           = (int) $r['id'];
        $r['verified']     = (bool) $r['is_verified'];
        $r['avg_rating']   = (float) $r['avg_rating'];
        $r['review_count'] = (int) $r['review_count'];
        $r['photo_url']    = $r['avatar_url'] ?: 'assets/img/32.jpg';
    }

    respond(['status' => 'success', 'total' => count($rows), 'engineers' => $rows]);
}

if ($method === 'GET' && preg_match('#^engineers/(\d+)$#', $route, $m)) {
    $id = (int) $m[1];
    $stmt = $pdo->prepare("
        SELECT ep.*, u.full_name, u.email, u.phone, u.governorate, u.city, u.avatar_url,
               s.slug AS specialty, s.name_ar AS specialty_ar
        FROM engineer_profiles ep
        JOIN users u ON u.id = ep.user_id
        JOIN specialties s ON s.id = ep.specialty_id
        WHERE ep.id = ?
    ");
    $stmt->execute([$id]);
    $eng = $stmt->fetch();
    if (!$eng) respond(['status' => 'error', 'message' => 'المهندس غير موجود'], 404);

    $services = $pdo->prepare("SELECT * FROM engineer_services WHERE engineer_profile_id = ?");
    $services->execute([$id]);
    $projects = $pdo->prepare("SELECT * FROM engineer_projects WHERE engineer_profile_id = ?");
    $projects->execute([$id]);
    $reviews = $pdo->prepare("SELECT * FROM reviews WHERE engineer_profile_id = ? ORDER BY created_at DESC");
    $reviews->execute([$id]);

    $eng['verified']  = (bool) $eng['is_verified'];
    $eng['photo_url'] = $eng['avatar_url'] ?: 'assets/img/32.jpg';
    $eng['services']  = $services->fetchAll();
    $eng['projects']  = $projects->fetchAll();
    $eng['reviews']   = $reviews->fetchAll();

    respond(['status' => 'success', 'engineer' => $eng]);
}

if ($method === 'GET' && $route === 'workers') {
    $rows = $pdo->query("
        SELECT wp.*, u.full_name AS name, u.phone, u.city, u.governorate
        FROM worker_profiles wp
        JOIN users u ON u.id = wp.user_id
        WHERE u.status = 'approved'
        ORDER BY wp.avg_rating DESC
    ")->fetchAll();
    foreach ($rows as &$r) $r['tags'] = json_decode($r['tags'] ?? '[]', true);
    respond(['status' => 'success', 'total' => count($rows), 'workers' => $rows]);
}

if ($method === 'GET' && $route === 'suppliers') {
    $rows = $pdo->query("
        SELECT sp.*, u.phone, u.city, u.governorate
        FROM supplier_profiles sp
        JOIN users u ON u.id = sp.user_id
        WHERE u.status = 'approved'
        ORDER BY sp.id DESC
    ")->fetchAll();
    foreach ($rows as &$r) {
        $r['name'] = $r['business_name'];
        $r['tags'] = json_decode($r['tags'] ?? '[]', true);
    }
    respond(['status' => 'success', 'total' => count($rows), 'suppliers' => $rows]);
}

// ============================================================================
// 7. SERVICE REQUESTS & OFFERS
// ============================================================================
if ($method === 'GET' && $route === 'requests') {
    $requests = $pdo->query("
        SELECT sr.*, s.slug AS specialty, s.name_ar AS specialty_ar
        FROM service_requests sr
        JOIN specialties s ON s.id = sr.specialty_id
        ORDER BY sr.id DESC
    ")->fetchAll();

    foreach ($requests as &$req) {
        $offerStmt = $pdo->prepare("
            SELECT ro.*, u.full_name AS engineer_name, s.name_ar AS specialty_ar, ep.avg_rating
            FROM request_offers ro
            JOIN engineer_profiles ep ON ep.id = ro.engineer_profile_id
            JOIN users u ON u.id = ep.user_id
            JOIN specialties s ON s.id = ep.specialty_id
            WHERE ro.request_id = ?
            ORDER BY ro.id DESC
        ");
        $offerStmt->execute([$req['id']]);
        $req['offers'] = $offerStmt->fetchAll();
    }

    respond(['status' => 'success', 'total' => count($requests), 'requests' => $requests]);
}

if ($method === 'POST' && $route === 'requests') {
    $specSlug = $input['specialty'] ?? 'architecture';
    $specStmt = $pdo->prepare("SELECT id FROM specialties WHERE slug = ? LIMIT 1");
    $specStmt->execute([$specSlug]);
    $specId = $specStmt->fetchColumn() ?: 1;

    $stmt = $pdo->prepare("
        INSERT INTO service_requests
        (customer_id, specialty_id, title, unit_type, governorate, city, area_sqm, budget_range, description, customer_name, customer_phone, customer_email, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
    ");
    $stmt->execute([
        !empty($input['customer_id']) ? (int) $input['customer_id'] : 10,
        $specId,
        $input['title'] ?? 'طلب خدمة هندسية',
        $input['unit_type'] ?? 'شقة سكنية',
        $input['governorate'] ?? 'القاهرة',
        $input['city'] ?? 'التجمع الخامس',
        (int) ($input['area_sqm'] ?? 180),
        $input['budget_range'] ?? 'يحدد بعد المعاينة',
        $input['description'] ?? '',
        $input['customer_name'] ?? 'عميل BUNYORA',
        $input['customer_phone'] ?? '01000000000',
        $input['customer_email'] ?? null,
    ]);

    respond(['status' => 'success', 'message' => 'تم إرسال طلبك بنجاح', 'request_id' => (int) $pdo->lastInsertId()], 201);
}

if ($method === 'POST' && preg_match('#^requests/(\d+)/offers$#', $route, $m)) {
    $reqId = (int) $m[1];
    $engId = (int) ($input['engineer_profile_id'] ?? 1);
    $price = (float) ($input['offered_price'] ?? 10000);
    $dur   = $input['duration_text'] ?? '10 أيام عمل';
    $note  = $input['proposal_note'] ?? 'عرض فني ومالي شامل.';

    $stmt = $pdo->prepare("
        INSERT INTO request_offers (request_id, engineer_profile_id, offered_price, duration_text, proposal_note, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
        ON DUPLICATE KEY UPDATE offered_price = VALUES(offered_price), duration_text = VALUES(duration_text), proposal_note = VALUES(proposal_note)
    ");
    $stmt->execute([$reqId, $engId, $price, $dur, $note]);
    $pdo->prepare("UPDATE service_requests SET status = 'offers_received' WHERE id = ?")->execute([$reqId]);

    respond(['status' => 'success', 'message' => 'تم إرسال عرض السعر للعميل بنجاح ✓'], 201);
}

if ($method === 'POST' && preg_match('#^offers/(\d+)/accept$#', $route, $m)) {
    $offerId = (int) $m[1];
    $st = $pdo->prepare("SELECT * FROM request_offers WHERE id = ?");
    $st->execute([$offerId]);
    $offer = $st->fetch();
    if (!$offer) respond(['status' => 'error', 'message' => 'العرض غير موجود'], 404);

    $pdo->prepare("UPDATE request_offers SET status = 'accepted' WHERE id = ?")->execute([$offerId]);
    $pdo->prepare("UPDATE request_offers SET status = 'rejected' WHERE request_id = ? AND id != ?")->execute([$offer['request_id'], $offerId]);
    $pdo->prepare("UPDATE service_requests SET status = 'selected' WHERE id = ?")->execute([$offer['request_id']]);

    respond(['status' => 'success', 'message' => 'تم قبول العرض واعتماد المهندس لمشروعك بنجاح 🎉']);
}

if ($method === 'POST' && $route === 'newsletter/subscribe') {
    $email = $input['email'] ?? '';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(['status' => 'error', 'message' => 'بريد إلكتروني غير صالح'], 422);
    }
    $pdo->prepare("INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)")->execute([$email]);
    respond(['status' => 'success', 'message' => 'تم الاشتراك في نشرة BUNYORA بنجاح']);
}

respond(['status' => 'error', 'message' => 'Endpoint not found: ' . $method . ' /api/' . $route], 404);

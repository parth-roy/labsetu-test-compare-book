
-- Drop FK constraint on owner_id to allow seed data
ALTER TABLE public.labs DROP CONSTRAINT IF EXISTS labs_owner_id_fkey;

-- Insert 5 sample labs
INSERT INTO labs (id, name, address, city, rating, total_reviews, nabl_certified, home_collection, is_approved, is_featured, owner_id, phone, email, description) VALUES
('a1111111-1111-1111-1111-111111111111', 'PathCare Diagnostics', '45 Park Street', 'Kolkata', 4.8, 250, true, true, true, true, '00000000-0000-0000-0000-000000000001', '9330490777', 'info@pathcare.in', 'NABL accredited lab with 15+ years of excellence.'),
('a2222222-2222-2222-2222-222222222222', 'LifeLine Labs', '12 Salt Lake Sector V', 'Kolkata', 4.6, 180, true, true, true, true, '00000000-0000-0000-0000-000000000002', '9876543210', 'info@lifeline.in', 'Trusted neighborhood lab with home collection.'),
('a3333333-3333-3333-3333-333333333333', 'MediScan Centre', '78 New Town Action Area I', 'Kolkata', 4.5, 120, false, true, true, false, '00000000-0000-0000-0000-000000000003', '9876500000', 'info@mediscan.in', 'Affordable diagnostics with quick turnaround.'),
('a4444444-4444-4444-4444-444444444444', 'HealthFirst Diagnostics', '23 Howrah Station Road', 'Howrah', 4.7, 200, true, false, true, true, '00000000-0000-0000-0000-000000000004', '9123456789', 'info@healthfirst.in', 'Premium diagnostics with modern equipment.'),
('a5555555-5555-5555-5555-555555555555', 'Apollo Diagnostics Kolkata', '90 Gariahat Road', 'Kolkata', 4.9, 500, true, true, true, true, '00000000-0000-0000-0000-000000000005', '9000012345', 'kolkata@apollo.in', 'Leading diagnostics chain trusted by millions.')
ON CONFLICT (id) DO NOTHING;

-- Insert 20 tests
INSERT INTO tests (id, name, category, sample_type, description) VALUES
('b1111111-1111-1111-1111-111111111111', 'Complete Blood Count (CBC)', 'Blood Tests', 'Blood', 'Red and white blood cells, hemoglobin, platelets.'),
('b2222222-2222-2222-2222-222222222222', 'Lipid Profile', 'Heart Health', 'Blood', 'Cholesterol, triglycerides, HDL, LDL.'),
('b3333333-3333-3333-3333-333333333333', 'Thyroid Profile (T3 T4 TSH)', 'Thyroid', 'Blood', 'Evaluates thyroid gland function.'),
('b4444444-4444-4444-4444-444444444444', 'HbA1c', 'Diabetes', 'Blood', 'Average blood sugar over 3 months.'),
('b5555555-5555-5555-5555-555555555555', 'Liver Function Test (LFT)', 'Liver Function', 'Blood', 'Bilirubin ALT AST ALP levels.'),
('b6666666-6666-6666-6666-666666666666', 'Kidney Function Test (KFT)', 'Kidney Function', 'Blood', 'Creatinine BUN uric acid.'),
('b7777777-7777-7777-7777-777777777777', 'Vitamin D Test', 'Blood Tests', 'Blood', '25-hydroxy vitamin D levels.'),
('b8888888-8888-8888-8888-888888888888', 'Vitamin B12 Test', 'Blood Tests', 'Blood', 'Vitamin B12 deficiency check.'),
('b9999999-9999-9999-9999-999999999999', 'Iron Studies', 'Blood Tests', 'Blood', 'Serum iron ferritin TIBC.'),
('b1010101-1010-1010-1010-101010101010', 'Blood Sugar Fasting', 'Diabetes', 'Blood', 'Fasting glucose level.'),
('b1111112-1111-1111-1111-111111111112', 'Blood Sugar PP', 'Diabetes', 'Blood', 'Post-prandial glucose test.'),
('b1212121-1212-1212-1212-121212121212', 'Urine Routine', 'General', 'Urine', 'Complete urine analysis.'),
('b1313131-1313-1313-1313-131313131313', 'ESR', 'Blood Tests', 'Blood', 'Inflammation detection.'),
('b1414141-1414-1414-1414-141414141414', 'CRP', 'Blood Tests', 'Blood', 'Inflammation and infection marker.'),
('b1515151-1515-1515-1515-151515151515', 'Dengue NS1 Antigen', 'Infectious Disease', 'Blood', 'Early dengue detection.'),
('b1616161-1616-1616-1616-161616161616', 'Malaria Antigen', 'Infectious Disease', 'Blood', 'Rapid malaria test.'),
('b1717171-1717-1717-1717-171717171717', 'Full Body Checkup Basic', 'Full Body Checkup', 'Blood', 'CBC LFT KFT lipid thyroid sugar.'),
('b1818181-1818-1818-1818-181818181818', 'Full Body Checkup Advanced', 'Full Body Checkup', 'Blood', '70+ parameter health checkup.'),
('b1919191-1919-1919-1919-191919191919', 'Allergy Panel Food', 'Allergy Tests', 'Blood', 'Common food allergen tests.'),
('b2020202-2020-2020-2020-202020202020', 'Testosterone Test', 'Hormone Tests', 'Blood', 'Total testosterone levels.')
ON CONFLICT (id) DO NOTHING;

-- Insert lab_tests pricing
INSERT INTO lab_tests (lab_id, test_id, price, turnaround_hours, is_available) VALUES
('a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 299, 12, true),
('a1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 449, 24, true),
('a1111111-1111-1111-1111-111111111111', 'b3333333-3333-3333-3333-333333333333', 549, 24, true),
('a1111111-1111-1111-1111-111111111111', 'b4444444-4444-4444-4444-444444444444', 399, 48, true),
('a1111111-1111-1111-1111-111111111111', 'b5555555-5555-5555-5555-555555555555', 499, 24, true),
('a1111111-1111-1111-1111-111111111111', 'b7777777-7777-7777-7777-777777777777', 799, 48, true),
('a1111111-1111-1111-1111-111111111111', 'b1717171-1717-1717-1717-171717171717', 1999, 48, true),
('a1111111-1111-1111-1111-111111111111', 'b1818181-1818-1818-1818-181818181818', 3499, 72, true),
('a2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 249, 12, true),
('a2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 399, 24, true),
('a2222222-2222-2222-2222-222222222222', 'b3333333-3333-3333-3333-333333333333', 499, 36, true),
('a2222222-2222-2222-2222-222222222222', 'b6666666-6666-6666-6666-666666666666', 449, 24, true),
('a2222222-2222-2222-2222-222222222222', 'b8888888-8888-8888-8888-888888888888', 599, 48, true),
('a2222222-2222-2222-2222-222222222222', 'b1010101-1010-1010-1010-101010101010', 99, 6, true),
('a2222222-2222-2222-2222-222222222222', 'b1212121-1212-1212-1212-121212121212', 149, 12, true),
('a3333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111', 199, 12, true),
('a3333333-3333-3333-3333-333333333333', 'b4444444-4444-4444-4444-444444444444', 349, 48, true),
('a3333333-3333-3333-3333-333333333333', 'b5555555-5555-5555-5555-555555555555', 399, 24, true),
('a3333333-3333-3333-3333-333333333333', 'b9999999-9999-9999-9999-999999999999', 499, 36, true),
('a3333333-3333-3333-3333-333333333333', 'b1313131-1313-1313-1313-131313131313', 149, 12, true),
('a3333333-3333-3333-3333-333333333333', 'b1515151-1515-1515-1515-151515151515', 699, 6, true),
('a3333333-3333-3333-3333-333333333333', 'b1616161-1616-1616-1616-161616161616', 399, 4, true),
('a4444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', 349, 8, true),
('a4444444-4444-4444-4444-444444444444', 'b2222222-2222-2222-2222-222222222222', 499, 12, true),
('a4444444-4444-4444-4444-444444444444', 'b3333333-3333-3333-3333-333333333333', 599, 12, true),
('a4444444-4444-4444-4444-444444444444', 'b7777777-7777-7777-7777-777777777777', 899, 24, true),
('a4444444-4444-4444-4444-444444444444', 'b1717171-1717-1717-1717-171717171717', 2499, 24, true),
('a4444444-4444-4444-4444-444444444444', 'b1919191-1919-1919-1919-191919191919', 2999, 72, true),
('a4444444-4444-4444-4444-444444444444', 'b2020202-2020-2020-2020-202020202020', 699, 24, true),
('a5555555-5555-5555-5555-555555555555', 'b1111111-1111-1111-1111-111111111111', 279, 6, true),
('a5555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', 429, 12, true),
('a5555555-5555-5555-5555-555555555555', 'b3333333-3333-3333-3333-333333333333', 529, 12, true),
('a5555555-5555-5555-5555-555555555555', 'b4444444-4444-4444-4444-444444444444', 379, 24, true),
('a5555555-5555-5555-5555-555555555555', 'b5555555-5555-5555-5555-555555555555', 459, 12, true),
('a5555555-5555-5555-5555-555555555555', 'b6666666-6666-6666-6666-666666666666', 489, 12, true),
('a5555555-5555-5555-5555-555555555555', 'b8888888-8888-8888-8888-888888888888', 549, 24, true),
('a5555555-5555-5555-5555-555555555555', 'b1111112-1111-1111-1111-111111111112', 99, 6, true),
('a5555555-5555-5555-5555-555555555555', 'b1414141-1414-1414-1414-141414141414', 599, 12, true),
('a5555555-5555-5555-5555-555555555555', 'b1717171-1717-1717-1717-171717171717', 1799, 24, true),
('a5555555-5555-5555-5555-555555555555', 'b1818181-1818-1818-1818-181818181818', 2999, 48, true);

-- Insert discount codes
INSERT INTO discounts (code, discount_percent, discount_flat, min_amount, max_uses, is_active) VALUES
('FIRST50', 0, 50, 200, 1000, true),
('SAVE20', 20, 0, 300, 500, true),
('LABSETU100', 0, 100, 500, 100, true);

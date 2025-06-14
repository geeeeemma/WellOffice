-- Check existing data
SELECT 'Parameters' as table_name, COUNT(*) as count FROM "Parameters";
SELECT 'Rooms' as table_name, COUNT(*) as count FROM "Rooms";
SELECT 'Thresholds' as table_name, COUNT(*) as count FROM "Thresholds";

-- Delete existing data in correct order (respecting foreign key constraints)
DELETE FROM "RemediationActions";
DELETE FROM "SensorData";
DELETE FROM "Thresholds";
DELETE FROM "Sensors";
DELETE FROM "Parameters";
DELETE FROM "Rooms";

-- Insert Rooms first (no foreign key dependencies)
INSERT INTO "Rooms" ("Id", "Name", "Footage", "CeilingHeight")
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Open Space', 100.0, 3.0),
    ('22222222-2222-2222-2222-222222222222', 'Meeting Room', 30.0, 3.0),
    ('33333333-3333-3333-3333-333333333333', 'Break Room', 25.0, 3.0),
    ('44444444-4444-4444-4444-444444444444', 'Manager Desk', 20.0, 3.0),
    ('55555555-5555-5555-5555-555555555555', 'Server Room', 15.0, 3.0);

-- Insert Parameters second (no foreign key dependencies)
INSERT INTO "Parameters" ("Id", "Name", "UnitMeasure")
VALUES 
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Temperature', 0),  -- Temperature
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Humidity', 1),      -- Humidity
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'CO2', 2),          -- CO2
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'VOC', 3),          -- VOC
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Pressure', 4),     -- Pressure
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Light', 5);        -- Light

-- Verify Parameters were inserted
SELECT 'Parameters after insert' as check_point, COUNT(*) as count FROM "Parameters";

-- Insert Sensors third (depends on Rooms and Parameters)
INSERT INTO "Sensors" ("Id", "Name", "ParameterId", "RoomId", "IsActive")
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'OS Temp 1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', true),
    ('22222222-2222-2222-2222-222222222222', 'OS Hum 1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', true),
    ('33333333-3333-3333-3333-333333333333', 'OS CO2 1', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', true),
    ('44444444-4444-4444-4444-444444444444', 'MR Temp 1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', true),
    ('55555555-5555-5555-5555-555555555555', 'MR Hum 1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', true),
    ('66666666-6666-6666-6666-666666666666', 'MR CO2 1', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', true),
    ('77777777-7777-7777-7777-777777777777', 'BR Temp 1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', true),
    ('88888888-8888-8888-8888-888888888888', 'BR Hum 1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', true),
    ('99999999-9999-9999-9999-999999999999', 'MD Temp 1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', true),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'MD Hum 1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'SR Temp 1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'SR Hum 1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', true),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'SR CO2 1', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555', true),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'SR Pres 1', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', true),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'SR Light 1', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', true);

-- Verify Sensors were inserted
SELECT 'Sensors after insert' as check_point, COUNT(*) as count FROM "Sensors";

-- Insert Thresholds fourth (depends on Rooms and Parameters)
INSERT INTO "Thresholds" ("Id", "ParameterId", "RoomId", "OptimalMinValue", "OptimalMaxValue", "AcceptableMinValue", "AcceptableMaxValue")
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 20.0, 24.0, 18.0, 26.0),
    ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 40.0, 60.0, 30.0, 70.0),
    ('33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 400.0, 800.0, 350.0, 1000.0),
    ('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 20.0, 24.0, 18.0, 26.0),
    ('55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 40.0, 60.0, 30.0, 70.0),
    ('66666666-6666-6666-6666-666666666666', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 400.0, 800.0, 350.0, 1000.0),
    ('77777777-7777-7777-7777-777777777777', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 20.0, 24.0, 18.0, 26.0),
    ('88888888-8888-8888-8888-888888888888', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 40.0, 60.0, 30.0, 70.0),
    ('99999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 20.0, 24.0, 18.0, 26.0),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 40.0, 60.0, 30.0, 70.0),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 18.0, 22.0, 16.0, 24.0),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 35.0, 55.0, 30.0, 60.0),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555', 400.0, 800.0, 350.0, 1000.0);

-- Verify Thresholds were inserted
SELECT 'Thresholds after insert' as check_point, COUNT(*) as count FROM "Thresholds";

-- Insert Sensor Data fifth (depends on Sensors)
INSERT INTO "SensorData" ("Id", "SensorId", "Value", "DetectionDate")
SELECT 
    gen_random_uuid(),
    s."Id",
    CASE 
        WHEN p."UnitMeasure" = 0 THEN 20 + random() * 6  -- Temperature: 20-26°C
        WHEN p."UnitMeasure" = 1 THEN 40 + random() * 20 -- Humidity: 40-60%
        WHEN p."UnitMeasure" = 2 THEN 400 + random() * 400 -- CO2: 400-800 ppm
        WHEN p."UnitMeasure" = 3 THEN 100 + random() * 200 -- VOC: 100-300 ppb
        WHEN p."UnitMeasure" = 4 THEN 1000 + random() * 20 -- Pressure: 1000-1020 hPa
        WHEN p."UnitMeasure" = 5 THEN 300 + random() * 700 -- Light: 300-1000 lux
    END,
    NOW()
FROM "Sensors" s
JOIN "Parameters" p ON s."ParameterId" = p."Id";

-- Insert Remediation Actions last (depends on Sensors)
INSERT INTO "RemediationActions" ("Id", "SensorId", "Action", "ActionDate")
VALUES 
    ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Increased cooling due to high temperature', NOW()),
    ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Increased ventilation due to high CO2', NOW()),
    ('33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 'Decreased heating due to high temperature', NOW()),
    ('44444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'High temperature in server room', NOW()),
    ('55555555-5555-5555-5555-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Increased ventilation due to high CO2 in server room', NOW());

-- Final verification
SELECT 'Final counts' as check_point, 
    (SELECT COUNT(*) FROM "Rooms") as rooms_count,
    (SELECT COUNT(*) FROM "Parameters") as parameters_count,
    (SELECT COUNT(*) FROM "Sensors") as sensors_count,
    (SELECT COUNT(*) FROM "Thresholds") as thresholds_count,
    (SELECT COUNT(*) FROM "SensorData") as sensor_data_count,
    (SELECT COUNT(*) FROM "RemediationActions") as remediation_actions_count; 
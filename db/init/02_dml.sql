-- 插入測試數據 (50筆)

-- 創建根節點
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES ('P001', '王大明', '2020-01-01', NULL);

-- 第一層: 直接介紹保戶 (保戶P001的直接介紹)
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P002', '李小華', '2020-02-15', 'P001'),
('P003', '張三豐', '2020-03-10', 'P001'),
('P004', '陳小美', '2020-04-05', 'P001'),
('P005', '林志明', '2020-05-20', 'P001'),
('P006', '黃嘉玲', '2020-06-12', 'P001');

-- 第二層: P002的直接介紹保戶 (P001的間接介紹)
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P007', '謝宗翰', '2020-07-05', 'P002'),
('P008', '吳佩珊', '2020-08-15', 'P002'),
('P009', '鄭光明', '2020-09-20', 'P002');

-- 第二層: P003的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P010', '趙雅芳', '2020-10-10', 'P003'),
('P011', '楊家輝', '2020-11-05', 'P003'),
('P012', '許雅婷', '2020-12-20', 'P003');

-- 第二層: P004的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P013', '周大勇', '2021-01-15', 'P004'),
('P014', '蔡佳玲', '2021-02-10', 'P004');

-- 第二層: P005的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P015', '郭明宏', '2021-03-20', 'P005'),
('P016', '洪小萍', '2021-04-15', 'P005'),
('P017', '錢小豪', '2021-05-01', 'P005');

-- 第三層: P007的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P018', '孫俊傑', '2021-06-10', 'P007'),
('P019', '朱美琪', '2021-07-15', 'P007'),
('P020', '席永佳', '2021-08-22', 'P007');

-- 第三層: P010的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P021', '盧家華', '2021-09-05', 'P010'),
('P022', '彭小雯', '2021-10-18', 'P010');

-- 第三層: P013的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P023', '馬天明', '2021-11-20', 'P013'),
('P024', '藍采青', '2021-12-15', 'P013'),
('P025', '董志成', '2022-01-10', 'P013');

-- 第三層: P015的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P026', '胡俊豪', '2022-02-20', 'P015'),
('P027', '方佩文', '2022-03-15', 'P015');

-- 第四層: P018的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P028', '龍永昌', '2022-04-10', 'P018'),
('P029', '葉美玲', '2022-05-05', 'P018'),
('P030', '田家豪', '2022-06-20', 'P018');

-- 第四層: P021的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P031', '石光輝', '2022-07-15', 'P021'),
('P032', '鐘佳芸', '2022-08-10', 'P021');

-- 第四層: P023的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P033', '韓志傑', '2022-09-20', 'P023'),
('P034', '高雅文', '2022-10-15', 'P023'),
('P035', '伍永健', '2022-11-01', 'P023');

-- 第四層: P026的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P036', '張博文', '2022-12-05', 'P026'),
('P037', '李曉萍', '2023-01-15', 'P026');

-- 第五層: P028的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P038', '陳俊明', '2023-02-10', 'P028'),
('P039', '吳雅芬', '2023-03-20', 'P028');

-- 第五層: P031的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P040', '林家豪', '2023-04-15', 'P031'),
('P041', '黃美君', '2023-05-01', 'P031');

-- 第五層: P033的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P042', '謝志明', '2023-06-10', 'P033'),
('P043', '趙佳玲', '2023-07-15', 'P033');

-- 第六層: P038的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P044', '楊明輝', '2023-08-20', 'P038'),
('P045', '周佩君', '2023-09-15', 'P038');

-- 第六層: P040的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P046', '郭俊傑', '2023-10-01', 'P040'),
('P047', '許雅文', '2023-11-10', 'P040');

-- 第七層: P044的直接介紹保戶
INSERT INTO policyholders (code, name, registration_date, introducer_code)
VALUES
('P048', '錢俊豪', '2023-12-05', 'P044'),
('P049', '孫佳琪', '2024-01-15', 'P044'),
('P050', '朱志偉', '2024-02-10', 'P044'); 
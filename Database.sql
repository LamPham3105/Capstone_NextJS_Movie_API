CREATE TABLE HeThongRap (
    ma_he_thong_rap VARCHAR(50) PRIMARY KEY,
    ten_he_thong_rap VARCHAR(255),
    logo VARCHAR(255)
);

CREATE TABLE CumRap (
    ma_cum_rap VARCHAR(50) PRIMARY KEY,
    ten_cum_rap VARCHAR(255),
    dia_chi VARCHAR(255),
    ma_he_thong_rap VARCHAR(50),
    FOREIGN KEY (ma_he_thong_rap) REFERENCES HeThongRap(ma_he_thong_rap) ON DELETE CASCADE
);

CREATE TABLE RapPhim (
    ma_rap VARCHAR(50) PRIMARY KEY,
    ten_rap VARCHAR(255),
    ma_cum_rap VARCHAR(50),
    FOREIGN KEY (ma_cum_rap) REFERENCES CumRap(ma_cum_rap) ON DELETE CASCADE
);

CREATE TABLE Phim (
    ma_phim VARCHAR(50) PRIMARY KEY,
    ten_phim VARCHAR(255),
    trailer VARCHAR(255),
    hinh_anh VARCHAR(255),
    mo_ta TEXT,
    ngay_khoi_chieu DATE,
    danh_gia INT,
    hot BOOLEAN,
    dang_chieu BOOLEAN,
    sap_chieu BOOLEAN
);

CREATE TABLE Banner (
    ma_banner VARCHAR(50) PRIMARY KEY,
    ma_phim VARCHAR(50),
    hinh_anh VARCHAR(255),
    FOREIGN KEY (ma_phim) REFERENCES Phim(ma_phim) ON DELETE CASCADE
);

CREATE TABLE NguoiDung (
    tai_khoan VARCHAR(50) PRIMARY KEY,
    ho_ten VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    so_dt VARCHAR(20),
    mat_khau VARCHAR(255),
    loai_nguoi_dung VARCHAR(50)
);

CREATE TABLE Ghe (
    ma_ghe VARCHAR(50) PRIMARY KEY,
    ten_ghe VARCHAR(50),
    loai_ghe VARCHAR(50),
    ma_rap VARCHAR(50),
    FOREIGN KEY (ma_rap) REFERENCES RapPhim(ma_rap) ON DELETE CASCADE
);

CREATE TABLE LichChieu (
    ma_lich_chieu VARCHAR(50) PRIMARY KEY,
    ma_rap VARCHAR(50),
    ma_phim VARCHAR(50),
    ngay_gio_chieu DATETIME,
    gia_ve VARCHAR(50),
    FOREIGN KEY (ma_rap) REFERENCES RapPhim(ma_rap) ON DELETE CASCADE,
    FOREIGN KEY (ma_phim) REFERENCES Phim(ma_phim) ON DELETE CASCADE
);

CREATE TABLE DatVe (
    tai_khoan VARCHAR(50),
    ma_lich_chieu VARCHAR(50),
    ma_ghe VARCHAR(50),
    PRIMARY KEY (tai_khoan, ma_lich_chieu, ma_ghe),
    FOREIGN KEY (tai_khoan) REFERENCES NguoiDung(tai_khoan) ON DELETE CASCADE,
    FOREIGN KEY (ma_lich_chieu) REFERENCES LichChieu(ma_lich_chieu) ON DELETE CASCADE,
    FOREIGN KEY (ma_ghe) REFERENCES Ghe(ma_ghe) ON DELETE CASCADE
);
-- Insert data into HeThongRap
INSERT INTO HeThongRap (ma_he_thong_rap, ten_he_thong_rap, logo) VALUES
('HT01', 'Galaxy Cinema', 'galaxy_logo.png'),
('HT02', 'Lotte Cinema', 'lotte_logo.png'),
('HT03', 'CGV Cinema', 'cgv_logo.png'),
('HT04', 'BHD Cinema', 'bhd_logo.png'),
('HT05', 'Cinestar', 'cinestar_logo.png'),
('HT06', 'Platinum Cinema', 'platinum_logo.png'),
('HT07', 'MovieBox', 'moviebox_logo.png'),
('HT08', 'MegaStar', 'megastar_logo.png'),
('HT09', 'Cinema World', 'cinema_world_logo.png'),
('HT10', 'Starplex', 'starplex_logo.png');

-- Insert data into CumRap
INSERT INTO CumRap (ma_cum_rap, ten_cum_rap, dia_chi, ma_he_thong_rap) VALUES
('CR01', 'Galaxy Park', '123 Galaxy Street, HCM', 'HT01'),
('CR02', 'Lotte Cinema Central', '456 Lotte Avenue, HN', 'HT02'),
('CR03', 'CGV Vincom', '789 Vincom Plaza, HCM', 'HT03'),
('CR04', 'BHD Cinema District', '101 BHD Road, HN', 'HT04'),
('CR05', 'Cinestar Platinum', '202 Cinestar Plaza, HCM', 'HT05'),
('CR06', 'Platinum Cinemas', '303 Platinum Building, HN', 'HT06'),
('CR07', 'MovieBox Mega', '404 Mega Street, HCM', 'HT07'),
('CR08', 'MegaStar Greenland', '505 Greenland Park, HCM', 'HT08'),
('CR09', 'Cinema World Central', '606 Cinema Street, HCM', 'HT09'),
('CR10', 'Starplex Premium', '707 Starplex Road, HN', 'HT10');

-- Insert data into RapPhim
INSERT INTO RapPhim (ma_rap, ten_rap, ma_cum_rap) VALUES
('R01', 'Galaxy Cinema 1', 'CR01'),
('R02', 'Galaxy Cinema 2', 'CR01'),
('R03', 'Lotte Cinema 1', 'CR02'),
('R04', 'CGV Cinema 1', 'CR03'),
('R05', 'BHD Cinema 1', 'CR04'),
('R06', 'Cinestar 1', 'CR05'),
('R07', 'Platinum Cinema 1', 'CR06'),
('R08', 'MovieBox 1', 'CR07'),
('R09', 'MegaStar Cinema 1', 'CR08'),
('R10', 'Starplex Cinema 1', 'CR09');

-- Insert data into Phim
INSERT INTO Phim (ma_phim, ten_phim, trailer, hinh_anh, mo_ta, ngay_khoi_chieu, danh_gia, hot, dang_chieu, sap_chieu) VALUES
('P01', 'Avengers: Endgame', 'trailer01.mp4', 'avengers.jpg', 'A superhero epic featuring a final showdown.', '2024-04-01', 5, TRUE, TRUE, FALSE),
('P02', 'Spider-Man: No Way Home', 'trailer02.mp4', 'spiderman.jpg', 'Peter Parker struggles with multiverse issues.', '2023-12-15', 4, TRUE, TRUE, FALSE),
('P03', 'The Batman', 'trailer03.mp4', 'batman.jpg', 'Batman faces new challenges in Gotham.', '2024-05-12', 5, TRUE, TRUE, FALSE),
('P04', 'Fast & Furious 9', 'trailer04.mp4', 'fast_furious.jpg', 'High-speed action and family drama.', '2024-06-23', 4, FALSE, TRUE, FALSE),
('P05', 'Toy Story 5', 'trailer05.mp4', 'toy_story.jpg', 'The adventures of Woody and Buzz continue.', '2025-01-20', 5, TRUE, FALSE, TRUE),
('P06', 'Jurassic World: Dominion', 'trailer06.mp4', 'jurassic_world.jpg', 'Dinosaurs roam the earth once again.', '2024-07-08', 4, TRUE, FALSE, TRUE),
('P07', 'The Flash', 'trailer07.mp4', 'flash.jpg', 'A hero from another world joins the battle.', '2024-08-10', 5, TRUE, TRUE, FALSE),
('P08', 'Frozen 3', 'trailer08.mp4', 'frozen.jpg', 'Elsa faces new challenges in the frozen world.', '2024-11-20', 5, TRUE, TRUE, FALSE),
('P09', 'Black Panther: Wakanda Forever', 'trailer09.mp4', 'black_panther.jpg', 'A new king must defend Wakanda.', '2024-09-30', 5, FALSE, TRUE, FALSE),
('P10', 'Avatar 3', 'trailer10.mp4', 'avatar.jpg', 'The Avatar family explores new territories.', '2025-03-15', 5, TRUE, FALSE, TRUE);

-- Insert data into Banner
INSERT INTO Banner (ma_banner, ma_phim, hinh_anh) VALUES
('B01', 'P01', 'avengers_banner.jpg'),
('B02', 'P02', 'spiderman_banner.jpg'),
('B03', 'P03', 'batman_banner.jpg'),
('B04', 'P04', 'fast_furious_banner.jpg'),
('B05', 'P05', 'toy_story_banner.jpg'),
('B06', 'P06', 'jurassic_world_banner.jpg'),
('B07', 'P07', 'flash_banner.jpg'),
('B08', 'P08', 'frozen_banner.jpg'),
('B09', 'P09', 'black_panther_banner.jpg'),
('B10', 'P10', 'avatar_banner.jpg');

-- Insert data into NguoiDung
INSERT INTO NguoiDung (tai_khoan, ho_ten, email, so_dt, mat_khau, loai_nguoi_dung) VALUES
('ND01', 'Nguyen Minh', 'minh.nguyen@example.com', '0901234567', 'password123', 'customer'),
('ND02', 'Tran Thi Mai', 'mai.tran@example.com', '0902345678', 'password456', 'admin'),
('ND03', 'Le Quang Hieu', 'hieu.le@example.com', '0903456789', 'password789', 'customer'),
('ND04', 'Pham Bao', 'bao.pham@example.com', '0904567890', 'password101', 'admin'),
('ND05', 'Hoang Thanh', 'thanh.hoang@example.com', '0905678901', 'password102', 'customer'),
('ND06', 'Bui Mai Lan', 'lan.bui@example.com', '0906789012', 'password103', 'admin'),
('ND07', 'Duong Thanh Son', 'son.duong@example.com', '0907890123', 'password104', 'customer'),
('ND08', 'Vu Minh Tu', 'tu.vu@example.com', '0908901234', 'password105', 'admin'),
('ND09', 'Nguyen Thi Thu', 'thu.nguyen@example.com', '0909012345', 'password106', 'customer'),
('ND10', 'Phan Thanh Ho', 'ho.phan@example.com', '0900123456', 'password107', 'admin');

-- Insert data into Ghe
INSERT INTO Ghe (ma_ghe, ten_ghe, loai_ghe, ma_rap) VALUES
('G01', 'A1', 'VIP', 'R01'),
('G02', 'A2', 'Regular', 'R01'),
('G03', 'B1', 'VIP', 'R02'),
('G04', 'B2', 'Regular', 'R02'),
('G05', 'C1', 'VIP', 'R03'),
('G06', 'C2', 'Regular', 'R03'),
('G07', 'D1', 'VIP', 'R04'),
('G08', 'D2', 'Regular', 'R04'),
('G09', 'E1', 'VIP', 'R05'),
('G10', 'E2', 'Regular', 'R05');

-- Insert data into LichChieu
INSERT INTO LichChieu (ma_lich_chieu, ma_rap, ma_phim, ngay_gio_chieu, gia_ve) VALUES
('LC01', 'R01', 'P01', '2024-04-01 19:00:00', '150000'),
('LC02', 'R02', 'P02', '2024-04-02 20:00:00', '200000'),
('LC03', 'R03', 'P03', '2024-04-03 21:00:00', '180000'),
('LC04', 'R04', 'P04', '2024-04-04 22:00:00', '160000'),
('LC05', 'R05', 'P05', '2024-04-05 19:30:00', '170000'),
('LC06', 'R06', 'P06', '2024-04-06 20:00:00', '190000'),
('LC07', 'R07', 'P07', '2024-04-07 21:00:00', '220000'),
('LC08', 'R08', 'P08', '2024-04-08 22:00:00', '250000'),
('LC09', 'R09', 'P09', '2024-04-09 19:30:00', '230000'),
('LC10', 'R10', 'P10', '2024-04-10 20:00:00', '240000');

-- Insert data into DatVe
INSERT INTO DatVe (tai_khoan, ma_lich_chieu, ma_ghe) VALUES
('ND01', 'LC01', 'G01'),
('ND02', 'LC02', 'G03'),
('ND03', 'LC03', 'G04'),
('ND04', 'LC04', 'G05'),
('ND05', 'LC05', 'G06'),
('ND06', 'LC06', 'G07'),
('ND07', 'LC07', 'G08'),
('ND08', 'LC08', 'G09'),
('ND09', 'LC09', 'G10'),
('ND10', 'LC10', 'G01');

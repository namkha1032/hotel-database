USE HOTEL;

-- 1. add Branch
INSERT INTO `branch` (`Province`, `Address`, `Phone`, `Email`) VALUES
('Phan Thiet', '504/58C Kinh Duong Vuong, Phu Nhuan ward, district 10', '0010000001', 'phanthiet@gmail.com'),
('Nha Trang', '268 Ly Thuong Kiet, ward 14, district 10', '0010000004', 'nhatrang@gmail.com');


-- 2. add Branch image
INSERT INTO `branch_image` (`BranchID`, `Image`) VALUES
('CN1', 'https://elitetour.com.vn/files/images/Blogs/victoria-phan-thiet.jpg'),
('CN2', 'https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/03/Long-Cung-la-mot-resort-nam-gan-canh-bien.jpeg');

-- 3. add room type
INSERT INTO `roomtype` (`RoomName`, `Area`, `GuestNum`, `SingleBedNum`, `DoubleBedNum`, `Description`) VALUES
('Single Normal'    , '10', '1','1','0', 'normal room for 1 guest'),
('Single Vip'       , '15', '1','1','0', 'vip room for 1 guest'),
('Double Normal'    , '20', '2','1','0', 'normal room for 2 guests'),
('Double Vip'       , '25', '2','1','0', 'vip room for 2 guests'),
('Triple Normal'    , '30', '3','1','1', 'normal room for 3 guests'),
('Triple Vip'       , '35', '3','1','1', 'vip room for 3 guests'),
('Quadruple Normal' , '40', '4','0','2', 'normal room for 4 guests'),
('Quadruple Vip'    , '45', '4','0','2', 'vip room for 4 guests');


-- 4. add roomtype_image
INSERT INTO `roomtype_image` (`RoomTypeID`, `Image`) VALUES
('1', 'roomtype_image1.png'),
('2', 'roomtype_image2.png'),
('3', 'roomtype_image3.png'),
('4', 'roomtype_image4.png'),
('5', 'roomtype_image5.png'),
('6', 'roomtype_image6.png'),
('7', 'roomtype_image7.png'),
('8', 'roomtype_image8.png');

-- 6. add room type - branch
INSERT INTO `roomtype_branch` (`RoomTypeID`, `BranchID`, `RentalPrice`) VALUES
('1', 'CN1', '110'),
('2', 'CN1', '120'),
('3', 'CN1', '130'),
('4', 'CN1', '140'),
('5', 'CN1', '150'),
('6', 'CN1', '160'),
('7', 'CN1', '170'),
('8', 'CN1', '180'),
('1', 'CN2', '100'),
('2', 'CN2', '110'),
('3', 'CN2', '120'),
('4', 'CN2', '130'),
('5', 'CN2', '140'),
('6', 'CN2', '150'),
('7', 'CN2', '160'),
('8', 'CN2', '170');

-- 7. add room
INSERT INTO `room` (`BranchID`, `RoomNumber`, `RoomTypeID`) VALUES
('CN1', '100', '1'),
('CN1', '101', '1'),
('CN1', '102', '1'),
('CN1', '103', '1'),
('CN1', '104', '1'),
('CN1', '105', '1'),
('CN1', '106', '1'),
('CN1', '107', '1'),
('CN1', '108', '1'),
('CN1', '109', '1'),
('CN1', '200', '2'),
('CN1', '201', '2'),
('CN1', '202', '2'),
('CN1', '203', '2'),
('CN1', '204', '2'),
('CN1', '205', '2'),
('CN1', '206', '2'),
('CN1', '207', '2'),
('CN1', '208', '2'),
('CN1', '209', '2'),
('CN1', '300', '3'),
('CN1', '301', '3'),
('CN1', '302', '3'),
('CN1', '303', '3'),
('CN1', '304', '3'),
('CN1', '305', '3'),
('CN1', '306', '3'),
('CN1', '307', '3'),
('CN1', '308', '3'),
('CN1', '309', '3'),
('CN1', '400', '4'),
('CN1', '401', '4'),
('CN1', '402', '4'),
('CN1', '403', '4'),
('CN1', '404', '4'),
('CN1', '405', '4'),
('CN1', '406', '4'),
('CN1', '407', '4'),
('CN1', '408', '4'),
('CN1', '409', '4'),
('CN1', '500', '5'),
('CN1', '501', '5'),
('CN1', '502', '5'),
('CN1', '503', '5'),
('CN1', '504', '5'),
('CN1', '505', '5'),
('CN1', '506', '5'),
('CN1', '507', '5'),
('CN1', '508', '5'),
('CN1', '509', '5'),
('CN1', '600', '6'),
('CN1', '601', '6'),
('CN1', '602', '6'),
('CN1', '603', '6'),
('CN1', '604', '6'),
('CN1', '605', '6'),
('CN1', '606', '6'),
('CN1', '607', '6'),
('CN1', '608', '6'),
('CN1', '609', '6'),
('CN1', '700', '7'),
('CN1', '701', '7'),
('CN1', '702', '7'),
('CN1', '703', '7'),
('CN1', '704', '7'),
('CN1', '705', '7'),
('CN1', '706', '7'),
('CN1', '707', '7'),
('CN1', '708', '7'),
('CN1', '709', '7'),
('CN1', '800', '8'),
('CN1', '801', '8'),
('CN1', '802', '8'),
('CN1', '803', '8'),
('CN1', '804', '8'),
('CN1', '805', '8'),
('CN1', '806', '8'),
('CN1', '807', '8'),
('CN1', '808', '8'),
('CN1', '809', '8'),
('CN2', '100', '1'),
('CN2', '101', '1'),
('CN2', '102', '1'),
('CN2', '103', '1'),
('CN2', '104', '1'),
('CN2', '105', '1'),
('CN2', '106', '1'),
('CN2', '107', '1'),
('CN2', '108', '1'),
('CN2', '109', '1'),
('CN2', '200', '2'),
('CN2', '201', '2'),
('CN2', '202', '2'),
('CN2', '203', '2'),
('CN2', '204', '2'),
('CN2', '205', '2'),
('CN2', '206', '2'),
('CN2', '207', '2'),
('CN2', '208', '2'),
('CN2', '209', '2'),
('CN2', '300', '3'),
('CN2', '301', '3'),
('CN2', '302', '3'),
('CN2', '303', '3'),
('CN2', '304', '3'),
('CN2', '305', '3'),
('CN2', '306', '3'),
('CN2', '307', '3'),
('CN2', '308', '3'),
('CN2', '309', '3'),
('CN2', '400', '4'),
('CN2', '401', '4'),
('CN2', '402', '4'),
('CN2', '403', '4'),
('CN2', '404', '4'),
('CN2', '405', '4'),
('CN2', '406', '4'),
('CN2', '407', '4'),
('CN2', '408', '4'),
('CN2', '409', '4'),
('CN2', '500', '5'),
('CN2', '501', '5'),
('CN2', '502', '5'),
('CN2', '503', '5'),
('CN2', '504', '5'),
('CN2', '505', '5'),
('CN2', '506', '5'),
('CN2', '507', '5'),
('CN2', '508', '5'),
('CN2', '509', '5'),
('CN2', '600', '6'),
('CN2', '601', '6'),
('CN2', '602', '6'),
('CN2', '603', '6'),
('CN2', '604', '6'),
('CN2', '605', '6'),
('CN2', '606', '6'),
('CN2', '607', '6'),
('CN2', '608', '6'),
('CN2', '609', '6'),
('CN2', '700', '7'),
('CN2', '701', '7'),
('CN2', '702', '7'),
('CN2', '703', '7'),
('CN2', '704', '7'),
('CN2', '705', '7'),
('CN2', '706', '7'),
('CN2', '707', '7'),
('CN2', '708', '7'),
('CN2', '709', '7'),
('CN2', '800', '8'),
('CN2', '801', '8'),
('CN2', '802', '8'),
('CN2', '803', '8'),
('CN2', '804', '8'),
('CN2', '805', '8'),
('CN2', '806', '8'),
('CN2', '807', '8'),
('CN2', '808', '8'),
('CN2', '809', '8');


-- 8. Insert supply type
INSERT INTO `supplytype` (`SupplyTypeID`, `SupplyTypeName`) VALUES
('VT0001', 'Chair'),
('VT0002', 'Desk'),
('VT0003', 'Lamp'),
('VT0004', 'Television'),
('VT0005', 'Mirror'),
('VT0006', 'Cabinet'),
('VT0007', 'Wardrobe'),
('VT0008', 'Clock');




-- 9. Insert roomtype_supplytype
INSERT INTO `roomtype_supplytype` (`SupplyTypeID`, `RoomTypeID`, `Quantity`) VALUES
('VT0001', '1', '1'),
('VT0002', '1', '1'),
('VT0003', '1', '1'),
('VT0004', '1', '1'),
('VT0005', '1', '1'),
('VT0006', '1', '1'),
('VT0007', '1', '1'),
('VT0008', '1', '1'),
('VT0001', '2', '1'),
('VT0002', '2', '1'),
('VT0003', '2', '1'),
('VT0004', '2', '1'),
('VT0005', '2', '1'),
('VT0006', '2', '1'),
('VT0007', '2', '1'),
('VT0008', '2', '1'),
('VT0001', '3', '1'),
('VT0002', '3', '1'),
('VT0003', '3', '1'),
('VT0004', '3', '1'),
('VT0005', '3', '1'),
('VT0006', '3', '1'),
('VT0007', '3', '1'),
('VT0008', '3', '1'),
('VT0001', '4', '1'),
('VT0002', '4', '1'),
('VT0003', '4', '1'),
('VT0004', '4', '1'),
('VT0005', '4', '1'),
('VT0006', '4', '1'),
('VT0007', '4', '1'),
('VT0008', '4', '1'),
('VT0001', '5', '1'),
('VT0002', '5', '1'),
('VT0003', '5', '1'),
('VT0004', '5', '1'),
('VT0005', '5', '1'),
('VT0006', '5', '1'),
('VT0007', '5', '1'),
('VT0008', '5', '1'),
('VT0001', '6', '1'),
('VT0002', '6', '1'),
('VT0003', '6', '1'),
('VT0004', '6', '1'),
('VT0005', '6', '1'),
('VT0006', '6', '1'),
('VT0007', '6', '1'),
('VT0008', '6', '1'),
('VT0001', '7', '1'),
('VT0002', '7', '1'),
('VT0003', '7', '1'),
('VT0004', '7', '1'),
('VT0005', '7', '1'),
('VT0006', '7', '1'),
('VT0007', '7', '1'),
('VT0008', '7', '1'),
('VT0001', '8', '1'),
('VT0002', '8', '1'),
('VT0003', '8', '1'),
('VT0004', '8', '1'),
('VT0005', '8', '1'),
('VT0006', '8', '1'),
('VT0007', '8', '1'),
('VT0008', '8', '1');


-- 13. Add customer
INSERT INTO `customer` (`CustomerID`, `CitizenID`, `FullName`, `Phone`, `Email`, `Username`, `Password`, `DateOfBirth`) VALUES 
('KH000001', '079046706997', 'Luke Skywalker', '0903389043', 'lukeskywalker@gmail.com', 'lukeskywalker', 'password', '2000-01-01'),
('KH000002', '079524695121', 'Darth Vader', '0917992124', 'darthvader@gmail.com', 'darthvader', 'password', '2000-01-01'),
('KH000003', '079908782048', 'Leia Organa', '0924263016', 'leiaorgana@gmail.com', 'leiaorgana', 'password', '2000-01-01'),
('KH000004', '079547532623', 'Owen Lars', '0938605584', 'owenlars@gmail.com', 'owenlars', 'password', '2000-01-01'),
('KH000005', '079746815551', 'Beru Whitesun lars', '0999034571', 'beruwhitesunlars@gmail.com', 'beruwhitesunlars', 'password', '2000-01-01'),
('KH000006', '079458497468', 'Biggs Darklighter', '0999118912', 'biggsdarklighter@gmail.com', 'biggsdarklighter', 'password', '2000-01-01'),
('KH000007', '079850138125', 'Obi-Wan Kenobi', '0951299887', 'obi-wankenobi@gmail.com', 'obi-wankenobi', 'password', '2000-01-01'),
('KH000008', '079854409927', 'Anakin Skywalker', '0940637913', 'anakinskywalker@gmail.com', 'anakinskywalker', 'password', '2000-01-01'),
('KH000009', '079044648228', 'Wilhuff Tarkin', '0979920623', 'wilhufftarkin@gmail.com', 'wilhufftarkin', 'password', '2000-01-01'),
('KH000010', '079733289101', 'Chewbacca', '0938668133', 'chewbacca@gmail.com', 'chewbacca', 'password', '2000-01-01'),
('KH000011', '079806006275', 'Han Solo', '0974083494', 'hansolo@gmail.com', 'hansolo', 'password', '2000-01-01'),
('KH000012', '079050814749', 'Greedo', '0936988312', 'greedo@gmail.com', 'greedo', 'password', '2000-01-01'),
('KH000013', '079619986653', 'Jabba Desilijic Tiure', '0974405156', 'jabbadesilijictiure@gmail.com', 'jabbadesilijictiure', 'password', '2000-01-01'),
('KH000014', '079977010913', 'Wedge Antilles', '0989964113', 'wedgeantilles@gmail.com', 'wedgeantilles', 'password', '2000-01-01'),
('KH000015', '079701940190', 'Jek Tono Porkins', '0915221363', 'jektonoporkins@gmail.com', 'jektonoporkins', 'password', '2000-01-01'),
('KH000016', '079639692546', 'Yoda', '0975279637', 'yoda@gmail.com', 'yoda', 'password', '2000-01-01'),
('KH000017', '079524841929', 'Palpatine', '0953984933', 'palpatine@gmail.com', 'palpatine', 'password', '2000-01-01'),
('KH000018', '079988170067', 'Boba Fett', '0986921399', 'bobafett@gmail.com', 'bobafett', 'password', '2000-01-01'),
('KH000019', '079220939058', 'Bossk', '0979348417', 'bossk@gmail.com', 'bossk', 'password', '2000-01-01'),
('KH000020', '079300761252', 'Lando Calrissian', '0911956279', 'landocalrissian@gmail.com', 'landocalrissian', 'password', '2000-01-01'),
('KH000021', '079118927476', 'Lobot', '0937258247', 'lobot@gmail.com', 'lobot', 'password', '2000-01-01'),
('KH000022', '079718598056', 'Ackbar', '0940022872', 'ackbar@gmail.com', 'ackbar', 'password', '2000-01-01'),
('KH000023', '079320114926', 'Mon Mothma', '0960540782', 'monmothma@gmail.com', 'monmothma', 'password', '2000-01-01'),
('KH000024', '079395743702', 'Arvel Crynyd', '0901852226', 'arvelcrynyd@gmail.com', 'arvelcrynyd', 'password', '2000-01-01'),
('KH000025', '079739949635', 'Wicket Systri Warrick', '0990107054', 'wicketsystriwarrick@gmail.com', 'wicketsystriwarrick', 'password', '2000-01-01'),
('KH000026', '079008837647', 'Nien Nunb', '0971939123', 'niennunb@gmail.com', 'niennunb', 'password', '2000-01-01'),
('KH000027', '079518620505', 'Qui-Gon Jinn', '0945986434', 'qui-gonjinn@gmail.com', 'qui-gonjinn', 'password', '2000-01-01'),
('KH000028', '079191331758', 'Nute Gunray', '0946647374', 'nutegunray@gmail.com', 'nutegunray', 'password', '2000-01-01'),
('KH000029', '079746103045', 'Finis Valorum', '0942881469', 'finisvalorum@gmail.com', 'finisvalorum', 'password', '2000-01-01'),
('KH000030', '079956570221', 'Padme Amidala', '0977255314', 'padmeamidala@gmail.com', 'padmeamidala', 'password', '2000-01-01'),
('KH000031', '079457533024', 'Jar Jar Binks', '0961496489', 'jarjarbinks@gmail.com', 'jarjarbinks', 'password', '2000-01-01'),
('KH000032', '079262923404', 'Roos Tarpals', '0944721430', 'roostarpals@gmail.com', 'roostarpals', 'password', '2000-01-01'),
('KH000033', '079535529846', 'Rugor Nass', '0906693299', 'rugornass@gmail.com', 'rugornass', 'password', '2000-01-01'),
('KH000034', '079110636264', 'Ric Olie', '0991425508', 'ricolie@gmail.com', 'ricolie', 'password', '2000-01-01'),
('KH000035', '079351602041', 'Watto', '0981585217', 'watto@gmail.com', 'watto', 'password', '2000-01-01'),
('KH000036', '079877312790', 'Sebulba', '0933583421', 'sebulba@gmail.com', 'sebulba', 'password', '2000-01-01'),
('KH000037', '079266676545', 'Quarsh Panaka', '0980596432', 'quarshpanaka@gmail.com', 'quarshpanaka', 'password', '2000-01-01'),
('KH000038', '079445321987', 'Shmi Skywalker', '0960968961', 'shmiskywalker@gmail.com', 'shmiskywalker', 'password', '2000-01-01'),
('KH000039', '079007543151', 'Darth Maul', '0957348692', 'darthmaul@gmail.com', 'darthmaul', 'password', '2000-01-01'),
('KH000040', '079409727511', 'Bib Fortuna', '0952966230', 'bibfortuna@gmail.com', 'bibfortuna', 'password', '2000-01-01'),
('KH000041', '079096692505', 'Ayla Secura', '0999783227', 'aylasecura@gmail.com', 'aylasecura', 'password', '2000-01-01'),
('KH000042', '079907693114', 'Ratts Tyerel', '0946635404', 'rattstyerel@gmail.com', 'rattstyerel', 'password', '2000-01-01'),
('KH000043', '079347996613', 'Dud Bolt', '0979413497', 'dudbolt@gmail.com', 'dudbolt', 'password', '2000-01-01'),
('KH000044', '079093725559', 'Gasgano', '0998216437', 'gasgano@gmail.com', 'gasgano', 'password', '2000-01-01'),
('KH000045', '079264361296', 'Ben Quadinaros', '0989655180', 'benquadinaros@gmail.com', 'benquadinaros', 'password', '2000-01-01'),
('KH000046', '079246106712', 'Mace Windu', '0918078341', 'macewindu@gmail.com', 'macewindu', 'password', '2000-01-01'),
('KH000047', '079709732280', 'Ki-Adi-Mundi', '0960692708', 'ki-adi-mundi@gmail.com', 'ki-adi-mundi', 'password', '2000-01-01'),
('KH000048', '079640609203', 'Kit Fisto', '0998068162', 'kitfisto@gmail.com', 'kitfisto', 'password', '2000-01-01'),
('KH000049', '079918254391', 'Eeth Koth', '0921716683', 'eethkoth@gmail.com', 'eethkoth', 'password', '2000-01-01'),
('KH000050', '079053700723', 'Adi Gallia', '0955900504', 'adigallia@gmail.com', 'adigallia', 'password', '2000-01-01'),
('KH000051', '079467579563', 'Saesee Tiin', '0977000999', 'saeseetiin@gmail.com', 'saeseetiin', 'password', '2000-01-01'),
('KH000052', '079383674242', 'Yarael Poof', '0999958674', 'yaraelpoof@gmail.com', 'yaraelpoof', 'password', '2000-01-01'),
('KH000053', '079737801341', 'Plo Koon', '0905901776', 'plokoon@gmail.com', 'plokoon', 'password', '2000-01-01'),
('KH000054', '079927139540', 'Mas Amedda', '0960832200', 'masamedda@gmail.com', 'masamedda', 'password', '2000-01-01'),
('KH000055', '079589451310', 'Gregar Typho', '0920975270', 'gregartypho@gmail.com', 'gregartypho', 'password', '2000-01-01'),
('KH000056', '079402822192', 'Corde', '0940308131', 'corde@gmail.com', 'corde', 'password', '2000-01-01'),
('KH000057', '079657009871', 'Cliegg Lars', '0920459248', 'cliegglars@gmail.com', 'cliegglars', 'password', '2000-01-01'),
('KH000058', '079405842133', 'Poggle the Lesser', '0941022705', 'pogglethelesser@gmail.com', 'pogglethelesser', 'password', '2000-01-01'),
('KH000059', '079263085024', 'Luminara Unduli', '0951906030', 'luminaraunduli@gmail.com', 'luminaraunduli', 'password', '2000-01-01'),
('KH000060', '079409114349', 'Barriss Offee', '0972923102', 'barrissoffee@gmail.com', 'barrissoffee', 'password', '2000-01-01'),
('KH000061', '079947427487', 'Dorme', '0973480089', 'dorme@gmail.com', 'dorme', 'password', '2000-01-01'),
('KH000062', '079070476172', 'Dooku', '0974825649', 'dooku@gmail.com', 'dooku', 'password', '2000-01-01'),
('KH000063', '079353178370', 'Bail Prestor Organa', '0997517130', 'bailprestororgana@gmail.com', 'bailprestororgana', 'password', '2000-01-01'),
('KH000064', '079476403711', 'Jango Fett', '0979675417', 'jangofett@gmail.com', 'jangofett', 'password', '2000-01-01'),
('KH000065', '079660032039', 'Zam Wesell', '0918132017', 'zamwesell@gmail.com', 'zamwesell', 'password', '2000-01-01'),
('KH000066', '079622031324', 'Dexter Jettster', '0902653643', 'dexterjettster@gmail.com', 'dexterjettster', 'password', '2000-01-01'),
('KH000067', '079058275861', 'Lama Su', '0918393602', 'lamasu@gmail.com', 'lamasu', 'password', '2000-01-01'),
('KH000068', '079275572065', 'Taun We', '0902782086', 'taunwe@gmail.com', 'taunwe', 'password', '2000-01-01'),
('KH000069', '079259877519', 'Jocasta Nu', '0915357265', 'jocastanu@gmail.com', 'jocastanu', 'password', '2000-01-01'),
('KH000070', '079777015596', 'Wat Tambor', '0919156605', 'wattambor@gmail.com', 'wattambor', 'password', '2000-01-01'),
('KH000071', '079160216942', 'San Hill', '0950575576', 'sanhill@gmail.com', 'sanhill', 'password', '2000-01-01'),
('KH000072', '079650053264', 'Shaak Ti', '0939570401', 'shaakti@gmail.com', 'shaakti', 'password', '2000-01-01'),
('KH000073', '079554484454', 'Grievous', '0930401136', 'grievous@gmail.com', 'grievous', 'password', '2000-01-01'),
('KH000074', '079776947861', 'Tarfful', '0951332761', 'tarfful@gmail.com', 'tarfful', 'password', '2000-01-01'),
('KH000075', '079468901594', 'Raymus Antilles', '0954123772', 'raymusantilles@gmail.com', 'raymusantilles', 'password', '2000-01-01'),
('KH000076', '079511765908', 'Sly Moore', '0935597728', 'slymoore@gmail.com', 'slymoore', 'password', '2000-01-01'),
('KH000077', '079004177125', 'Tion Medon', '0978971987', 'tionmedon@gmail.com', 'tionmedon', 'password', '2000-01-01'),
('KH000078', '079756318786', 'Uzumaki Naruto', '0939729632', 'uzumakinaruto@gmail.com', 'uzumakinaruto', 'password', '2000-01-01'),
('KH000079', '079637644578', 'Uchiha Sasuke', '0988287659', 'uchihasasuke@gmail.com', 'uchihasasuke', 'password', '2000-01-01'),
('KH000080', '079976489134', 'Haruno Sakura', '0986118519', 'harunosakura@gmail.com', 'harunosakura', 'password', '2000-01-01');


-- -- USE HOTEL;

-- -- 16. Add booking
-- INSERT INTO `booking` (`BookingDate`, `GuestCount`, `CheckIn`, `CheckOut`, `CustomerID`) VALUES
-- ('2023-07-07','11','2023-06-01','2023-06-01','KH000001'),
-- ('2023-07-07','11','2023-06-05','2023-06-05','KH000001'),



-- -- 17. Add booking_room
-- INSERT INTO `booking_room` (`BookingID`, `BranchID`, `RoomNumber`) VALUES
-- ('1','CN1','602'),
-- ('1','CN1','603'),
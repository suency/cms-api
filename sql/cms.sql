/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 50726 (5.7.26)
 Source Host           : localhost:3306
 Source Schema         : cms

 Target Server Type    : MySQL
 Target Server Version : 50726 (5.7.26)
 File Encoding         : 65001

 Date: 18/11/2022 14:45:09
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `menu_list` json NULL,
  `router_list` json NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, 'admin', '[{\"key\": \"/\", \"icon\": \"PieChartOutlined\", \"label\": \"Dashboard\"}, {\"key\": \"/setting\", \"icon\": \"SettingOutlined\", \"label\": \"Settings\"}, {\"key\": \"/people\", \"icon\": \"UserOutlined\", \"label\": \"People\", \"children\": [{\"key\": \"/people/admins\", \"icon\": \"SolutionOutlined\", \"label\": \"Admins\"}, {\"key\": \"/people/roles\", \"icon\": \"TrademarkCircleOutlined\", \"label\": \"Roles\"}, {\"key\": \"/people/users\", \"icon\": \"CommentOutlined\", \"label\": \"Users\"}]}, {\"key\": \"/team\", \"icon\": \"TeamOutlined\", \"label\": \"Team\", \"children\": [{\"key\": \"/team/team1\", \"icon\": \"AndroidOutlined\", \"label\": \"Team1\"}, {\"key\": \"/team/team2\", \"icon\": \"AppleOutlined\", \"label\": \"Team2\"}]}, {\"key\": \"/tools\", \"icon\": \"ToolOutlined\", \"label\": \"Tools\"}]', '[{\"path\": \"/\", \"element\": \"Layout\", \"children\": [{\"path\": \"/\", \"element\": \"Home\"}, {\"path\": \"/setting\", \"element\": \"Setting\"}, {\"path\": \"/tools\", \"element\": \"Tools\"}, {\"path\": \"/team/team1\", \"element\": \"Team1\"}, {\"path\": \"/team/team2\", \"element\": \"Team2\"}, {\"path\": \"/people/admins\", \"element\": \"Admins\"}, {\"path\": \"/people/roles\", \"element\": \"Roles\"}, {\"path\": \"/people/users\", \"element\": \"Users\"}]}, {\"path\": \"/Login\", \"element\": \"Login\"}, {\"path\": \"*\", \"element\": \"NotFound\"}]', 'Guacamole.png');
INSERT INTO `roles` VALUES (2, 'vip', '[{\"key\": \"/\", \"icon\": \"PieChartOutlined\", \"label\": \"Dashboard\"}, {\"key\": \"/people\", \"icon\": \"UserOutlined\", \"label\": \"People\", \"children\": [{\"key\": \"/people/admins\", \"icon\": \"SolutionOutlined\", \"label\": \"Admins\"}, {\"key\": \"/people/users\", \"icon\": \"CommentOutlined\", \"label\": \"Users\"}]}, {\"key\": \"/team\", \"icon\": \"TeamOutlined\", \"label\": \"Team\", \"children\": [{\"key\": \"/team/team1\", \"icon\": \"AndroidOutlined\", \"label\": \"Team1\"}, {\"key\": \"/team/team2\", \"icon\": \"AppleOutlined\", \"label\": \"Team2\"}]}, {\"key\": \"/tools\", \"icon\": \"ToolOutlined\", \"label\": \"Tools\"}]', '[{\"path\": \"/\", \"element\": \"Layout\", \"children\": [{\"path\": \"/\", \"element\": \"Home\"}, {\"path\": \"/tools\", \"element\": \"Tools\"}, {\"path\": \"/team/team1\", \"element\": \"Team1\"}, {\"path\": \"/team/team2\", \"element\": \"Team2\"}, {\"path\": \"/people/admins\", \"element\": \"Admins\"}, {\"path\": \"/people/users\", \"element\": \"Users\"}]}, {\"path\": \"/Login\", \"element\": \"Login\"}, {\"path\": \"*\", \"element\": \"NotFound\"}]', 'Guacamole-2.png');
INSERT INTO `roles` VALUES (8, 'ioioio', '[{\"key\": \"/\", \"icon\": \"PieChartOutlined\", \"label\": \"Dashboard\"}]', '[{\"path\": \"/\", \"element\": \"Layout\", \"children\": [{\"path\": \"/\", \"element\": \"Home\"}]}, {\"path\": \"/Login\", \"element\": \"Login\"}, {\"path\": \"*\", \"element\": \"NotFound\"}]', 'Delivery boy-1.png');
INSERT INTO `roles` VALUES (3, 'guest', '[{\"key\": \"/\", \"icon\": \"PieChartOutlined\", \"label\": \"Dashboard\"}, {\"key\": \"/setting\", \"icon\": \"SettingOutlined\", \"label\": \"Settings\"}, {\"key\": \"/team\", \"icon\": \"TeamOutlined\", \"label\": \"Team\", \"children\": [{\"key\": \"/team/team1\", \"icon\": \"AndroidOutlined\", \"label\": \"Team1\"}, {\"key\": \"/team/team2\", \"icon\": \"AppleOutlined\", \"label\": \"Team2\"}]}]', '[{\"path\": \"/\", \"element\": \"Layout\", \"children\": [{\"path\": \"/\", \"element\": \"Home\"}, {\"path\": \"/setting\", \"element\": \"Setting\"}, {\"path\": \"/team\", \"element\": \"Team\"}, {\"path\": \"/team/team1\", \"element\": \"Team1\"}, {\"path\": \"/team/team2\", \"element\": \"Team2\"}]}, {\"path\": \"/Login\", \"element\": \"Login\"}, {\"path\": \"*\", \"element\": \"NotFound\"}]', 'E-commerce-2.png');
INSERT INTO `roles` VALUES (6, 'tiger', '[{\"key\": \"/\", \"icon\": \"PieChartOutlined\", \"label\": \"Dashboard\"}, {\"key\": \"/setting\", \"icon\": \"SettingOutlined\", \"label\": \"Settings\"}, {\"key\": \"/team\", \"icon\": \"TeamOutlined\", \"label\": \"Team\", \"children\": [{\"key\": \"/team/team1\", \"icon\": \"AndroidOutlined\", \"label\": \"Team1\"}, {\"key\": \"/team/team2\", \"icon\": \"AppleOutlined\", \"label\": \"Team2\"}]}]', '[{\"path\": \"/\", \"element\": \"Layout\", \"children\": [{\"path\": \"/\", \"element\": \"Home\"}, {\"path\": \"/setting\", \"element\": \"Setting\"}, {\"path\": \"/team\", \"element\": \"Team\"}, {\"path\": \"/team/team1\", \"element\": \"Team1\"}, {\"path\": \"/team/team2\", \"element\": \"Team2\"}]}, {\"path\": \"/Login\", \"element\": \"Login\"}, {\"path\": \"*\", \"element\": \"NotFound\"}]', 'Delivery boy-2.png');
INSERT INTO `roles` VALUES (4, 'root', '[{\"key\": \"/\", \"icon\": \"PieChartOutlined\", \"label\": \"Dashboard\"}, {\"key\": \"/setting\", \"icon\": \"SettingOutlined\", \"label\": \"Settings\"}, {\"key\": \"/people\", \"icon\": \"UserOutlined\", \"label\": \"People\", \"children\": [{\"key\": \"/people/admins\", \"icon\": \"SolutionOutlined\", \"label\": \"Admins\"}, {\"key\": \"/people/roles\", \"icon\": \"TrademarkCircleOutlined\", \"label\": \"Roles\"}, {\"key\": \"/people/users\", \"icon\": \"CommentOutlined\", \"label\": \"Users\"}]}, {\"key\": \"/team\", \"icon\": \"TeamOutlined\", \"label\": \"Team\", \"children\": [{\"key\": \"/team/team1\", \"icon\": \"AndroidOutlined\", \"label\": \"Team1\"}, {\"key\": \"/team/team2\", \"icon\": \"AppleOutlined\", \"label\": \"Team2\"}]}, {\"key\": \"/tools\", \"icon\": \"ToolOutlined\", \"label\": \"Tools\"}]', '[{\"path\": \"/\", \"element\": \"Layout\", \"children\": [{\"path\": \"/\", \"element\": \"Home\"}, {\"path\": \"/setting\", \"element\": \"Setting\"}, {\"path\": \"/tools\", \"element\": \"Tools\"}, {\"path\": \"/team/team1\", \"element\": \"Team1\"}, {\"path\": \"/team/team2\", \"element\": \"Team2\"}, {\"path\": \"/people/admins\", \"element\": \"Admins\"}, {\"path\": \"/people/roles\", \"element\": \"Roles\"}, {\"path\": \"/people/users\", \"element\": \"Users\"}]}, {\"path\": \"/Login\", \"element\": \"Login\"}, {\"path\": \"*\", \"element\": \"NotFound\"}]', 'Cranks.png');
INSERT INTO `roles` VALUES (11, 'studenst', '[{\"key\": \"/\", \"icon\": \"PieChartOutlined\", \"label\": \"Dashboard\"}]', '[{\"path\": \"/\", \"element\": \"Layout\", \"children\": [{\"path\": \"/\", \"element\": \"Home\"}]}, {\"path\": \"/Login\", \"element\": \"Login\"}, {\"path\": \"*\", \"element\": \"NotFound\"}]', 'Juicy.png');
INSERT INTO `roles` VALUES (10, 'tiny22', '[{\"key\": \"/\", \"icon\": \"PieChartOutlined\", \"label\": \"Dashboard\"}, {\"key\": \"/tools\", \"icon\": \"ToolOutlined\", \"label\": \"Tools\"}, {\"key\": \"/people\", \"icon\": \"UserOutlined\", \"label\": \"People\", \"children\": [{\"key\": \"/people/users\", \"icon\": \"CommentOutlined\", \"label\": \"Users\"}]}]', '[{\"path\": \"/\", \"element\": \"Layout\", \"children\": [{\"path\": \"/\", \"element\": \"Home\"}, {\"path\": \"/tools\", \"element\": \"Tools\"}, {\"path\": \"/people/users\", \"element\": \"Users\"}]}, {\"path\": \"/Login\", \"element\": \"Login\"}, {\"path\": \"*\", \"element\": \"NotFound\"}]', 'Afterclap-8.png');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role_id` int(11) NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'sk', '111', 'admin', 1, 'No Comments.png');
INSERT INTO `users` VALUES (2, 'fei', '222', 'vip', 2, 'Upstream-2.png');
INSERT INTO `users` VALUES (3, 'sf', '666', 'guest', 3, 'Upstream-5.png');

SET FOREIGN_KEY_CHECKS = 1;

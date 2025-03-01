-- Configurações gerais
SET GLOBAL innodb_buffer_pool_size = 1073741824;
SET GLOBAL innodb_flush_log_at_trx_commit = 1;
SET GLOBAL innodb_file_per_table = 1;

-- Configurações de charset
SET GLOBAL character_set_server = 'utf8mb4';
SET GLOBAL collation_server = 'utf8mb4_unicode_ci';

-- Configurações de log
SET GLOBAL slow_query_log = 1;
SET GLOBAL long_query_time = 2;

-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS seu_banco_de_dados;
USE seu_banco_de_dados;

-- Criar usuário com autenticação explícita
CREATE USER IF NOT EXISTS 'seu_usuario'@'%' IDENTIFIED BY 'sua_senha';
GRANT ALL PRIVILEGES ON `seu_banco_de_dados`.* TO 'seu_usuario'@'%';
FLUSH PRIVILEGES;

-- Criação da tabela 'users'
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criação da tabela 'schedules'
CREATE TABLE IF NOT EXISTS schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  client_id INT NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  service_details TEXT,
  scheduled_at DATETIME NOT NULL,
  status ENUM('pending', 'completed', 'canceled') NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  service VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL
);

-- Adicionar índices para otimização
CREATE INDEX idx_schedules_date ON schedules(scheduled_at);
CREATE INDEX idx_users_role ON users(role);

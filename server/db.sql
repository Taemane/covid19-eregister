--Tables
CREATE TABLE employees (
    employee_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    names VARCHAR(255) NOT NULL,
    cell_number VARCHAR(255) NOT NULL,
    dept_id uuid,
    vaccinated BOOLEAN NOT NULL,
    create_on TIMESTAMP DEFAULT Now(),
    CONSTRAINT fk_dept FOREIGN KEY(dept_id) REFERENCES department(dept_id) ON DELETE CASCADE
);
CREATE TABLE department (
    dept_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    dept_name VARCHAR(255) NOT NULL
);
CREATE TABLE daily_entry_table (
    entry_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    names VARCHAR(255) NOT NULL,
    cell_number VARCHAR(255) NOT NULL,
    create_on TIMESTAMP DEFAULT Now(),
    question_1 BOOLEAN NOT NULL,
    question_2 BOOLEAN NOT NULL,
    question_3 BOOLEAN NOT NULL,
    question_4 BOOLEAN NOT NULL,
    question_5 BOOLEAN NOT NULL,
    question_6 BOOLEAN NOT NULL,
    question_7 BOOLEAN NOT NULL,
    question_8 BOOLEAN NOT NULL,
    vaccinated BOOLEAN NOT NULL,
    temperature NUMERIC(3, 1) NOT NULL,
    employee_id uuid,
    CONSTRAINT fk_employee FOREIGN KEY(employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

INSERT INTO daily_entry_table(names, cell_number, question_1, question_2, question_3, question_4, question_5, question_6, question_7, question_8, vaccinated, temperature) VALUES('Sheldon', '0678809244',false ,false ,false ,false ,false ,false ,false ,false ,true, 34.5);

CREATE TABLE admin_users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    names VARCHAR(255) NOT NULL,
    cell_number VARCHAR(255) NOT NULL,
    create_on TIMESTAMP DEFAULT Now(),
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_role VARCHAR(255) NOT NULL,
    vaccinated BOOLEAN NOT NULL
);

INSERT INTO admin_users(names, cell_number, user_email, user_password, user_role, vaccinated) VALUES('Junior', '0611277142', 'junior@gmail.com', 'password', 'standard_user', true);
INSERT INTO admin_users(names, cell_number, user_email, user_password, user_role, vaccinated) VALUES('LoFty', '0785182281', 'lofty@gmail.com', 'password', 'super_user', false);
INSERT INTO admin_users(names, cell_number, user_email, user_password, user_role, vaccinated) VALUES('Joyce', '0611277142', 'joyce@gmail.com', 'password', 'ultimate_user', true);
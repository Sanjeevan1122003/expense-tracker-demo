# Expense Tracker

A full-stack expense management application with authentication, expense tracking, and PDF export.

## Features
- User authentication (Register/Login)
- Add, delete, and list expenses
- Export expenses to PDF
- MySQL database with Express.js API
- React.js frontend

## Tech Stack
- **Frontend:** React.js, Material UI
- **Backend:** Express.js, MySQL 8, Sequelize ORM
- **Authentication:** JWT, bcrypt
- **PDF Export:** pdfkit

## Installation

### 1. Clone the Repository
```sh
git clone https://github.com/Sanjeevan1122003/expense-tracker-demo.git
cd expense-tracker-demo
```

### 2. Set Up the Backend
Navigate to the backend directory:
```sh
cd server
```

Install the required dependencies:
```sh
npm install
```

Create a `.env` file in the `backend` directory and add the following environment variables:
```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend server:
```sh
npm start
```

### 3. Set Up the Frontend
Navigate to the frontend directory:
```sh
cd ../client
```

Install the required dependencies:
```sh
npm install
```

Start the frontend development server:
```sh
npm start
```

### 4. Set Up the Database
Ensure you have MySQL installed and running.

Create a new database using the name you specified in the `.env` file.

Run the following SQL commands to create the necessary tables:
```sql
CREATE TABLE users_autho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE expense_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    user_expense_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (email) REFERENCES users_autho(email)
);
```

## Usage
- **Register a new user:** Navigate to the registration page and fill in the required details.
- **Login:** Use your registered email and password to log in.
- **Add Expenses:** Once logged in, add new expenses by filling out the form in the "Add Expense" section.
- **Delete Expenses:** Delete expenses by selecting the respective expense entries.
- **View Expenses:** All your expenses will be listed in the "Your Data" section.
- **Export to PDF:** Download a PDF report of your expenses by clicking the "Download PDF" button.

## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature/YourFeatureName
   ```
3. Commit your changes:
   ```sh
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```sh
   git push origin feature/YourFeatureName
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- React.js
- Express.js
- MySQL
- JWT
- bcrypt
- pdfkit

## Contact
For any questions or feedback, please reach out to **Sanjeevan**.


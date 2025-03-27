const pool = require('./schema');

async function seedDatabase() {
    try {
        await pool.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)",
            [
                "User1", "user1@example.com", "password123",
                "User2", "user2@example.com", "password123",
                "User3", "user3@example.com", "password123"
            ]
        );

        await pool.execute(
            "INSERT INTO data_items (name, description, time, created_by) VALUES (?, ?, ?, ?), (?, ?, ?, ?)",
            [
                "Task 1", "Description 1", 30, 1,
                "Task 2", "Description 2", 45, 2
            ]
        );

        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

seedDatabase();

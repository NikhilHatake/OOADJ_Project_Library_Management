package com.librarymanagement.service;

import com.librarymanagement.model.User;
import com.librarymanagement.model.UserRole;
import com.librarymanagement.util.DatabaseUtil;
import org.mindrot.jbcrypt.BCrypt;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserService {

    public User authenticateUser(String username, String password) {
        User user = findByUsername(username);

        if (user != null && verifyPassword(password, user.getPasswordHash())) {
            return user;
        } else {
            return null;
        }
    }

    private User findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ?";

        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    User user = new User();
                    user.setName(rs.getString("username"));
                    user.setEmail(rs.getString("email"));
                    user.setRole(UserRole.valueOf(rs.getString("role")));
                    user.setPasswordHash(rs.getString("password_hash"));
                    return user;
                } else {
                    return null; // User not found
                }
            }
        } catch (SQLException e) {
            // Handle SQL exceptions (e.g., log the error)
            e.printStackTrace();
            return null;
        }
    }

    private boolean verifyPassword(String plainTextPassword, String hashedPassword) {
        return BCrypt.checkpw(plainTextPassword, hashedPassword);
    }

    public String hashPassword(String plainTextPassword) {
        return BCrypt.hashpw(plainTextPassword, BCrypt.gensalt());
    }

    // Example: User Registration Logic (You might place this in a separate service)
    public void registerUser(User newUser, String plainTextPassword) {
        // Hash the password
        String passwordHash = hashPassword(plainTextPassword);
        newUser.setPasswordHash(passwordHash);

        // ... Code to save the newUser object to your database
    }


}
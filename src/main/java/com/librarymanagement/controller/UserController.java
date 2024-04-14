package com.librarymanagement.controller;

import com.librarymanagement.model.User;
import com.librarymanagement.service.UserService;

import spark.Request;
import spark.Response;
import spark.Route;

public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    public Route authenticateUser() {
        return (Request request, Response response) -> {
            try {
                // Extract username and password (Ideally, deserialize from JSON)
                String username = request.body().split("&")[0].split("=")[1];
                String password = request.body().split("&")[1].split("=")[1];

                User authenticatedUser = userService.authenticateUser(username, password);

                if (authenticatedUser != null) {
                    // Successful authentication
                    String token = generateToken(authenticatedUser);
                    response.status(200);
                    return token;
                } else {
                    // Authentication failed
                    response.status(401); // Unauthorized
                    return "Invalid credentials";
                }
            } catch (Exception e) {
                response.status(500); // Internal Server Error
                return "Error processing login";
            }
        };
    }

    private String generateToken(User user) {
        // Replace this with your robust token generation logic
        // Consider using JWTs for a more secure implementation
        return "GeneratedTokenForUser_" + user.getName();
    }
}
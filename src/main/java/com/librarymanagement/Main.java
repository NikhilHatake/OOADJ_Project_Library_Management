package com.librarymanagement;

import static spark.Spark.*;

import com.librarymanagement.service.BookService;
import com.google.gson.Gson;
import com.librarymanagement.controller.BookController;
import com.librarymanagement.controller.UserController;
import com.librarymanagement.service.UserService;

public class Main {
    public static void main(String[] args) {
        staticFiles.location("/webapp");
        port(8080);

        // Initialize services
        UserService userService = new UserService();

        // Initialize controllers and inject dependencies
        UserController userController = new UserController(userService);

        // Define routes
        post("/authenticate", userController.authenticateUser());

        BookService bookService = new BookService();
        Gson gson = new Gson();
        BookController bookController = new BookController(bookService, gson);
        bookController.registerRoutes();


        // Log server startup
        System.out.println("Server running on port 8080...");

        // Start Spark server
        init();
    }
}
package com.librarymanagement.controller;

import com.google.gson.Gson;
import com.librarymanagement.model.Book;
import com.librarymanagement.service.BookService;

import java.util.List;

import static spark.Spark.*;

public class BookController {

    private final BookService bookService;
    private final Gson gson;

    public BookController(BookService bookService, Gson gson) {
        this.bookService = bookService;
        this.gson = gson;
    }

    public void registerRoutes() {
        // Get all books or search for books
        get("/books", (request, response) -> {
            String searchBy = request.queryParams("title");
            if (searchBy == null) {
                searchBy = request.queryParams("author");
            }
            if (searchBy == null) {
                searchBy = request.queryParams("isbn");
            }
            String searchTerm = request.queryParams(searchBy);

            System.out.println("Search By: " + searchBy);
            System.out.println("Search Term: " + searchTerm);

            List<Book> books = bookService.searchBooks(searchBy, searchTerm);
            System.out.println("Books found: " + books);
            if (searchTerm != null) {
                books = bookService.searchBooks(searchBy, searchTerm);
            } else {
                books = bookService.getAllBooks();
            }

            response.type("application/json");
            return gson.toJson(books);
        });

        post("/books", (request, response) -> {
            Book newBook = gson.fromJson(request.body(), Book.class);
            Book savedBook = bookService.addBook(newBook);

            if (savedBook != null) {
                response.status(201); // Created
                return gson.toJson(savedBook);
            } else {
                response.status(500); // Internal Server Error
                return "Error saving book";
            }
        });
    }
}
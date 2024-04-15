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

            List<Book> books;
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

        delete("/books/:id", (request, response) -> {
            long bookId = Long.parseLong(request.params("id"));
            boolean deleted = bookService.deleteBook(bookId);

            if (deleted) {
                response.status(204); // No Content
                return ""; // Empty response is sufficient
            } else {
                response.status(500); // Internal Server Error (or 404 if appropriate)
                return "Error deleting book";
            }
        });
    }
}
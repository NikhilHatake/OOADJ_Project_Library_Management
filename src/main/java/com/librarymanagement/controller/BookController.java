    package com.librarymanagement.controller;

    import com.google.gson.Gson;
    import com.librarymanagement.model.Book;
    import com.librarymanagement.service.BookService;
    import com.librarymanagement.util.DatabaseUtil;

    import java.sql.Connection;
    import java.sql.SQLException;
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

            get("/books/borrowed", (request, response) -> {
                try (Connection conn = DatabaseUtil.getConnection()) {
                    List<Book> borrowedBooks = BookService.fetchAllBorrowedBooks(conn);
                    return gson.toJson(borrowedBooks);
                } catch (SQLException e) {
                    response.status(500);
                    return "{\"error\": \"Error fetching borrowed books\"}";
                }
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

            put("/books/:bookId", (request, response) -> {
                long bookId = Long.parseLong(request.params("bookId"));
                System.out.println("PUT request received for /books/" + bookId);
                Book updatedBook = gson.fromJson(request.body(), Book.class);

                boolean updated = bookService.updateBook(bookId, updatedBook);

                if (updated) {
                    response.status(200); // Success
                    return "Book updated successfully"; // You might return the updated book as JSON
                } else {
                    response.status(404); // Not Found (or 500 for internal server error)
                    return "Error updating book";
                }
            });

            delete("/books/:bookId", (request, response) -> {
                int bookId = Integer.parseInt(request.params("bookId"));

                try (Connection conn = DatabaseUtil.getConnection()) {
                    boolean deleted = bookService.deleteBook(conn, bookId);
                    if (deleted) {
                        response.status(200); // Success
                        return "Book deleted successfully";
                    } else {
                        response.status(404); // Not Found
                        return "Book not found";
                    }
                } catch (SQLException e) {
                    response.status(500);
                    return "Error deleting book: " + e.getMessage();
                }
            });
            post("/books/:bookId/borrow", (request, response) -> {
                int bookId = Integer.parseInt(request.params("bookId"));

                try (Connection conn = DatabaseUtil.getConnection()) {
                    boolean isBorrowed; // Initialize here

                    // Fetch the book before attempting to update
                    BookService bookService = new BookService();
                    Book book = bookService.fetchBookById(conn, bookId);
                    if (book == null) {
                        response.status(400);
                        return "{\"error\": \"Book not found\"}";
                    }
                    isBorrowed = book.getIs_borrowed();

                    // Attempt the Borrow Operation
                    boolean success = BookService.borrowBook(conn, bookId);

                    // Determine the appropriate response
                    response.type("application/json");
                    if (success) {
                        response.status(200);
                        return gson.toJson(book); // Return current state
                    } else {
                        response.status(400);
                        if (isBorrowed) {
                            return "{\"error\": \"Book is already borrowed\"}";
                        } else {
                            return "{\"error\": \"Book is unavailable for other reasons\"}";
                        }
                    }
                } catch (SQLException e) {
                    response.status(500);
                    return "{\"error\": \"Error processing request\"}";
                }
            });
            post("/books/:bookId/return", (request, response) -> {
                int bookId = Integer.parseInt(request.params("bookId"));

                try (Connection conn = DatabaseUtil.getConnection()) {
                    boolean success = BookService.returnBook(conn, bookId);
                    if (success) {
                            return "Book returned successfully";
                    } else {
                        response.status(400); // Or another relevant error code
                        return "Error: Book may not be currently borrowed";
                    }
                } catch (SQLException e) {
                    response.status(500);
                    return "Error processing request";
                }
            });
        }
    }
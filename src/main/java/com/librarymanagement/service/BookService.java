package com.librarymanagement.service;

import com.librarymanagement.model.Book;
import com.librarymanagement.util.DatabaseUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BookService {

    public List<Book> getAllBooks() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT id, title, author, isbn ,is_borrowed FROM books";

        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getLong("id"));
                book.setTitle(rs.getString("title") != null ? rs.getString("title") : ""); // Handle potential null
                book.setAuthor(rs.getString("author") != null ? rs.getString("author") : "");
                book.setIsbn(rs.getString("isbn") != null ? rs.getString("isbn") : "");
                books.add(book);
            }
        } catch (SQLException e) {
            logger.error("Error occurred:", e); // Log the error
            throw new RuntimeException("Error executing database operation", e);
        }
        return books;
    }

    public List<Book> searchBooks(String searchBy, String searchTerm) {
        List<Book> allBooks = getAllBooks(); // Get all books first
        List<Book> filteredBooks = new ArrayList<>();

        for (Book book : allBooks) {
            switch (searchBy) {
                case "title":
                    if (book.getTitle().toLowerCase().contains(searchTerm.toLowerCase())) {
                        filteredBooks.add(book);
                    }
                    break;
                case "author":
                    if (book.getAuthor().toLowerCase().contains(searchTerm.toLowerCase())) {
                        filteredBooks.add(book);
                    }
                    break;
                case "isbn":
                    if (book.getIsbn().toLowerCase().contains(searchTerm.toLowerCase())) {
                        filteredBooks.add(book);
                    }
                    break;
            }
        }
        return filteredBooks;
    }

    private static final Logger logger = LoggerFactory.getLogger(BookService.class);

    public Book addBook(Book newBook) {
        String sql = "INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)";

        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, newBook.getTitle());
            stmt.setString(2, newBook.getAuthor());
            stmt.setString(3, newBook.getIsbn());

            int rowsAffected = stmt.executeUpdate();

            if (rowsAffected == 1) {
                // Get the generated ID
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        newBook.setId(generatedKeys.getLong(1));
                    }
                }
                return newBook;
            } else {
                // Handle error if no row was inserted
                return null;
            }

        } catch (SQLException e) {
            System.out.println("Error adding book: " + newBook.getTitle());
            System.out.println("SQL Error: " + e.getMessage());
            logger.error("Error occurred:", e); // Log the error
            throw new RuntimeException("Error executing database operation", e);

        }


    }

    public boolean updateBook(long bookId, Book updatedBook) {
        String sqlUpdate = "UPDATE books SET title = ?, author = ?, isbn = ? WHERE id = ?";

        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sqlUpdate)) {

            // 2. Update the book's properties
            stmt.setString(1, updatedBook.getTitle());
            stmt.setString(2, updatedBook.getAuthor());
            stmt.setString(3, updatedBook.getIsbn());
            stmt.setLong(4, bookId);

            // 3. Save the updated book back to the database
            int rowsAffected = stmt.executeUpdate();

            return rowsAffected > 0; // True if the update succeeded
        } catch (SQLException e) {
            System.err.println("Error occurred during book update: " + e.getMessage());
            return false; // Indicate update failure
        }
    }

    public static boolean deleteBook(Connection conn, int bookId) throws SQLException {
        System.out.println("Attempting to delete book with ID: " + bookId); // Backend Logging

        String deleteQuery = "DELETE FROM books WHERE id = ?";

        try (PreparedStatement stmt = conn.prepareStatement(deleteQuery)) {
            stmt.setInt(1, bookId);
            int rowsDeleted = stmt.executeUpdate();

            System.out.println("Rows deleted: " + rowsDeleted); // Log query outcome

            return rowsDeleted > 0; // True if deleted successfully
        } catch (SQLException e) {
            System.err.println("Error deleting book: " + e.getMessage()); // Log any exceptions
            throw e; // Re-throw to propagate the error
        }
    }
    public static boolean borrowBook(Connection conn, int bookId) throws SQLException {
        // Start a transaction
        conn.setAutoCommit(false);

        try {
            // 1. Fetch the book
            String selectQuery = "SELECT * FROM books WHERE id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(selectQuery)) {
                stmt.setInt(1, bookId);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        boolean isBorrowed = rs.getBoolean("is_borrowed");

                        // 2. Check if already borrowed
                        if (isBorrowed) {
                            return false; // Book is unavailable
                        }

                        // 3. Update the book status
                        String updateQuery = "UPDATE books SET is_borrowed = true WHERE id = ?";
                        try (PreparedStatement updateStmt = conn.prepareStatement(updateQuery)) {
                            updateStmt.setInt(1, bookId);
                            int rowsUpdated = updateStmt.executeUpdate();

                            // 4. Commit the transaction if update successful
                            if (rowsUpdated > 0) {
                                conn.commit();
                                return true;
                            } else {
                                return false; // Update failed
                            }
                        }
                    } else {
                        return false; // Book not found
                    }
                }
            }
        } catch (SQLException e) {
            // Rollback the transaction in case of any exceptions
            conn.rollback();
            throw e; // Re-throw the exception
        } finally {
            // Reset auto-commit to its original state
            conn.setAutoCommit(true);
        }
    }
    public static boolean returnBook(Connection conn, int bookId) throws SQLException {
        String updateQuery = "UPDATE books SET is_borrowed = false WHERE id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(updateQuery)) {
            stmt.setInt(1, bookId);
            int rowsUpdated = stmt.executeUpdate();
            return rowsUpdated > 0;
        }
    }

    public Book fetchBookById(Connection conn, int bookId) throws SQLException {
        String selectQuery = "SELECT * FROM books WHERE id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(selectQuery)) {
            stmt.setInt(1, bookId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Book book = new Book();
                    book.setId(rs.getLong("id"));
                    book.setTitle(rs.getString("title") != null ? rs.getString("title") : "");
                    book.setAuthor(rs.getString("author") != null ? rs.getString("author") : "");
                    book.setIsbn(rs.getString("isbn") != null ? rs.getString("isbn") : "");
                    book.setIs_borrowed(rs.getBoolean("is_borrowed"));
                    return book;
                } else {
                    return null; // Book not found
                }
            }
        }
    }
    public static List<Book> fetchAllBorrowedBooks(Connection conn) throws SQLException {
        String selectQuery = "SELECT * FROM books WHERE is_borrowed = 1"; // Assuming '1' for borrowed
        List<Book> borrowedBooks = new ArrayList<>();

        try (PreparedStatement stmt = conn.prepareStatement(selectQuery);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Book book = new Book();

                book.setId(Long.valueOf(rs.getInt("id")));
                book.setTitle(rs.getString("title") != null ? rs.getString("title") : "");
                book.setAuthor(rs.getString("author") != null ? rs.getString("author") : "");
                book.setIsbn(rs.getString("isbn") != null ? rs.getString("isbn") : "");
                book.setIs_borrowed(rs.getInt("is_borrowed") == 1);

                borrowedBooks.add(book);
            }
        }
        return borrowedBooks;
    }
}
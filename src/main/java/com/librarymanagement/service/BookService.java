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
        String sql = "SELECT title, author, isbn FROM books";

        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Book book = new Book();
                book.setTitle(rs.getString("title") != null ? rs.getString("title") : ""); // Handle potential null
                book.setAuthor(rs.getString("author") != null ? rs.getString("author") : "");
                book.setIsbn(rs.getString("isbn") != null ? rs.getString("isbn") : "");
                books.add(book);
            }
        } catch (SQLException e) {
            // Handle SQL exceptions (e.g., log the error)
            e.printStackTrace();
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
            e.printStackTrace();
            return null;

        }
    }
}
package com.librarymanagement.model;

import java.util.List;

public class Library {
    private String name;
    private String location;
    private List<Book> books;

    // Constructors
    public Library() {
    }

    public Library(String name, String location, List<Book> books) {
        this.name = name;
        this.location = location;
        this.books = books;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }

    // Other methods
    @Override
    public String toString() {
        return "Library{" +
                "name='" + name + '\'' +
                ", location='" + location + '\'' +
                ", books=" + books +
                '}';
    }

    // Add other methods as needed
}
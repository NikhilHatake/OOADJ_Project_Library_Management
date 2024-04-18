    package com.librarymanagement.model;

    public class Book {
        private String title;
        private String author;
        private String isbn;

        // Constructors
        public Book() {
        }

        public Book(String title, String author, String isbn) {
            this.title = title;
            this.author = author;
            this.isbn = isbn;
        }

        private Long id;


        public boolean getIs_borrowed() {
            return this.is_borrowed;
        }


        private boolean is_borrowed;

        // Getters and Setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getAuthor() {
            return author;
        }

        public void setAuthor(String author) {
            this.author = author;
        }

        public String getIsbn() {
            return isbn;
        }

        public void setIsbn(String isbn) {
            this.isbn = isbn;
        }
        public void setId(Long id) {
            this.id = id;
        }

        public void setIs_borrowed(boolean is_borrowed) {
            this.is_borrowed = is_borrowed;
        }


        // Other methods

        public String toString() {
            return "Book{" +
                    "title='" + title + '\'' +
                    ", author='" + author + '\'' +
                    ", isbn='" + isbn + '\'' +
                    ", is_borrowed=" + is_borrowed +
                    '}';
        }

        // Add other methods as needed
    }
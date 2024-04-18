document.addEventListener('DOMContentLoaded', () => {

    const addBookForm = document.getElementById('add-book');
    addBookForm.addEventListener('submit', (event) => {
        event.preventDefault();

        console.log("Form submitted!"); // Log form submission

        // Get input values
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;

        console.log("Title:", title);
        console.log("Author:", author);
        console.log("ISBN:", isbn);

        // Your existing add book logic
        const bookData = {
            title: title,
            author: author,
            isbn: isbn
        };

        addBook(bookData)
            .then(newBook => {
                console.log('Book added successfully:', newBook);
            })
            .catch(error => {
                console.error('Error adding book:', error);
            });
    });

    fetchAndDisplayBooks();

    const bookList = document.getElementById('book-list');
    bookList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
                const bookId = event.target.closest('.book').dataset.bookId;
            if (confirm(`Are you sure you want to delete book with ID ${bookId}?`)) {
                deleteBookById(bookId)
                    .then(() => {
                        // Success: Remove the book from the displayed list or display a success message
                        fetchAndDisplayBooks(); // Refetch the list to reflect the deletion
                    })
                    .catch(error => {
                        console.error('Error deleting book:', error);
                        alert('Error deleting book. See console for details.');
                    });
            }
        }
    });

    function fetchAndDisplayBooks() {
        fetch('/books')
            .then(response => {
                console.log("Response status:", response.status); // Log the status code
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(books => {
                const bookList = document.getElementById('book-list');
                bookList.innerHTML = ''; // Clear previous content
                console.log("Book Template:", document.getElementById('book-template').innerHTML);
                // Assuming you have a <script> tag with id="book-template" (see below)
                const bookTemplate = document.getElementById('book-template').innerHTML;

                books.forEach(book => {
                    // Create the book element
                    const bookElement = document.createElement('div');
                    console.log("Book:", book);
                    bookElement.classList.add('book');
                    bookElement.dataset.bookId = book.id; // Set the data-book-id attribute

                    // Use innerHTML for the content
                    bookElement.innerHTML = bookTemplate.replace(/{{bookId}}/g, book.id)
                        .replace(/{{title}}/g, book.title)
                        .replace(/{{author}}/g, book.author)
                        .replace(/{{isbn}}/g, book.isbn);

                    bookList.appendChild(bookElement); // Append the element
                });

                // Event listener for delete buttons (placed within fetchAndDisplayBooks)



            })
            .catch(error => {
                console.error('Error fetching books:', error);
                // Consider displaying an error message to the user here
            });
    }



    function addBook(bookData) {
        fetch('/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Assuming your backend returns the new book on success
                return response.json();
            })
            .then(newBook => {
                // Update your UI or call fetchAndDisplayBooks to refresh
                console.log('Book added successfully:', newBook);
            })
            .catch(error => {
                console.error('Error adding book:', error);
                // Display an error message to the user
            });
        document.getElementById('title').value
    }

    // Placeholders for updateBook and deleteBook
    function updateBook(bookId, updatedData) {
        fetch(`/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Important: Return the promise for further chaining
            })
            .catch(error => {
                console.error('Error updating book:', error);
                // Display a suitable error message to the user
            });
    }

    function handleUpdateButtonClick(bookId) {
        // Populate form fields with existing book data
        document.getElementById('update-book-id').value = bookId;
        document.getElementById('update-title').value = document.getElementById(`book-${bookId}-edit-title`).value;
        document.getElementById('update-author').value = document.getElementById(`book-${bookId}-edit-author`).value;
        document.getElementById('update-isbn').value = document.getElementById(`book-${bookId}-edit-isbn`).value;

        // Show update form
        document.getElementById('update-book-form').style.display = 'block';
    }


    const updateBookForm = document.getElementById('update-book');
    updateBookForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Get updated values
        const bookId = document.getElementById('update-book-id').value;
        const updatedTitle = document.getElementById('update-title').value;
        const updatedAuthor = document.getElementById('update-author').value;
        const updatedISBN = document.getElementById('update-isbn').value;

        const updatedData = {
            title: updatedTitle,
            author: updatedAuthor,
            isbn: updatedISBN
        };

        updateBook(bookId, updatedData)
            .then(() => {
                // Success!
                alert('Book updated successfully!');
                // Consider updating the displayed book details or hiding the form
            })
            .catch(error => {
                console.error('Error updating book:', error);
                alert('Error updating book. See console for details.');
            });
    });


    function deleteBookById(bookId) {
        fetch(`/books/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // Log response from server
                // Handle success response
            })
            .catch(error => {
                console.error('Error deleting book:', error);
                // Handle error
            });
    }





    fetchAndDisplayBooks();


});

function cancelUpdate() {
    const updateForm = document.getElementById('update-book-form');
    updateForm.style.display = 'none';
}
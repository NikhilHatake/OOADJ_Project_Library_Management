document.addEventListener('DOMContentLoaded', () => {
    const addBookButton = document.getElementById('addBookButton');
    const viewLibraryButton = document.getElementById('viewLibraryButton');
    const borrowReturnButton = document.getElementById('borrowReturnButton');

    addBookButton.addEventListener('click', () => {
        window.location.href = "book_management.html";
    });

    viewLibraryButton.addEventListener('click', () => {
        window.location.href = "library.html";
    });


    borrowReturnButton.addEventListener('click', () => {
        window.location.href = "borrow_return.html";
    });



});
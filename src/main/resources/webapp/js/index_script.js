document.addEventListener('DOMContentLoaded', () => {
    const addBookButton = document.getElementById('addBookButton');
    const viewLibraryButton = document.getElementById('viewLibraryButton');

    addBookButton.addEventListener('click', () => {
        window.location.href = "book_management.html";
    });

    viewLibraryButton.addEventListener('click', () => {
        window.location.href = "library.html";
    });
});
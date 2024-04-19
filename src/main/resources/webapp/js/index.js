document.addEventListener('DOMContentLoaded', () => {
    const viewLibraryButton = document.getElementById('viewLibraryButton');
    const borrowReturnButton = document.getElementById('borrowReturnButton');


    viewLibraryButton.addEventListener('click', () => {
        window.location.href = "userview.html";
    });


    borrowReturnButton.addEventListener('click', () => {
        window.location.href = "borrow_return.html";
    });



});
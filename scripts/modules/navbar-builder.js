export { createNavbar };

const pages = {
    "Home": "index.html",
    "Newline": "newline.html",
    "Events": "events.html",
    "Contact": "contact.html",
};

function createNavbar() {
    const navbar = document.getElementById("navbar");
    const activePage = navbar.getAttribute("data-active"); // Get the value of data-active

    for (const page in pages) {
        const a = document.createElement('a');
        a.href = pages[page];
        a.textContent = page;
        
        if (page === activePage) {
            a.classList.add('active');
        }
        
        navbar.appendChild(a);
    }
}

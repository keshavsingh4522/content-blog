// Load footer HTML
fetch('ui/common/footer/footer.html')
.then(response => response.text())
.then(data => {
    document.getElementById('footer-container').innerHTML = data;
});
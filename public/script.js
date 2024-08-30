document.getElementById('studentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        prn: document.getElementById('prn').value,
        year: document.getElementById('year').value,
        branch: document.getElementById('branch').value,
    };

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        showToast("You've earned 5 brownie points! 🍫");
    })
    .catch(error => console.error('Error:', error));
});

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'show';
    setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
}

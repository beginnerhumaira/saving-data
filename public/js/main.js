let editIndex = -1; // To store the index of the user being edited

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Show success message
        event.target.reset(); // Reset the form
        loadUserData(); // Reload the table data
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function loadUserData() {
    fetch('http://localhost:3000/api/get-data')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#userTable tbody');
            tableBody.innerHTML = ''; // Clear existing table data

            // Populate the table with user data
            data.forEach((user, index) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td class="actions">
                        <button class="edit-btn" onclick="openEditModal(${index}, '${user.name}', '${user.email}')">Edit</button>
                        <button class="delete-btn" onclick="deleteUser(${index})">Delete</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

function openEditModal(index, name, email) {
    // Store the index of the user being edited
    editIndex = index;

    // Populate the modal fields with the current user data
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = email;

    // Display the modal
    document.getElementById('editModal').style.display = 'block';
}

document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);
    const updatedData = {};
    formData.forEach((value, key) => {
        updatedData[key] = value;
    });

    // Send the updated data to the server
    fetch(`http://localhost:3000/api/update-data/${editIndex}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Show success message
        loadUserData(); // Reload the table data
        closeModal(); // Close the modal
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function deleteUser(index) {
    fetch(`http://localhost:3000/api/delete-data/${index}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Show success message
        loadUserData(); // Reload the table data
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Close the modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Handle the close button in the modal
document.querySelector('.close').onclick = function() {
    closeModal();
};

// Close the modal if the user clicks outside of the modal content
window.onclick = function(event) {
    if (event.target == document.getElementById('editModal')) {
        closeModal();
    }
};

// Load the user data when the page loads
window.onload = loadUserData;

document.addEventListener('DOMContentLoaded', function () {
    // Retrieve user handles from chrome.storage.local
    chrome.storage.local.get('userHandles', function (result) {
        let userHandles = result.userHandles || [];
        renderTable(userHandles);
    });

    var buttonElement = document.getElementById("button-save");
    var buttonElementClearAll = document.getElementById("button-clear");
    var userHandleTag = "userHandle";
    var userHandleValue = document.getElementById(userHandleTag);

    var keysToRemove = ['userHandles'];

    buttonElement.addEventListener("click", function addUserHandle() {
        var userHandle = document.getElementById(userHandleTag).value;
        var errorMessage = document.getElementById('errorMessage');

        // Simple validation (might want to add more robust validation)
        if (userHandle.trim() === '') {
            errorMessage.style.color = 'red';
            errorMessage.textContent = 'Please enter the codeforces handle!';
            return;
        }

        // Retrieve user handles from chrome.storage.local
        chrome.storage.local.get('userHandles', function (result) {
            let userHandles = result.userHandles || [];
            // Check if the user handle already exists
            if (userHandles.indexOf(userHandle) === -1) {
                // If not, add the user handle
                userHandles.push(userHandle);
                // Update chrome.storage.local with the updated array
                chrome.storage.local.set({ 'userHandles': userHandles }, function () {
                    renderTable(userHandles);
                    errorMessage.textContent = 'Handle Saved Successfully!';
                    errorMessage.style.color = 'green';
                });
            } else {
                errorMessage.style.color = 'red';
                errorMessage.textContent = 'Handle already exists!';
            }
        });
    });

    // Remove all user handles from chrome.storage.local
    buttonElementClearAll.addEventListener('click', () => {
        userHandleValue.value = "";
        chrome.storage.local.remove(keysToRemove, function () {
            renderTable([]);
        });
    });

    function renderTable(listValues) {
        const tableBody = document.getElementById('table-body');
        // Clear existing table rows
        tableBody.innerHTML = '';
        // Loop through the list values and create table rows with delete buttons
        listValues.forEach(value => {
            const row = tableBody.insertRow();
            const valueCell = row.insertCell();
            const actionCell = row.insertCell();
            valueCell.textContent = value;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = function () {
                // Retrieve user handles from chrome.storage.local
                chrome.storage.local.get('userHandles', function (result) {
                    let userHandles = result.userHandles || [];
                    // Find and remove the value from the array
                    const index = userHandles.indexOf(value);
                    if (index !== -1) {
                        userHandles.splice(index, 1);
                        // Update chrome.storage.local with the updated array
                        chrome.storage.local.set({ 'userHandles': userHandles }, function () {
                            renderTable(userHandles);
                        });
                    }
                });
                // Remove the row from the table
                tableBody.removeChild(row);
            };
            actionCell.appendChild(deleteButton);
        });
    }
});
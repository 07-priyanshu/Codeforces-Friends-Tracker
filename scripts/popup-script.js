document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get('userHandles', function (result) {
        let userHandles = result.userHandles || [];
        renderTable(userHandles);
    });
    function renderTable(listValues) {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        listValues.forEach(value => {
            const row = tableBody.insertRow();
            const valueCell = row.insertCell();
            const actionCell = row.insertCell();
            valueCell.textContent = value;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = function () {
                chrome.storage.local.get('userHandles', function (result) {
                    let userHandles = result.userHandles || [];
                    const index = userHandles.indexOf(value);
                    if (index !== -1) {
                        userHandles.splice(index, 1);
                        chrome.storage.local.set({ 'userHandles': userHandles }, function () {
                            renderTable(userHandles);
                        });
                    }
                });
                tableBody.removeChild(row);
            };
            actionCell.appendChild(deleteButton);
        });
    }
    var buttonElement = document.getElementById("btn-save");
    var buttonElementClearAll = document.getElementById("btn-clear");
    var userHandleTag = "userHandle";
    var userHandleValue = document.getElementById(userHandleTag);
    var keysToRemove = ['userHandles'];
    buttonElement.addEventListener("click", function addUserHandle() {
        var userHandle = document.getElementById(userHandleTag).value;
        var errorMessage = document.getElementById('errorMessage');
        if (userHandle.trim() === '') {
            errorMessage.style.color = 'red';
            errorMessage.textContent = 'Please enter the codeforces handle!';
            return;
        }
        chrome.storage.local.get('userHandles', function (result) {
            let userHandles = result.userHandles || [];
            if (userHandles.indexOf(userHandle) === -1) {
                userHandles.push(userHandle);
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
    buttonElementClearAll.addEventListener('click', () => {
        userHandleValue.value = "";
        chrome.storage.local.remove(keysToRemove, function () {
            renderTable([]);
        });
    });
    
});
document.addEventListener("DOMContentLoaded", () => {
    const dobInput = document.getElementById("dob");
    const currentDate = new Date();
    const minDate = new Date(currentDate.getFullYear() - 55, currentDate.getMonth(), currentDate.getDate());
    const maxDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
    dobInput.setAttribute('min', minDate.toISOString().split('T')[0]);
    dobInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
});

const email = document.getElementById("email");
email.addEventListener('input', () => validate(email));

function validate(element) {
    if (element.validity.typeMismatch) {
        element.setCustomValidity("This email is not in the right format");
        element.reportValidity();
    } else {
        element.setCustomValidity('');
    }
}

let userForm = document.getElementById("user-form");

const retrieveEntries = () => {
    let entries = localStorage.getItem("user-entries");
    if (entries) {
        entries = JSON.parse(entries);
    } else {
        entries = [];
    }
    return entries;
};

let userEntries = retrieveEntries();

const displayEntries = () => {
    const entries = retrieveEntries();
    const tableEntries = entries.map((entry) => {
        const nameCell = `<td class="border px-4 py-2">${entry.name}</td>`;
        const emailCell = `<td class="border px-4 py-2">${entry.email}</td>`;
        const passwordCell = `<td class="border px-4 py-2">${entry.password}</td>`;
        const dobCell = `<td class="border px-4 py-2">${entry.dob}</td>`;
        const acceptTermsCell = `<td class="border px-4 py-2">${entry.acceptedTermsAndConditions ? "Yes" : "No"}</td>`;

        const row = `<tr>${nameCell}${emailCell}${passwordCell}${dobCell}${acceptTermsCell}</tr>`;
        return row;
    }).join("\n");

    const table = `<table class="table-auto w-full">
        <thead>
            <tr>
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2">Email</th>
                <th class="px-4 py-2">Password</th>
                <th class="px-4 py-2">Dob</th>
                <th class="px-4 py-2">Accepted terms?</th>
            </tr>
        </thead>
        <tbody>
            ${tableEntries}
        </tbody>
    </table>`;

    let details = document.getElementById("user-entries");
    details.innerHTML = table;
};

const saveUserForm = (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;
    const acceptedTermsAndConditions = document.getElementById("acceptTerms").checked;

    // Validate age
    const dobDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dobDate.getFullYear();
    const monthDiff = currentDate.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < dobDate.getDate())) {
        age--;
    }

    if (age < 18 || age > 55) {
        alert("Age must be between 18 and 55 years.");
        return;
    }

    const entry = {
        name,
        email,
        password,
        dob,
        acceptedTermsAndConditions
    };

    userEntries.push(entry);
    localStorage.setItem("user-entries", JSON.stringify(userEntries));
    displayEntries();
};

userForm.addEventListener("submit", saveUserForm);
displayEntries();

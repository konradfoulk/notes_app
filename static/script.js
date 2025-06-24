let notes = [];

function updateNotesList() {
    let fileList = document.querySelector('#file-list');
    fileList.innerHTML = '';

    for (let note of notes) {
        let btn = document.createElement('button');

        btn.textContent = note.id;
        btn.id = note.id;
        fileList.appendChild(btn);
    };
}; // issue with this is it requires to loop through every note very frequently, bad for performance

async function createNote() {
    const response = await fetch('/notes', { method: 'POST' });
    const data = await response.json();
    notes.unshift(data);
    updateNotesList()
};

async function loadNotes() {
    const response = await fetch('/notes');
    const data = await response.json();
    notes = data;
    updateNotesList()
};

const newFileBtn = document.querySelector('#new-file-btn');
newFileBtn.addEventListener('click', createNote);

loadNotes();
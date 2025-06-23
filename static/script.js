let notes = []; // this will be our "local storage" for all of our notes objects (content and timestamps)


function updateNotesList() {
    const fileList = document.querySelector('#file-list');
    re = /^[^>]*>([^<]{1,20})(?:[^<]*)</;

    fileList.innerHTML = '';
    for (let note in notes) {
        const fileBtn = document.createElement('button');

        title = re.match(note.content);
        if (title) {
            if (title.length == 20) {
                fileBtn.textContent = title.slice(0, 16) + '...';
            } else {
                fileBtn.textContent = title;
            };
        } else {
            fileBtn.textContent = 'New Note';
        };
        fileList.appendChild(fileBtn);
        fileBtn.addEventListener('click', openNote(note.id));
    };
};

function openNote(id) {
    let note = notes.find(n => n.id === id);
};

async function createNote() {
    let response = await fetch('/notes', { method: 'POST' });
    let data = await response.json();
    notes.unshift(data);
    updateNotesList();
    openNote(data.id);
};

async function loadNotes() {
    let response = await fetch('/notes');
    let data = await response.json();
    notes = data;

    updateNoteList();

    if (notes.length > 0) {
        opennote;
    } else {
        createNote()
    };
};

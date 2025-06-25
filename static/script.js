let notes = [];
let currentNoteId;
let fileList = document.querySelector('#file-list');
const newFileBtn = document.querySelector('#new-file-btn');
let editor = document.querySelector('#note-editor');

function createBtn(noteId) {
    let btn = document.createElement('button');

    btn.textContent = noteId; //need to fix this next
    btn.id = 'note-' + noteId;
    btn.classList.add('note-btn');

    btn.addEventListener('click', () => {
        editor.style.visibility = 'visible';
        editor.innerHTML = notes.find(note => note.id == noteId).content;
        currentNoteId = noteId;
    });
    return (btn);
};

async function createNote() {
    const response = await fetch('/notes', { method: 'POST' });
    const data = await response.json();

    notes.unshift(data);
    btn = createBtn(data.id);
    fileList.insertBefore(btn, fileList.firstChild);

    //need to open note automatically
};

async function loadNotes() {
    const response = await fetch('/notes');
    const data = await response.json();
    notes = data;

    for (let note of notes) {
        btn = createBtn(note.id);
        fileList.appendChild(btn);
    };
};

async function saveNote() {
    const content = editor.innerHTML;
    const response = await fetch(`/notes/${currentNoteId}`, {
        method: 'PUT',
        body: JSON.stringify({ content: content }),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();

    let index = notes.findIndex(n => n.id == currentNoteId);

    notes.splice(index, 1);
    notes.unshift(data);
    console.log(notes); // this is unnecessary in production

    document.querySelector(`#note-${currentNoteId}`).remove();
    newbtn = createBtn(currentNoteId);
    fileList.insertBefore(newbtn, fileList.firstChild);
};

newFileBtn.addEventListener('click', createNote);

editor.addEventListener('input', saveNote);

loadNotes();
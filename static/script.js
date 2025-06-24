let notes = [];
let fileList = document.querySelector('#file-list');

function createBtn(noteId) {
    let btn = document.createElement('button');
    let editor = document.querySelector('#note-editor');

    //unnecessary
    btn.textContent = noteId;
    btn.id = noteId;
    //unnecessary

    btn.addEventListener('click', () => {
        editor.style.visibility = 'visible';
        editor.innerHTML = notes.find(note => note.id == noteId).content;
    });
    return (btn);
}

async function createNote() {
    const response = await fetch('/notes', { method: 'POST' });
    const data = await response.json();

    notes.unshift(data);
    btn = createBtn(data.id);
    fileList.insertBefore(btn, fileList.firstChild);
};

async function loadNotes() {
    const response = await fetch('/notes');
    const data = await response.json();
    notes = data;

    fileList.innerHTML = '';
    for (let note of notes) {
        note.content = "apple"

        btn = createBtn(note.id)
        fileList.appendChild(btn);
    };
    notes[0].content = 'banana';
};

const newFileBtn = document.querySelector('#new-file-btn');
newFileBtn.addEventListener('click', createNote);

loadNotes();
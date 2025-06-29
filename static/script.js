let notes = [];
let currentNoteId;
let fileList = document.querySelector('#file-list');
let editor = document.querySelector('#note-editor');

function getTitle(content) {
    if (!content) {
        return 'New Note';
    };

    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = content;

    let title = '';
    for (let node of contentContainer.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (text) {
                title = text;
                break;
            };
        };
        if (node.nodeType === Node.ELEMENT_NODE) {
            const text = node.innerText;
            if (text) {
                title = text;
                break;
            };
        };
    };

    if (!title) {
        return 'New Note';
    };

    if (title.length > 20) {
        return title.slice(0, 17) + '...';
    };

    return title;
};

function createBtn(noteId) {
    let btn = document.createElement('button');

    btn.textContent = getTitle(notes.find(note => note.id == noteId).content);
    btn.id = 'note-' + noteId;

    btn.addEventListener('click', e => {
        editor.innerHTML = notes.find(note => note.id == noteId).content;
        if (editor.style.visibility == 'hidden') {
            editor.style.visibility = 'visible';
        };

        if (document.querySelector('.active')) {
            document.querySelector('.active').classList.remove('active');
        };
        e.target.classList.add('active');

        currentNoteId = noteId;
    });
    return (btn);
};

async function createNote() {
    try {
        const response = await fetch('/notes', { method: 'POST' });
        const data = await response.json();

        notes.unshift(data);
        btn = createBtn(data.id);
        fileList.insertBefore(btn, fileList.firstChild);

        btn.click();
    } catch (error) {
        console.log('Error creating note: ' + error);
    };
};

async function loadNotes() {
    try {
        const response = await fetch('/notes');
        const data = await response.json();
        notes = data;

        for (let note of notes) {
            btn = createBtn(note.id);
            fileList.insertBefore(btn, fileList.firstChild);
        };

        if (fileList.firstChild) {
            fileList.firstChild.click();
        } else {
            createNote();
        };
    } catch (error) {
        console.log('Error loading notes: ' + error);
    };
};

async function saveNote() {
    try {
        const content = editor.innerHTML;
        const response = await fetch(`/notes/${currentNoteId}`, {
            method: 'PUT',
            body: JSON.stringify({ content: content }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        notes.splice(notes.findIndex(note => note.id == currentNoteId), 1);
        notes.unshift(data);

        btn = document.querySelector(`#note-${currentNoteId}`);
        if (document.querySelector('#file-list').firstChild.id != 'note-' + currentNoteId) {
            btn.remove();
            newBtn = createBtn(currentNoteId);
            newBtn.classList.add('active');
            fileList.insertBefore(newBtn, fileList.firstChild);
        } else {
            btn.textContent = getTitle(data.content);
        };
    } catch (error) {
        console.log('Error saving note: ' + error);
    };
};

async function deleteNote() {
    try {
        if (notes.find(note => note.id == currentNoteId)) {
            const response = await fetch(`/notes/${currentNoteId}`, { method: 'DELETE' });
            const data = await response.json();

            notes.splice(notes.findIndex(note => note.id == data.id), 1);
            document.querySelector(`#note-${data.id}`).remove();

            if (fileList.firstChild) {
                fileList.firstChild.click();
            } else {
                editor.style.visibility = 'hidden';
            };
        };
    } catch (error) {
        console.log('Error deleting notes: ' + error);
    };
};

document.querySelector('#new-file-btn').addEventListener('click', createNote);
document.querySelector('#delete-btn').addEventListener('click', deleteNote);
document.querySelectorAll('.rich-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.execCommand(btn.id, false, null);
    });
});
document.querySelectorAll('.adv-rich-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.execCommand(btn.classList.item(1), false, btn.id);
    });
});
editor.addEventListener('input', saveNote);

loadNotes();

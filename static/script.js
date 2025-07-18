let notes = [];
let currentNoteId;
const fileList = document.querySelector('#file-list');
const editor = document.querySelector('#note-editor');
const toolBtns = document.querySelectorAll('#toolbar button')

const quill = new Quill('#note-editor', {
    modules: {
        toolbar: '#toolbar'
    }
});
editor.style.visibility = 'hidden'
toolBtns.forEach(btn => {
    btn.disabled = true;
});

function getTitle(content) {
    if (!content) {
        return 'New Note';
    };

    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = content;

    let title = '';
    for (const node of contentContainer.childNodes) {
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
    title = title.trim()

    if (!title) {
        return 'New Note';
    };

    if (title.length > 20) {
        return title.slice(0, 17) + '...';
    };

    return title;
};

function createBtn(noteId) {
    const btn = document.createElement('button');

    btn.textContent = getTitle(notes.find(note => note.id == noteId).content);
    btn.id = 'note-' + noteId;

    btn.addEventListener('click', event => {
        quill.root.innerHTML = notes.find(note => note.id == noteId).content;
        if (editor.style.visibility == 'hidden') {
            editor.style.visibility = 'visible';
            toolBtns.forEach(btn => {
                btn.disabled = false;
            });
        };

        if (document.querySelector('.active')) {
            document.querySelector('.active').classList.remove('active');
        };
        event.target.classList.add('active');

        currentNoteId = noteId;
        document.querySelector('.ql-editor').focus()
    });
    return (btn);
};

async function createNote() {
    try {
        const response = await fetch('/notes', { method: 'POST' });
        const data = await response.json();

        notes.unshift(data);
        const btn = createBtn(data.id);
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

        for (const note of notes) {
            const btn = createBtn(note.id);
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
        const content = quill.root.innerHTML;
        const response = await fetch(`/notes/${currentNoteId}`, {
            method: 'PUT',
            body: JSON.stringify({ content: content }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        notes.splice(notes.findIndex(note => note.id == currentNoteId), 1);
        notes.unshift(data);

        const btn = document.querySelector(`#note-${currentNoteId}`);
        if (document.querySelector('#file-list').firstChild.id != 'note-' + currentNoteId) {
            btn.remove();
            const newBtn = createBtn(currentNoteId);
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
                toolBtns.forEach(btn => {
                    btn.disabled = true;
                    btn.ariaPressed = false;
                });
            };
        };
    } catch (error) {
        console.log('Error deleting notes: ' + error);
    };
};

document.querySelector('#new-file-btn').addEventListener('click', createNote);
document.querySelector('#delete-btn').addEventListener('click', deleteNote);
document.querySelector('#editor-container').addEventListener('click', () => {
    if (editor.style.visibility == 'hidden') {
        createNote();
    };
});
let timeout
quill.on('text-change', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        if (quill.root.innerHTML != notes.find(note => note.id == currentNoteId).content) {
            saveNote()
        };
    }, 360)
});

loadNotes();

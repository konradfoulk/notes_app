let notes = []; // local storage for notes so not constantly calling api
let currentNoteId; // to access current note with all current changes
const fileList = document.querySelector('#file-list');
const editor = document.querySelector('#note-editor');
const toolBtns = document.querySelectorAll('#toolbar button')

// intialize Quill and editor
const quill = new Quill('#note-editor', {
    modules: {
        toolbar: '#toolbar'
    }
});
editor.style.visibility = 'hidden'
toolBtns.forEach(btn => {
    btn.disabled = true;
});

// generate a title from the first line of content in the note
function getTitle(content) {
    if (!content) {
        return 'New Note';
    };

    // asign content to a dummy div
    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = content;

    let title = '';
    // loop through nodes of div to find text
    for (const node of contentContainer.childNodes) {
        type = node.nodeType
        if (type === Node.TEXT_NODE) {
            const text = node.textContent;
            if (text) {
                title = text;
                break;
            };
        };
        if (type === Node.ELEMENT_NODE) {
            const text = node.innerText;
            if (text) {
                title = text;
                break;
            };
        };
    };
    title = title.trim() // get rid of white space

    if (!title) {
        return 'New Note';
    };

    // title should not be longer than 20 characters
    if (title.length > 20) {
        return title.slice(0, 17) + '...';
    };

    return title;
};

function findNote(noteId) {
    return notes.find(note => note.id == noteId)
}

function createBtn(noteId) {
    const btn = document.createElement('button');

    btn.textContent = getTitle(findNote(noteId).content); // generate title for "file"
    btn.id = `note-${noteId}`; // notes are owned by buttons, easy navigation

    // on click:
    // set the editor contents to the note
    // remove active class from other buttons
    // add active class to current button
    // set focus onto the editor
    btn.addEventListener('click', event => {
        quill.root.innerHTML = findNote(noteId).content;
        if (editor.style.visibility == 'hidden') {
            editor.style.visibility = 'visible';
            toolBtns.forEach(btn => {
                btn.disabled = false;
            });
        };

        const oldActive = document.querySelector('.active')
        if (oldActive) {
            oldActive.classList.remove('active');
        };
        event.target.classList.add('active');

        currentNoteId = noteId;
        document.querySelector('.ql-editor').focus()
    });
    return (btn);
};

async function createNote() {
    try {
        // call server api
        const response = await fetch('/notes', { method: 'POST' });
        const data = await response.json();

        notes.unshift(data); // add note to local array
        // create button for note and instert at the top of file list
        const btn = createBtn(data.id);
        fileList.insertBefore(btn, fileList.firstChild);

        btn.click(); // automatically select created note
    } catch (error) {
        console.log('Error creating note: ' + error);
    };
};

async function loadNotes() {
    try {
        // call server api and update local array to match db
        const response = await fetch('/notes');
        const data = await response.json();
        notes = data;

        // create button for each note
        // notes are sorted by the server, newest notes go at the top
        for (const note of notes) {
            const btn = createBtn(note.id);
            fileList.insertBefore(btn, fileList.firstChild);
        };

        // automatically select first note or create one
        if (fileList.firstChild) {
            fileList.firstChild.click();
        } else {
            createNote();
        };
    } catch (error) {
        console.log('Error loading notes: ' + error);
    };
};

function findNoteIndex(noteId) {
    return notes.findIndex(note => note.id == noteId)
}

async function saveNote() {
    try {
        // call server api with note content
        const content = quill.root.innerHTML;
        const response = await fetch(`/notes/${currentNoteId}`, {
            method: 'PUT',
            body: JSON.stringify({ content: content }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        // update local array and maintain order
        notes.splice(findNoteIndex(currentNoteId), 1);
        notes.unshift(data);

        const btn = document.querySelector(`#note-${currentNoteId}`);
        // move note button if not at top of list
        // if already at the top, just update the title
        if (document.querySelector('#file-list').firstChild.id != `note-${currentNoteId}`) {
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
        if (findNote(currentNoteId)) {
            // call server api to delete note
            const response = await fetch(`/notes/${currentNoteId}`, { method: 'DELETE' });
            const data = await response.json();

            // delete note from loca array and remove button
            notes.splice(findNoteIndex(data.id), 1);
            document.querySelector(`#note-${data.id}`).remove();

            // automatically select the next note
            // hide editor and disable buttons if no note
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

// add event listeners
document.querySelector('#new-file-btn').addEventListener('click', createNote);
document.querySelector('#delete-btn').addEventListener('click', deleteNote);

// automatically create a note by clicking the editor if there are no notes
document.querySelector('#editor-container').addEventListener('click', () => {
    if (editor.style.visibility == 'hidden') {
        createNote();
    };
});

let timeout
// autosave notes with 360 ms debounce
quill.on('text-change', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        if (quill.root.innerHTML != findNote(currentNoteId).content) {
            saveNote()
        };
    }, 360)
});

// initialize app
loadNotes();

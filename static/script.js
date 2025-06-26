let notes = [];
let currentNoteId;
let fileList = document.querySelector('#file-list');
const newFileBtn = document.querySelector('#new-file-btn');
let editor = document.querySelector('#note-editor');

function getTitle(content) {
    if (!content) {
        return 'New Note'
    }

    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = content

    let title = ''
    for (let node of contentContainer.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            const t = node.textContent;
            if (t) {
                title = t;
                break;
            };
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            const t = node.innerText;
            if (t) {
                title = t;
                break;
            }
        }
    };

    if (!title) {
        return 'New Note'
    }

    if (title.length >= 20) {
        return title.slice(0, 17) + '...'
    };

    return title
};

function createBtn(noteId) {
    let btn = document.createElement('button');

    content = notes.find(note => note.id == noteId).content
    btn.textContent = getTitle(content);
    btn.id = 'note-' + noteId;
    btn.classList.add('note-btn');

    btn.addEventListener('click', e => {
        editor.style.visibility = 'visible';
        editor.innerHTML = notes.find(note => note.id == noteId).content;

        if (document.querySelector('.active')) {
            document.querySelector('.active').classList.remove('active')
        }
        e.target.classList.add('active')

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

    btn.click()
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

    console.log(document.querySelector('#file-list').firstChild.id)

    // this whole thing could be updateBtn()?
    if (document.querySelector('#file-list').firstChild.id != 'note-' + currentNoteId) {
        document.querySelector(`#note-${currentNoteId}`).remove();
        newbtn = createBtn(currentNoteId);
        newbtn.classList.add('active');
        fileList.insertBefore(newbtn, fileList.firstChild);
    } else {
        btn = document.querySelector(`#note-${currentNoteId}`)
        btn.textContent = getTitle(data.content);
    };
};

newFileBtn.addEventListener('click', createNote);

editor.addEventListener('input', saveNote);

loadNotes();
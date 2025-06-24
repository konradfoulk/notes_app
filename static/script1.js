// let notes = []; // this will be our "local storage" for all of our notes objects (content and timestamps)


// function updateNotesList() {
//     const fileList = document.querySelector('#file-list');
//     const re = /^[^>]*>([^<]{1,20})(?:[^<]*)</;

//     fileList.innerHTML = '';
//     for (let note of notes) {
//         const fileBtn = document.createElement('button');

//         title = note.content.match(re);
//         if (title) {
//             if (title.length == 20) {
//                 fileBtn.textContent = title.slice(0, 16) + '...';
//             } else {
//                 fileBtn.textContent = title;
//             };
//         } else {
//             fileBtn.textContent = 'New Note';
//         };
//         fileList.appendChild(fileBtn);
//         fileBtn.addEventListener('click', e => { openNote(note.id, e) });
//     };
// };

// function openNote(id, event) {
//     let note = notes.find(n => n.id === id);
//     let editor = document.querySelector('#note-editor')
//     let fileList = document.querySelector('#file-list')

//     editor.innerHTML = note.content
//     for (let button of fileList.children) {
//         button.classList.remove('active')
//     }
//     event.target.classList.add('active')
// };

// async function createNote() {
//     let response = await fetch('/notes', { method: 'POST' });
//     let data = await response.json();
//     notes.unshift(data);
//     updateNotesList();
//     // openNote(data.id);
// };

// async function loadNotes() {
//     let response = await fetch('/notes');
//     let data = await response.json();
//     notes = data;

//     updateNoteList();

//     if (notes.length > 0) {
//         opennote;
//     } else {
//         createNote()
//     };
// };

// const newFileBtn = document.querySelector('#new-file-btn')

// // newFileBtn.addEventListener('click', createNote())
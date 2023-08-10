// Function to check if the user is an admin
function isAdmin() {
  const apiKey = localStorage.getItem('api_key') || '';
  if (apiKey === 'adminadmin') {
    return true;
  }
  return false;
}

// Function to check the API key and determine user type
function checkApiKey() {
  if (!isAdmin()) {
    showNoteLimit(5);
    enableNoteInput(true);
  } else {
    showNoteLimit(null);
    enableNoteInput(true);
  }
}

// Function to display the note limit
function showNoteLimit(limit = null) {
  localStorage.setItem('noteLimit', limit);
  const noteLimitElement = $('#noteLimit');
  noteLimitElement.text(`Note Limit: ${limit == null ? 'No Limit' : limit}`);
}

// Function to enable or disable the note input field based on user type
function enableNoteInput(enabled) {
  const noteInput = $('#noteInput');
  const saveNoteBtn = $('#saveNoteBtn');
  noteInput.prop('disabled', !enabled);
  saveNoteBtn.prop('disabled', !enabled);
  if (!enabled) {
    const noteLimitElement = $('#noteLimit');
    noteLimitElement.empty();
  }
}

// Function to handle the submit button click event
function onSubmitButtonClick() {
  const apiKeyInput = $('#apiKeyInput');
  const apiKey = apiKeyInput.val().trim();
  localStorage.setItem('api_key', apiKey);
  localStorage.removeItem('notes');
  displayNotes();
  checkApiKey();
}

// Function to handle the save note button click event
function onSaveNoteButtonClick() {
  const noteInput = $('#noteInput');
  const noteText = noteInput.val().trim();

  if (noteText !== '') {
    if (isAdmin()) {
      saveNoteToStorage(noteText);
      noteInput.val('');
    } else {
      const nonAdminNotes = getStoredNotes('non_admin_notes');
      if (nonAdminNotes.length < 5) {
        saveNoteToStorage(noteText);
        noteInput.val('');
      } else {
        alert('You have reached the note-taking limit!');
      }
    }
    displayNotes();
  } else {
    alert('Note cannot be empty!');
  }
}

// Function to save the note to local storage
function saveNoteToStorage(note) {
  const notes = getStoredNotes();
  notes.push(note);
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Function to display notes
function displayNotes() {
  const notesContainer = $('#notesContainer');
  const notes = getStoredNotes();
  notesContainer.empty();
  notesContainer[0].innerHTML = notes.map((v) => `<li>${v}</li>`).join('');

  $('#apiKeyInput').val(localStorage.getItem('api_key'));
}

// Function to retrieve stored notes from local storage
function getStoredNotes() {
  return JSON.parse(localStorage.getItem('notes')) || [];
}

// Event listeners for the submit and save note buttons
$('#submitBtn').on('click', onSubmitButtonClick);
$('#saveNoteBtn').on('click', onSaveNoteButtonClick);

// Display saved notes when the page is loaded
$(document).ready(function () {
  displayNotes();
  checkApiKey();
});

// Current Date and State
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate = null;
let notes = JSON.parse(localStorage.getItem('advancedTimeManagerNotes')) || {};
let currentlyEditingNoteIndex = null;

// DOM Elements
const calendarGrid = document.getElementById('calendarGrid');
const monthYearDisplay = document.getElementById('monthYearDisplay');
const currentMonthYear = document.getElementById('currentMonthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const monthDropdown = document.getElementById('monthDropdown');
const monthDropdownMenu = document.getElementById('monthDropdownMenu');
const noteModal = document.getElementById('noteModal');
const noteModalDate = document.getElementById('noteModalDate');
const noteText = document.getElementById('noteText');
const noteType = document.getElementById('noteType');
const noteTime = document.getElementById('noteTime');
const saveNoteBtn = document.getElementById('saveNote');
const deleteNoteBtn = document.getElementById('deleteNote');
const closeNoteModal = document.getElementById('closeNoteModal');
const darkModeToggle = document.getElementById('darkModeToggle');
const notesListModal = document.getElementById('notesListModal');
const notesListModalDate = document.getElementById('notesListModalDate');
const notesListContainer = document.getElementById('notesListContainer');
const closeNotesListModal = document.getElementById('closeNotesListModal');
const closeNotesList = document.getElementById('closeNotesList');
const addNewNote = document.getElementById('addNewNote');
const financeNavButton = document.getElementById('financeNavButton');

// Initialize Calendar
function initCalendar() {
    updateMonthYearDisplay();
    renderCalendar();
    populateMonthDropdown();
}

// Update Month/Year Display
function updateMonthYearDisplay() {
    const monthNames = ["Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"];
    monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    currentMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
}

// Render Calendar
function renderCalendar() {
    calendarGrid.innerHTML = '';
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    // Previous Month Days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = 0; i < startingDay; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day p-2 h-28 border rounded-lg bg-gray-50 dark:bg-dark-300 text-gray-400 dark:text-gray-500';
        dayElement.textContent = prevMonthLastDay - startingDay + i + 1;
        calendarGrid.appendChild(dayElement);
    }
    
    // Current Month Days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day p-2 h-28 border rounded-lg bg-white dark:bg-dark-200 cursor-pointer overflow-y-auto';
        dayElement.textContent = i;
        
        // Highlight Today
        if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayElement.classList.add('border-2', 'border-indigo-500');
        }
        
        // Check for Notes
        const dateKey = `${currentYear}-${currentMonth + 1}-${i}`;
        if (notes[dateKey]) {
            const noteContainer = document.createElement('div');
            noteContainer.className = 'mt-1 space-y-1';
            
            notes[dateKey].forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.className = 'text-xs p-1 rounded truncate';
                
                // Set Background Based on Priority
                if (note.priority === 'low') noteElement.classList.add('bg-green-100', 'dark:bg-green-900');
                else if (note.priority === 'medium') noteElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900');
                else if (note.priority === 'high') noteElement.classList.add('bg-red-100', 'dark:bg-red-900');
                else if (note.priority === 'urgent') noteElement.classList.add('bg-red-200', 'dark:bg-red-800');
                
                // Add Icon Based on Note Type
                let iconClass = 'fas fa-calendar';
                if (note.type === 'task') iconClass = 'fas fa-check-circle';
                else if (note.type === 'study') iconClass = 'fas fa-book';
                else if (note.type === 'reminder') iconClass = 'fas fa-bell';
                else if (note.type === 'personal') iconClass = 'fas fa-user';
                
                noteElement.innerHTML = `
                    <i class="${iconClass} mr-1"></i>
                    ${note.time ? `<span class="font-semibold">${note.time}</span> ` : ''}
                    ${note.text.substring(0, 15)}${note.text.length > 15 ? '...' : ''}
                `;
                
                noteContainer.appendChild(noteElement);
            });
            
            dayElement.appendChild(noteContainer);
        }
        
        dayElement.addEventListener('click', () => openNotesListModal(i));
        calendarGrid.appendChild(dayElement);
    }
    
    // Next Month Days
    const totalCells = startingDay + daysInMonth;
    const remainingCells = totalCells > 35 ? 42 - totalCells : 35 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day p-2 h-28 border rounded-lg bg-gray-50 dark:bg-dark-300 text-gray-400 dark:text-gray-500';
        dayElement.textContent = i;
        calendarGrid.appendChild(dayElement);
    }
}

// Populate Month Dropdown
function populateMonthDropdown() {
    monthDropdownMenu.innerHTML = '';
    const monthNames = ["Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"];
    
    for (let i = 0; i < 12; i++) {
        const monthItem = document.createElement('a');
        monthItem.href = '#';
        monthItem.className = 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300';
        monthItem.textContent = monthNames[i];
        
        monthItem.addEventListener('click', (e) => {
            e.preventDefault();
            currentMonth = i;
            updateMonthYearDisplay();
            renderCalendar();
            monthDropdownMenu.classList.add('hidden');
        });
        
        monthDropdownMenu.appendChild(monthItem);
    }
    
    // Add Year Selector
    const yearItem = document.createElement('div');
    yearItem.className = 'px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-dark-300';
    
    const yearSelect = document.createElement('select');
    yearSelect.className = 'w-full bg-transparent border-none focus:ring-0';
    
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) {
            option.selected = true;
        }
        yearSelect.appendChild(option);
    }
    
    yearSelect.addEventListener('change', () => {
        currentYear = parseInt(yearSelect.value);
        updateMonthYearDisplay();
        renderCalendar();
    });
    
    yearItem.appendChild(yearSelect);
    monthDropdownMenu.appendChild(yearItem);
}

// Open Notes List Modal
function openNotesListModal(day) {
    selectedDate = new Date(currentYear, currentMonth, day);
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    
    const monthNames = ["Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"];
    notesListModalDate.textContent = `${day} ${monthNames[currentMonth]}, ${currentYear}`;
    
    // Clear Previous Notes
    notesListContainer.innerHTML = '';
    
    // Show Message if No Notes
    if (!notes[dateKey] || notes[dateKey].length === 0) {
        notesListContainer.innerHTML = '<p class="text-center text-gray-500 py-4">Không có ghi chú cho ngày này</p>';
    } else {
        // Add Each Note to List
        notes[dateKey].forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item p-3 mb-2 rounded-lg flex justify-between items-center';
            
            // Set Background Based on Priority
            if (note.priority === 'low') noteElement.classList.add('bg-green-100', 'dark:bg-green-900');
            else if (note.priority === 'medium') noteElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900');
            else if (note.priority === 'high') noteElement.classList.add('bg-red-100', 'dark:bg-red-900');
            else if (note.priority === 'urgent') noteElement.classList.add('bg-red-200', 'dark:bg-red-800');
            
            // Add Icon Based on Note Type
            let iconClass = 'fas fa-calendar';
            if (note.type === 'task') iconClass = 'fas fa-check-circle';
            else if (note.type === 'study') iconClass = 'fas fa-book';
            else if (note.type === 'reminder') iconClass = 'fas fa-bell';
            else if (note.type === 'personal') iconClass = 'fas fa-user';
            
            noteElement.innerHTML = `
                <div>
                    <div class="flex items-center">
                        <i class="${iconClass} mr-2"></i>
                        <span class="font-medium">${note.type === 'event' ? 'Sự Kiện' : note.type === 'task' ? 'Nhiệm Vụ' : note.type === 'study' ? 'Học Tập' : note.type === 'reminder' ? 'Nhắc Nhở' : 'Cá Nhân'}</span>
                    </div>
                    <div class="text-sm mt-1">
                        ${note.time ? `<span class="font-semibold">${note.time}</span> - ` : ''}
                        ${note.text.substring(0, 30)}${note.text.length > 30 ? '...' : ''}
                    </div>
                    <div class="flex flex-wrap mt-1">
                        ${note.categories ? note.categories.map(cat => 
                            `<span class="category-tag ${getCategoryColorClass(cat)} mr-1 mb-1">${cat === 'work' ? 'Công Việc' : cat === 'study' ? 'Học Tập' : cat === 'personal' ? 'Cá Nhân' : 'Sức Khỏe'}</span>`
                        ).join('') : ''}
                    </div>
                </div>
                <button class="edit-note-btn p-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <i class="fas fa-edit"></i>
                </button>
            `;
            
            // Add Edit Functionality
            const editBtn = noteElement.querySelector('.edit-note-btn');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openNoteModalForEdit(day, index);
            });
            
            notesListContainer.appendChild(noteElement);
        });
    }
    
    notesListModal.classList.remove('hidden');
}

// Get Category Color Class
function getCategoryColorClass(category) {
    switch(category) {
        case 'work': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
        case 'study': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
        case 'personal': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
        case 'health': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
        default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
}

// Open Note Modal for Edit
function openNoteModalForEdit(day, noteIndex) {
    currentlyEditingNoteIndex = noteIndex;
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    const note = notes[dateKey][noteIndex];
    
    const monthNames = ["Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"];
    noteModalDate.textContent = `${day} ${monthNames[currentMonth]}, ${currentYear}`;
    
    // Populate Form with Note Data
    noteType.value = note.type || 'event';
    document.querySelector(`input[name="priority"][value="${note.priority || 'medium'}"]`).checked = true;
    
    // Clear All Category Checkboxes
    document.querySelectorAll('input[name="category"]').forEach(cb => cb.checked = false);
    
    // Check Categories in Note
    if (note.categories) {
        note.categories.forEach(cat => {
            const checkbox = document.querySelector(`input[name="category"][value="${cat}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    noteTime.value = note.time || '';
    noteText.value = note.text || '';
    
    // Show Note Modal and Hide Notes List Modal
    notesListModal.classList.add('hidden');
    noteModal.classList.remove('hidden');
}

// Open Note Modal for New Note
function openNoteModalForNew(day) {
    currentlyEditingNoteIndex = null;
    selectedDate = new Date(currentYear, currentMonth, day);
    
    const monthNames = ["Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"];
    noteModalDate.textContent = `${day} ${monthNames[currentMonth]}, ${currentYear}`;
    
    // Reset Form
    noteType.value = 'event';
    document.querySelector('input[name="priority"][value="medium"]').checked = true;
    document.querySelectorAll('input[name="category"]').forEach(cb => cb.checked = false);
    noteTime.value = '';
    noteText.value = '';
    
    // Show Note Modal and Hide Notes List Modal
    notesListModal.classList.add('hidden');
    noteModal.classList.remove('hidden');
}

// Save Note
function saveNote() {
    if (!selectedDate) return;
    
    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    const noteContent = noteText.value.trim();
    
    if (noteContent) {
        // Get Selected Priority
        const priority = document.querySelector('input[name="priority"]:checked').value;
        
        // Get Selected Categories
        const categories = [];
        document.querySelectorAll('input[name="category"]:checked').forEach(cb => {
            categories.push(cb.value);
        });
        
        const newNote = {
            type: noteType.value,
            priority: priority,
            categories: categories,
            time: noteTime.value,
            text: noteContent,
            createdAt: new Date().toISOString()
        };
        
        // Initialize Notes Array for This Date if Not Exists
        if (!notes[dateKey]) {
            notes[dateKey] = [];
        }
        
        if (currentlyEditingNoteIndex !== null) {
            // Update Existing Note
            notes[dateKey][currentlyEditingNoteIndex] = newNote;
        } else {
            // Add New Note
            notes[dateKey].push(newNote);
        }
        
        // Sort Notes by Time if Available
        notes[dateKey].sort((a, b) => {
            if (a.time && b.time) return a.time.localeCompare(b.time);
            return 0;
        });
        
        localStorage.setItem('advancedTimeManagerNotes', JSON.stringify(notes));
    }
    
    renderCalendar();
    noteModal.classList.add('hidden');
    currentlyEditingNoteIndex = null;
}

// Delete Note
function deleteNote() {
    if (!selectedDate || currentlyEditingNoteIndex === null) return;
    
    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    
    // Remove Note at Current Index
    notes[dateKey].splice(currentlyEditingNoteIndex, 1);
    
    // Remove Date Key if No Notes Left
    if (notes[dateKey].length === 0) {
        delete notes[dateKey];
    }
    
    localStorage.setItem('advancedTimeManagerNotes', JSON.stringify(notes));
    renderCalendar();
    noteModal.classList.add('hidden');
    currentlyEditingNoteIndex = null;
}

// Event Listeners
prevMonthBtn.addEventListener('click', () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    updateMonthYearDisplay();
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    updateMonthYearDisplay();
    renderCalendar();
});

monthDropdown.addEventListener('click', () => {
    monthDropdownMenu.classList.toggle('hidden');
});

saveNoteBtn.addEventListener('click', saveNote);
deleteNoteBtn.addEventListener('click', deleteNote);
closeNoteModal.addEventListener('click', () => {
    noteModal.classList.add('hidden');
    currentlyEditingNoteIndex = null;
});

noteModal.addEventListener('click', (e) => {
    if (e.target === noteModal) {
        noteModal.classList.add('hidden');
        currentlyEditingNoteIndex = null;
    }
});

closeNotesListModal.addEventListener('click', () => {
    notesListModal.classList.add('hidden');
});

closeNotesList.addEventListener('click', () => {
    notesListModal.classList.add('hidden');
});

addNewNote.addEventListener('click', () => {
    const day = selectedDate.getDate();
    openNoteModalForNew(day);
});

notesListModal.addEventListener('click', (e) => {
    if (e.target === notesListModal) {
        notesListModal.classList.add('hidden');
    }
});

darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
});

financeNavButton.addEventListener('click', () => {
    window.location.href = 'finance.html';
});

// Apply Dark Mode from Local Storage
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
}

// Initialize
initCalendar();
document.addEventListener('DOMContentLoaded', () => {
    loadArtistsFromLocalStorage();
    document.getElementById('splashModal').style.display = 'block'; // Show splash screen on load
    setupEventListeners();
    
    // Initialize draft functionality if form is visible
    if (document.getElementById('formContainer').style.display !== 'none') {
        initializeDraftFunctionality();
    }
});

// Setup all event listeners
function setupEventListeners() {
    // Form submission for adding artists
    document.getElementById('artistForm').addEventListener('submit', handleAddArtist);
    
    // Toggle form visibility
    document.getElementById('toggleFormButton').addEventListener('click', toggleForm);
    
    // Modal close buttons
    document.getElementById('closeModalButton').addEventListener('click', closeEditModal);
    document.getElementById('closeSplashButton').addEventListener('click', () => {
        document.getElementById('splashModal').style.display = 'none';
    });
    
    // Edit artist form submission
    document.getElementById('editArtistForm').addEventListener('submit', saveEditedArtist);
    
    // Close modals when clicking outside content
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Live preview handlers
    setupPreviewHandlers();
}

// Handle add artist form submission
function handleAddArtist(event) {
    event.preventDefault();
    
    const artistName = document.getElementById('artistName').value;
    const artistImage = document.getElementById('artistImage').value;
    const artistURL = document.getElementById('artistURL').value;
    const artistGenre = document.getElementById('artistGenre').value;
    const artistVibes = document.getElementById('artistVibes').value;
    const artistComment = document.getElementById('artistComment').value;
    const artistPreview = document.getElementById('artistPreview').value;

    const artist = {
        id: Date.now(),
        name: artistName,
        image: artistImage,
        url: artistURL,
        genre: artistGenre,
        vibes: artistVibes,
        comment: artistComment,
        preview: artistPreview
    };

    addArtistToCollection(artist);
    saveArtistToLocalStorage(artist);

    // Clear draft on successful submission
    clearDraftOnSubmit();

    // Show a success message
    showNotification(`${artistName} added to your collection!`);
    
    // Reset form and hide it
    document.getElementById('artistForm').reset();
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('header').style.display = 'block';
    
    // Update toggle button text
    const toggleButton = document.getElementById('toggleFormButton');
    toggleButton.innerHTML = '<i class="fas fa-plus"></i> Add Artist';
    
    // Reset preview
    resetPreview();
}

// Simple notification system
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--primary-color)';
        notification.style.color = 'white';
        notification.style.padding = '12px 24px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1000';
        notification.style.transition = 'transform 0.3s, opacity 0.3s';
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        document.body.appendChild(notification);
    }
    
    // Set message and show notification
    notification.textContent = message;
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
        }, 3000);
    }, 10);
}

// Toggle the add artist form
function toggleForm() {
    toggleFormWithDraft();
}

// Setup live preview handlers for the add artist form
function setupPreviewHandlers() {
    // Name preview
    document.getElementById('artistName').addEventListener('input', function() {
        document.getElementById('previewName').textContent = this.value || 'Artist Name';
    });
    
    // Image preview
    document.getElementById('artistImage').addEventListener('input', function() {
        const previewImage = document.getElementById('previewImage');
        if (this.value && isValidUrl(this.value)) {
            previewImage.src = this.value;
            previewImage.onerror = function() {
                this.src = 'https://placehold.co/300x300?text=Invalid+Image+URL';
            };
        } else {
            previewImage.src = 'https://placehold.co/300x300?text=Preview+Image';
        }
    });
    
    // Genre preview
    document.getElementById('artistGenre').addEventListener('input', function() {
        document.getElementById('previewGenre').textContent = this.value || 'Genre';
    });
    
    // Vibes preview
    document.getElementById('artistVibes').addEventListener('input', function() {
        document.getElementById('previewVibes').textContent = this.value || 'Vibes';
    });
    
    // Comment preview
    document.getElementById('artistComment').addEventListener('input', function() {
        document.getElementById('previewComment').textContent = this.value || 'Your comments will appear here...';
    });
}

// Helper function to validate URLs
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Reset preview to default state
function resetPreview() {
    document.getElementById('previewName').textContent = 'Artist Name';
    document.getElementById('previewImage').src = 'https://placehold.co/300x300?text=Preview+Image';
    document.getElementById('previewGenre').textContent = 'Genre';
    document.getElementById('previewVibes').textContent = 'Vibes';
    document.getElementById('previewComment').textContent = 'Your comments will appear here...';
}

// Add artist to the collection UI
function addArtistToCollection(artist) {
    const artistCard = document.createElement('div');
    artistCard.classList.add('artistCard');
    artistCard.setAttribute('data-id', artist.id);

    // Create image container with overlay
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');
    const artistImage = document.createElement('img');
    artistImage.src = artist.image || 'https://placehold.co/300x300?text=No+Image';
    artistImage.alt = artist.name;
    artistImage.addEventListener('click', () => {
        window.open(artist.url, '_blank', 'noopener noreferrer');
    });
    imgContainer.appendChild(artistImage);
    artistCard.appendChild(imgContainer);

    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('artistCard-content');

    // Add artist name
    const artistNameElement = document.createElement('h2');
    artistNameElement.textContent = artist.name;
    contentContainer.appendChild(artistNameElement);

    // Add meta tags container
    const metaContainer = document.createElement('div');
    metaContainer.classList.add('artistCard-meta');

    // Add genre tag
    const genreTag = document.createElement('span');
    genreTag.classList.add('artistCard-tag');
    genreTag.textContent = artist.genre;
    metaContainer.appendChild(genreTag);

    // Add vibes tag
    const vibesTag = document.createElement('span');
    vibesTag.classList.add('artistCard-tag');
    vibesTag.textContent = artist.vibes;
    metaContainer.appendChild(vibesTag);
    
    contentContainer.appendChild(metaContainer);

    // Add comment
    const commentElement = document.createElement('p');
    commentElement.textContent = artist.comment;
    commentElement.classList.add('comment');
    contentContainer.appendChild(commentElement);

    artistCard.appendChild(contentContainer);

    // Add Spotify player
    if (artist.preview) {
        const iframeElement = document.createElement('iframe');
        iframeElement.src = `https://open.spotify.com/embed/track/${extractSpotifyTrackId(artist.preview)}`;
        iframeElement.classList.add('spotify-player');
        iframeElement.frameBorder = "0";
        iframeElement.allow = "encrypted-media";
        artistCard.appendChild(iframeElement);

        // Show player on hover
        artistCard.addEventListener('mouseenter', () => {
            iframeElement.style.display = "block";
        });

        artistCard.addEventListener('mouseleave', () => {
            iframeElement.style.display = "none";
        });
    }

    // Add action buttons container
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    // Add edit button
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.title = 'Edit artist';
    editButton.addEventListener('click', () => openEditModalWithDraft(artist.id));
    actionsDiv.appendChild(editButton);

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.title = 'Delete artist';
    deleteButton.addEventListener('click', () => confirmDelete(artist.id, artist.name));
    actionsDiv.appendChild(deleteButton);

    // Add open link button
    const linkButton = document.createElement('button');
    linkButton.innerHTML = '<i class="fas fa-external-link-alt"></i>';
    linkButton.title = 'Visit artist page';
    linkButton.addEventListener('click', () => {
        window.open(artist.url, '_blank', 'noopener noreferrer');
    });
    actionsDiv.appendChild(linkButton);

    artistCard.appendChild(actionsDiv);

    // Add to collection
    document.getElementById('artistCollection').appendChild(artistCard);
}

// Extract Spotify track ID from URL
function extractSpotifyTrackId(url) {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : '';
}

// Confirm before deleting artist
function confirmDelete(id, name) {
    // Create a simple confirm modal
    const confirmModal = document.createElement('div');
    confirmModal.classList.add('modal');
    confirmModal.style.display = 'block';
    
    const confirmContent = document.createElement('div');
    confirmContent.classList.add('modal-content');
    
    const confirmText = document.createElement('p');
    confirmText.textContent = `Are you sure you want to delete ${name} from your collection?`;
    confirmText.style.marginBottom = '20px';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.background = 'transparent';
    cancelButton.style.border = '1px solid #aaa';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';
    
    const deleteConfirmButton = document.createElement('button');
    deleteConfirmButton.textContent = 'Delete';
    deleteConfirmButton.style.background = '#e53935';
    deleteConfirmButton.style.color = 'white';
    deleteConfirmButton.style.border = 'none';
    deleteConfirmButton.style.padding = '8px 16px';
    deleteConfirmButton.style.borderRadius = '4px';
    deleteConfirmButton.style.cursor = 'pointer';
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(deleteConfirmButton);
    
    confirmContent.appendChild(confirmText);
    confirmContent.appendChild(buttonContainer);
    confirmModal.appendChild(confirmContent);
    
    document.body.appendChild(confirmModal);
    
    // Event listeners
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(confirmModal);
    });
    
    deleteConfirmButton.addEventListener('click', () => {
        deleteArtist(id);
        document.body.removeChild(confirmModal);
        showNotification(`${name} removed from your collection.`);
    });
    
    // Close when clicking outside
    confirmModal.addEventListener('click', (event) => {
        if (event.target === confirmModal) {
            document.body.removeChild(confirmModal);
        }
    });
}

// Save artist to localStorage
function saveArtistToLocalStorage(artist) {
    let artists = JSON.parse(localStorage.getItem('artists')) || [];
    artists.push(artist);
    localStorage.setItem('artists', JSON.stringify(artists));
}

// Load artists from localStorage
function loadArtistsFromLocalStorage() {
    const artists = JSON.parse(localStorage.getItem('artists')) || [];
    
    // Clear existing collection before loading
    document.getElementById('artistCollection').innerHTML = '';
    
    // Add artists in reverse chronological order (newest first)
    artists.sort((a, b) => b.id - a.id).forEach(artist => {
        addArtistToCollection(artist);
    });
}

// Open edit modal for artist
function openEditModal(id) {
    let artists = JSON.parse(localStorage.getItem('artists')) || [];
    const artist = artists.find(artist => artist.id === id);

    if (artist) {
        document.getElementById('editArtistName').value = artist.name;
        document.getElementById('editArtistImage').value = artist.image;
        document.getElementById('editArtistURL').value = artist.url;
        document.getElementById('editArtistGenre').value = artist.genre;
        document.getElementById('editArtistVibes').value = artist.vibes;
        document.getElementById('editArtistComment').value = artist.comment;
        document.getElementById('editArtistPreview').value = artist.preview;
        document.getElementById('editArtistForm').dataset.id = artist.id;

        document.getElementById('editModal').style.display = 'block';
    }
}

// Close edit modal
function closeEditModal() {
    draftState.isEditing = false;
    document.getElementById('editModal').style.display = 'none';
}

// Save edited artist
function saveEditedArtist(event) {
    event.preventDefault();

    const artistId = parseInt(document.getElementById('editArtistForm').dataset.id);
    const artistName = document.getElementById('editArtistName').value;
    const artistImage = document.getElementById('editArtistImage').value;
    const artistURL = document.getElementById('editArtistURL').value;
    const artistGenre = document.getElementById('editArtistGenre').value;
    const artistVibes = document.getElementById('editArtistVibes').value;
    const artistComment = document.getElementById('editArtistComment').value;
    const artistPreview = document.getElementById('editArtistPreview').value;

    let artists = JSON.parse(localStorage.getItem('artists')) || [];
    const artistIndex = artists.findIndex(artist => artist.id === artistId);

    if (artistIndex > -1) {
        artists[artistIndex] = {
            id: artistId,
            name: artistName,
            image: artistImage,
            url: artistURL,
            genre: artistGenre,
            vibes: artistVibes,
            comment: artistComment,
            preview: artistPreview
        };

        localStorage.setItem('artists', JSON.stringify(artists));
        
        // Refresh collection display and show notification
        document.getElementById('artistCollection').innerHTML = '';
        loadArtistsFromLocalStorage();
        closeEditModal();
        showNotification(`${artistName} updated successfully!`);
    }
}

// Delete artist from collection
function deleteArtist(id) {
    let artists = JSON.parse(localStorage.getItem('artists')) || [];
    const artistToDelete = artists.find(artist => artist.id === id);
    artists = artists.filter(artist => artist.id !== id);
    localStorage.setItem('artists', JSON.stringify(artists));

    const artistCard = document.querySelector(`.artistCard[data-id='${id}']`);
    if (artistCard) {
        // Add a fade-out animation
        artistCard.style.transition = 'opacity 0.3s, transform 0.3s';
        artistCard.style.opacity = '0';
        artistCard.style.transform = 'scale(0.8)';
        
        // Remove after animation completes
        setTimeout(() => {
            artistCard.remove();
        }, 300);
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'searchInput';
    searchInput.placeholder = 'Search your collection...';
    searchInput.classList.add('search-input');
    
    // Insert before the artistCollection
    const container = document.querySelector('.container');
    const artistCollection = document.getElementById('artistCollection');
    container.insertBefore(searchInput, artistCollection);
    
    // Add event listener for search input
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const artistCards = document.querySelectorAll('.artistCard');
        
        artistCards.forEach(card => {
            const name = card.querySelector('h2').textContent.toLowerCase();
            const genre = card.querySelector('.artistCard-tag').textContent.toLowerCase();
            const vibes = card.querySelectorAll('.artistCard-tag')[1]?.textContent.toLowerCase() || '';
            
            if (name.includes(searchTerm) || genre.includes(searchTerm) || vibes.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ========== DRAFT FUNCTIONALITY ==========

// Draft management state
let draftState = {
    isEditing: false,
    isDraftModalShowing: false,
    draftCheckTimer: null,
    lastDraftUpdate: null,
    autoSaveTimer: null
};

// Initialize draft functionality
function initializeDraftFunctionality() {
    setupDraftEventListeners();
    
    // Check for existing draft after a delay when form opens
    setTimeout(() => {
        if (!draftState.isEditing && !draftState.isDraftModalShowing) {
            checkForExistingDraft();
        }
    }, 1000);
}

// Setup event listeners for draft functionality
function setupDraftEventListeners() {
    // Modal close buttons
    document.getElementById('closeDraftModalButton').addEventListener('click', closeDraftModal);
    document.getElementById('cancelDraftButton').addEventListener('click', closeDraftModal);
    
    // Draft action buttons
    document.getElementById('recoverDraftButton').addEventListener('click', recoverDraft);
    document.getElementById('discardDraftButton').addEventListener('click', discardDraft);
    document.getElementById('manualDraftRecoveryButton').addEventListener('click', manualDraftRecovery);
    
    // Form input listeners for auto-save
    const formInputs = [
        'artistName', 'artistImage', 'artistURL', 
        'artistGenre', 'artistVibes', 'artistComment', 'artistPreview'
    ];
    
    formInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', debounceAutoSave);
        }
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.id === 'draftRecoveryModal') {
            closeDraftModal();
        }
    });
}

// Debounced auto-save function
function debounceAutoSave() {
    if (draftState.isDraftModalShowing || draftState.isEditing) {
        return;
    }
    
    clearTimeout(draftState.autoSaveTimer);
    draftState.autoSaveTimer = setTimeout(() => {
        updateDraftIfMeaningful();
    }, 2000); // 2 second delay for auto-save
}

// Update draft only if content is meaningful
function updateDraftIfMeaningful() {
    const formData = getCurrentFormData();
    
    // Check if content meets minimum requirements
    const hasMeaningfulContent = (
        (formData.name && formData.name.length >= 2) ||
        (formData.genre && formData.genre.length >= 2) ||
        (formData.comment && formData.comment.length >= 10)
    );
    
    if (hasMeaningfulContent) {
        saveDraft(formData);
        draftState.lastDraftUpdate = Date.now();
        updateManualRecoveryButton();
    }
}

// Get current form data
function getCurrentFormData() {
    return {
        name: document.getElementById('artistName').value.trim(),
        image: document.getElementById('artistImage').value.trim(),
        url: document.getElementById('artistURL').value.trim(),
        genre: document.getElementById('artistGenre').value.trim(),
        vibes: document.getElementById('artistVibes').value.trim(),
        comment: document.getElementById('artistComment').value.trim(),
        preview: document.getElementById('artistPreview').value.trim(),
        timestamp: Date.now()
    };
}

// Save draft to localStorage
function saveDraft(formData) {
    try {
        localStorage.setItem('artistFormDraft', JSON.stringify(formData));
    } catch (error) {
        console.warn('Could not save draft:', error);
    }
}

// Get draft from localStorage
function getDraft() {
    try {
        const draft = localStorage.getItem('artistFormDraft');
        return draft ? JSON.parse(draft) : null;
    } catch (error) {
        console.warn('Could not load draft:', error);
        return null;
    }
}

// Check for existing draft with validation
function checkForExistingDraft() {
    const draft = getDraft();
    
    if (!draft) {
        return;
    }
    
    // Validate draft has substantial content
    const hasSubstantialContent = (
        (draft.name && draft.name.length >= 2) ||
        (draft.genre && draft.genre.length >= 2) ||
        (draft.comment && draft.comment.length >= 10)
    );
    
    if (hasSubstantialContent && !isFormEmpty()) {
        // Only show modal if there's a draft AND current form has content
        return;
    }
    
    if (hasSubstantialContent && isFormEmpty()) {
        showDraftRecoveryModal(draft);
    }
}

// Check if form is empty
function isFormEmpty() {
    const formData = getCurrentFormData();
    return !formData.name && !formData.genre && !formData.comment && 
           !formData.image && !formData.url && !formData.vibes && !formData.preview;
}

// Show draft recovery modal
function showDraftRecoveryModal(draft) {
    draftState.isDraftModalShowing = true;
    populateDraftPreview(draft);
    document.getElementById('draftRecoveryModal').style.display = 'block';
}

// Populate draft preview in modal
function populateDraftPreview(draft) {
    const contentsList = document.getElementById('draftContents');
    contentsList.innerHTML = '';
    
    const fields = [
        { key: 'name', label: 'Artist Name' },
        { key: 'genre', label: 'Genre' },
        { key: 'vibes', label: 'Vibes' },
        { key: 'comment', label: 'Comment' },
        { key: 'image', label: 'Image URL' },
        { key: 'url', label: 'Artist URL' },
        { key: 'preview', label: 'Spotify Preview' }
    ];
    
    fields.forEach(field => {
        if (draft[field.key] && draft[field.key].trim()) {
            const li = document.createElement('li');
            const value = draft[field.key].length > 50 
                ? draft[field.key].substring(0, 50) + '...' 
                : draft[field.key];
            li.textContent = `${field.label}: ${value}`;
            contentsList.appendChild(li);
        }
    });
    
    // Add timestamp if available
    if (draft.timestamp) {
        const li = document.createElement('li');
        const date = new Date(draft.timestamp);
        li.textContent = `Saved: ${date.toLocaleString()}`;
        li.style.fontStyle = 'italic';
        li.style.color = 'var(--text-secondary)';
        contentsList.appendChild(li);
    }
}

// Recover draft
function recoverDraft() {
    const draft = getDraft();
    if (draft) {
        // Populate form fields
        document.getElementById('artistName').value = draft.name || '';
        document.getElementById('artistImage').value = draft.image || '';
        document.getElementById('artistURL').value = draft.url || '';
        document.getElementById('artistGenre').value = draft.genre || '';
        document.getElementById('artistVibes').value = draft.vibes || '';
        document.getElementById('artistComment').value = draft.comment || '';
        document.getElementById('artistPreview').value = draft.preview || '';
        
        // Trigger preview updates
        document.getElementById('artistName').dispatchEvent(new Event('input'));
        document.getElementById('artistImage').dispatchEvent(new Event('input'));
        document.getElementById('artistGenre').dispatchEvent(new Event('input'));
        document.getElementById('artistVibes').dispatchEvent(new Event('input'));
        document.getElementById('artistComment').dispatchEvent(new Event('input'));
        
        showNotification('Draft recovered successfully!');
    }
    
    closeDraftModal();
}

// Discard draft
function discardDraft() {
    try {
        localStorage.removeItem('artistFormDraft');
        showNotification('Draft discarded.');
    } catch (error) {
        console.warn('Could not discard draft:', error);
    }
    
    updateManualRecoveryButton();
    closeDraftModal();
}

// Close draft modal
function closeDraftModal() {
    draftState.isDraftModalShowing = false;
    document.getElementById('draftRecoveryModal').style.display = 'none';
}

// Manual draft recovery
function manualDraftRecovery() {
    const draft = getDraft();
    if (draft) {
        showDraftRecoveryModal(draft);
    }
}

// Update manual recovery button visibility
function updateManualRecoveryButton() {
    const button = document.getElementById('manualDraftRecoveryButton');
    const draft = getDraft();
    
    const hasSubstantialDraft = draft && (
        (draft.name && draft.name.length >= 2) ||
        (draft.genre && draft.genre.length >= 2) ||
        (draft.comment && draft.comment.length >= 10)
    );
    
    if (hasSubstantialDraft && !draftState.isEditing && !draftState.isDraftModalShowing) {
        button.style.display = 'flex';
    } else {
        button.style.display = 'none';
    }
}

// Clear draft when form is successfully submitted
function clearDraftOnSubmit() {
    try {
        localStorage.removeItem('artistFormDraft');
        updateManualRecoveryButton();
    } catch (error) {
        console.warn('Could not clear draft:', error);
    }
}

// Enhanced toggle form function with draft support
function toggleFormWithDraft() {
    const formContainer = document.getElementById('formContainer');
    const header = document.getElementById('header');
    const toggleButton = document.getElementById('toggleFormButton');
    
    if (formContainer.style.display === 'none' || !formContainer.style.display) {
        formContainer.style.display = 'block';
        header.style.display = 'none';
        toggleButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
        draftState.isEditing = false;
        
        // Reset the preview to default state
        resetPreview();
        
        // Initialize draft functionality
        initializeDraftFunctionality();
        
    } else {
        formContainer.style.display = 'none';
        header.style.display = 'block';
        toggleButton.innerHTML = '<i class="fas fa-plus"></i> Add Artist';
        
        // Clear timers
        clearTimeout(draftState.draftCheckTimer);
        clearTimeout(draftState.autoSaveTimer);
    }
}

// Enhanced edit modal function with draft support
function openEditModalWithDraft(id) {
    draftState.isEditing = true;
    openEditModal(id);
}
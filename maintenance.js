document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Fade-in when page loads
    const content = document.getElementById('main-content');
    content.style.opacity = '1';

    // 2. Simple Dynamic Status Message
    const statusTag = document.getElementById('status-tag');
    const messages = [
        "Updating Gallery...",
        "Polishing the Vault...",
        "Almost ready..."
    ];
    
    let index = 0;
    setInterval(() => {
        index = (index + 1) % messages.length;
        statusTag.style.opacity = '0'; // Fade out
        
        setTimeout(() => {
            statusTag.textContent = messages[index];
            statusTag.style.opacity = '1'; // Fade in
        }, 500);
    }, 4000);
});
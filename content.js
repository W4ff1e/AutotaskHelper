// Toast Notification Helper (Duplicated for content script context)
const showToast = (message, isError = false) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: isError ? '#d32f2f' : '#323232',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '4px',
        zIndex: '2147483647',
        boxShadow: '0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12)',
        fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        fontSize: '14px',
        opacity: '0',
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: 'none'
    });
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
};

// URL Cleaning Logic
const cleanTicketUrl = (originalUrl) => {
    try {
        const url = new URL(originalUrl);
        const lowerPath = url.pathname.toLowerCase();
        
        // Case 1: Standard MVC URL
        if (lowerPath.includes('ticketdetail.mvc')) {
             const ticketId = url.searchParams.get('ticketId');
             if (ticketId) {
                 return `${url.origin}${url.pathname}?ticketId=${ticketId}`;
             }
        }
        
        // Case 2: ExecuteCommand.aspx (e.g. from Context Menu)
        // Format: .../Autotask/AutotaskExtend/ExecuteCommand.aspx?Code=OpenTicketDetail&TicketID=33155
        if (lowerPath.includes('executecommand.aspx')) {
            const ticketId = url.searchParams.get('TicketID') || url.searchParams.get('ticketID') || url.searchParams.get('ticketId');
            if (ticketId) {
                // Construct the MVC URL manually
                // We assume the MVC path is always /Mvc/ServiceDesk/TicketDetail.mvc 
                return `${url.origin}/Mvc/ServiceDesk/TicketDetail.mvc?ticketId=${ticketId}`;
            }
        }

        return null; 
    } catch (e) {
        return null;
    }
};

// Menu Observer
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            // Check if a menu column was added
            const menuColumns = document.querySelectorAll('.MenuColumn1');
            menuColumns.forEach(menuCol => {
                // Check if we already injected our button to avoid duplicates
                if (menuCol.querySelector('.autotask-helper-copy-btn')) return;



                // Find the "Ticket URL (Link)" button
                // We look for the span with class 'Text' that contains the specific text
                const buttons = Array.from(menuCol.querySelectorAll('.CopyTextMenuButton'));
                const ticketUrlBtn = buttons.find(btn => {
                    const textSpan = btn.querySelector('.Text');
                    return textSpan && textSpan.innerText.trim() === 'Ticket URL (Link)';
                });

                if (ticketUrlBtn) {
                    const container = ticketUrlBtn.parentNode;
                    
                    // Create our button
                    const newBtn = document.createElement('a');
                    newBtn.className = 'CopyTextMenuButton Button ButtonIcon NormalState autotask-helper-copy-btn';
                    
                    // Icon (using the same structure)
                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'Icon';
                    // Optional: Add a custom style or class to Icon to make it look distinct if possible
                    // iconSpan.style.backgroundImage = '...'; 
                    
                    // Text
                    const textSpan = document.createElement('span');
                    textSpan.className = 'Text';
                    textSpan.innerText = 'Copy Clean Ticket URL';

                    newBtn.appendChild(iconSpan);
                    newBtn.appendChild(textSpan);

                    // Click Handler
                    newBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        // Programmatically click the original button to put URL in clipboard
                        ticketUrlBtn.click();

                        // Wait a moment for the clipboard to update
                        await new Promise(r => setTimeout(r, 100));

                        try {
                            const text = await navigator.clipboard.readText();
                            const cleanUrl = cleanTicketUrl(text);

                            if (cleanUrl) {
                                await navigator.clipboard.writeText(cleanUrl);
                                showToast('Clean Ticket URL Copied!');
                            } else {
                                showToast('Copied original URL (Cleaning failed).', true);
                            }
                        } catch (err) {
                            showToast('Clipboard access denied. Check permissions.', true);
                        }
                    });

                    // Insert after the original button
                    container.insertBefore(newBtn, ticketUrlBtn.nextSibling);
                }
            });
        }
    }
});

// Menu Observer Helper
const startMenuObserver = () => {
    observer.observe(document.body, { childList: true, subtree: true });
};

const stopMenuObserver = () => {
    observer.disconnect();
};

// Initialize based on settings
const initGridButton = () => {
    chrome.storage.sync.get({ gridButtonEnabled: true }, (items) => {
        if (items.gridButtonEnabled) {
            startMenuObserver();
        }
    });
};

// Listen for changes
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.gridButtonEnabled) {
        if (changes.gridButtonEnabled.newValue) {
            startMenuObserver();
        } else {
            stopMenuObserver();
        }
    }
});

// Start
initGridButton();


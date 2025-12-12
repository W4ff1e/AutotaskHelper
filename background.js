
// Function to update the redirect rule state based on storage
const updateRedirectRule = (enabled) => {
    const rulesetId = "ruleset_1";
    if (enabled) {
        chrome.declarativeNetRequest.updateEnabledRulesets({
            enableRulesetIds: [rulesetId]
        });
    } else {
        chrome.declarativeNetRequest.updateEnabledRulesets({
            disableRulesetIds: [rulesetId]
        });
    }
};

// Initialize rule state on startup/install
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "autotask-helper-root",
        title: "Autotask - Copy Clean Link",
        contexts: ["all"],
        documentUrlPatterns: ["*://*.autotask.net/Mvc/ServiceDesk/TicketDetail.mvc*"]
    });

    // Check storage and set rule state (default to true)
    chrome.storage.sync.get({ redirectEnabled: true }, (items) => {
        updateRedirectRule(items.redirectEnabled);
    });
});

// Update rule when storage changes
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.redirectEnabled) {
        updateRedirectRule(changes.redirectEnabled.newValue);
    }
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "autotask-helper-root") {
    if (tab && tab.id) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
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
                        zIndex: '2147483647', // Max z-index
                        boxShadow: '0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12)',
                        fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                        fontSize: '14px',
                        opacity: '0',
                        transition: 'opacity 0.3s ease-in-out',
                        pointerEvents: 'none' // Don't block clicks
                    });
                    document.body.appendChild(toast);
                    
                    // Trigger reflow for transition
                    requestAnimationFrame(() => {
                        toast.style.opacity = '1';
                    });

                    setTimeout(() => {
                        toast.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(toast);
                        }, 300);
                    }, 3000);
                };

                const url = new URL(window.location.href);
                // Check if path matches TicketDetail.mvc (case-insensitive)
                if (url.pathname.toLowerCase() === '/mvc/servicedesk/ticketdetail.mvc') {
                    const ticketId = url.searchParams.get('ticketId');
                    if (ticketId) {
                        const cleanUrl = `${url.origin}${url.pathname}?ticketId=${ticketId}`;
                        navigator.clipboard.writeText(cleanUrl).then(() => {
                            showToast('URL Cleaned & Copied to Clipboard!');
                        }).catch(err => {
                             showToast('Failed to copy URL.', true);
                        });
                    } else {
                        showToast('Could not find ticketId in this URL.', true);
                    }
                } else {
                    showToast('This is not a Ticket Detail page.', true);
                }
            }
        });
    }
  }
});



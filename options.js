// Saves options to chrome.storage
const saveOptions = () => {
  const redirectEnabled = document.getElementById('redirectEnabled').checked;
  const gridButtonEnabled = document.getElementById('gridButtonEnabled').checked;

  chrome.storage.sync.set(
    { redirectEnabled, gridButtonEnabled },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.style.opacity = '1';
      setTimeout(() => {
        status.style.opacity = '0';
      }, 750);
    }
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    { redirectEnabled: true, gridButtonEnabled: true }, // Defaults
    (items) => {
      document.getElementById('redirectEnabled').checked = items.redirectEnabled;
      document.getElementById('gridButtonEnabled').checked = items.gridButtonEnabled;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('redirectEnabled').addEventListener('change', saveOptions);
document.getElementById('gridButtonEnabled').addEventListener('change', saveOptions);

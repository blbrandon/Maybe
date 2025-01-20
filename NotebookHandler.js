class NotebookHandler {
    constructor() {
      this.notebooks = document.querySelectorAll('.moleskine-notebook');
      this.initialize();
    }
  
    initialize() {
      this.notebooks.forEach((notebook) => {
        notebook.addEventListener('click', () => {
          const isOngoing = notebook.hasAttribute('data-messages');
          if (isOngoing) {
            this.startMessageFlow(notebook);
          } else {
            this.showSingleMessage(notebook.getAttribute('data-message'));
          }
        });
      });
    }
  
    startMessageFlow(notebook) {
      const messageFlow = JSON.parse(notebook.getAttribute('data-messages'));
      let currentIndex = 0;
  
      const showNextMessage = (userResponse) => {
        if (userResponse !== undefined) {
          const nextIndex = messageFlow[currentIndex].responses[userResponse];
          if (nextIndex === null) {
            this.closeMessage();
            return;
          }
          currentIndex = nextIndex;
        }
        const message = messageFlow[currentIndex].message;
        this.showMessage(message, showNextMessage);
      };
  
      showNextMessage();
    }
  
    showSingleMessage(message) {
      this.showMessage(message, () => this.closeMessage());
    }
  
    showMessage(message, onResponse) {
      this.closeMessage(); // Ensure previous message container is removed
  
      const messageContainer = document.createElement('div');
      messageContainer.className = 'message-container';
      messageContainer.textContent = message;
  
      Object.assign(messageContainer.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        background: '#fbfae8',
        color: '#222',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
        borderRadius: '10px',
        fontFamily: '"Quicksand", sans-serif',
        fontSize: '18px',
        textAlign: 'center',
        zIndex: '1000',
        width: '90%',
        maxWidth: '400px',
      });
  
      const buttonsContainer = document.createElement('div');
      buttonsContainer.style.marginTop = '15px';
  
      if (onResponse.length > 0) {
        const yesButton = document.createElement('button');
        yesButton.textContent = 'Yes';
        Object.assign(yesButton.style, this.getButtonStyles());
        yesButton.addEventListener('click', () => onResponse('yes'));
  
        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        Object.assign(noButton.style, this.getButtonStyles());
        noButton.addEventListener('click', () => onResponse('no'));
  
        buttonsContainer.appendChild(yesButton);
        buttonsContainer.appendChild(noButton);
      } else {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        Object.assign(closeButton.style, this.getButtonStyles());
        closeButton.addEventListener('click', () => onResponse());
        buttonsContainer.appendChild(closeButton);
      }
  
      messageContainer.appendChild(buttonsContainer);
      document.body.appendChild(messageContainer);
    }
  
    closeMessage() {
      const existingContainer = document.querySelector('.message-container');
      if (existingContainer) document.body.removeChild(existingContainer);
    }
  
    getButtonStyles() {
      return {
        padding: '10px 20px',
        backgroundColor: '#cc4b48',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        margin: '0 10px',
      };
    }
  }
  
  export default NotebookHandler;
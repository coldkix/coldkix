document.addEventListener('DOMContentLoaded', () => {
    const inputForm = document.getElementById('input-form');
    const inputField = document.getElementById('input-field');
    const messagesDiv = document.getElementById('messages');

    // Store conversation history
    let conversationHistory = [];

    inputForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the form from refreshing the page
        const userInput = inputField.value.trim();
        if (!userInput) return; // Do nothing if input is empty

        // Display user message
        addMessage(userInput, 'user');

        // Add to conversation history
        conversationHistory.push({ role: 'user', content: userInput });

        inputField.value = ''; // Clear the input field

        try {
            // Send message to server
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversation: conversationHistory }),
            });

            const data = await response.json();

            if (response.ok) {
                const botReply = data.reply;

                // Display bot message
                addMessage(botReply, 'bot');

                // Add bot reply to conversation history
                conversationHistory.push({ role: 'assistant', content: botReply });
            } else {
                addMessage(`Error: ${data.error}`, 'bot');
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('Error communicating with the server.', 'bot');
        }
    });

    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        // Use formatMessage to render text properly
        messageDiv.innerHTML = formatMessage(message);
        messagesDiv.appendChild(messageDiv);

        // Scroll to the bottom
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }


    // Function to escape HTML and format message content
    function formatMessage(text) {
        // Escape HTML characters to prevent XSS
        const div = document.createElement('div');
        div.textContent = text;
        const escapedText = div.innerHTML;

        // Replace newlines with <br> tags for proper line breaks
        return escapedText.replace(/\n/g, '<br>');
    }

});

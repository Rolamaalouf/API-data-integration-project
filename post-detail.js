document.addEventListener('DOMContentLoaded', () => {
    // Get the post ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // Fetch the specific post details using the post ID
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            // Fetch the user details (author's name) based on userId
            fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`)
                .then(userResponse => userResponse.json())
                .then(user => {
                    // Fetch the photos related to the post's userId (albumId)
                    fetch(`https://jsonplaceholder.typicode.com/photos?id=${post.id}`)
                        .then(photoResponse => photoResponse.json())
                        .then(photos => {
                            // Fetch comments for the post
                            fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
                                .then(commentResponse => commentResponse.json())    
                                .then(comments => {
                                    // Call the function to display the post details, the first photo, and comments
                                    displayPostDetails(post, user, photos, comments);
                                })
                                .catch(commentError => console.error('Error fetching comments:', commentError));
                        })
                        .catch(photoError => console.error('Error fetching photos:', photoError));
                })
                .catch(userError => console.error('Error fetching user details:', userError));
        })
        .catch(error => console.error('Error fetching post details:', error));

    // Display post details, the first photo, and comments on the page
    function displayPostDetails(post, user, photos, comments) {
        const postDetailContainer = document.getElementById('post-detail');

        // Start the content string for the post
        let postContent = '';

        // Add the photo first (above the text)
        if (photos && photos.length > 0) {
            const firstPhoto = photos[0]; // Get the first photo
            postContent += `
                <div class="photo-container">
                    <h2>${post.title}</h2>
                    <img src="${firstPhoto.url}" alt="${firstPhoto.title}" class="post-photo" />
                    <p>${post.body}</p>
                    <h3>Author: ${user.name}</h3> <!-- Replaced userId with user name -->
                    <div class="comments-section">
                        <h3>Comments:</h3>
                        <ol>
            `;
            // Iterate over each comment and display it
            comments.forEach(comment => {
                postContent += `
                    <li class="comment-item">
                        <strong>${comment.name}</strong><br />
                        <em>${comment.email}</em><br />
                        <p>${comment.body}</p>
                    </li>
                `;
            });
            postContent += `</ol></div>`;
        } else {
            postContent += `<p>No comments available for this post.</p>`;
        }

        // Update the HTML with the post details, the photo, and comments
        postDetailContainer.innerHTML = postContent;
    }
});

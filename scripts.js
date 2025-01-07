document.addEventListener('DOMContentLoaded', () => {
    // Fetch posts data from the API
    Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts'),
        fetch('https://jsonplaceholder.typicode.com/photos')
    ])
    .then(([postsResponse, photosResponse]) => {
        return Promise.all([postsResponse.json(), photosResponse.json()]);
    })
    .then(([posts, photos]) => {
        displayPosts(posts, photos);
    })
    .catch(error => console.error('Error fetching data:', error));

    // Function to display posts in the respective sections
    function displayPosts(posts, photos) {
        const featuredPosts = document.getElementById('featured-posts');
        const latestPosts = document.getElementById('latest-posts');
        const popularPosts = document.getElementById('popular-posts');

        // Select the top 3 posts for Featured Posts
        const featured = posts.slice(0, 3);
        featured.forEach(post => {
            const postElement = createPostElement(post, photos);
            featuredPosts.appendChild(postElement);
        });

        // Select the latest 5 posts for Latest Posts
        const latest = posts.slice(3, 8);
        latest.forEach(post => {
            const postElement = createPostElement(post, photos);
            latestPosts.appendChild(postElement);
        });

        // Select random 5 posts for Popular Posts
        const popular = posts.sort(() => 0.5 - Math.random()).slice(0, 5);
        popular.forEach(post => {
            const postElement = createPostElement(post, photos);
            popularPosts.appendChild(postElement);
        });
    }

    // Create a post element with the corresponding photo
    function createPostElement(post, photos) {
        // Find the photo corresponding to the current post
        const postPhoto = photos.find(photo => photo.id === post.id); // Assuming userId is used for photo correlation

        const postElement = document.createElement('div');
        postElement.classList.add('post-item');
        postElement.innerHTML = `
            <img src="${postPhoto ? postPhoto.url : 'https://via.placeholder.com/400x200'}" alt="Post Image">
            <div class="content">
                <h3>${post.title}</h3>
                <p>${post.body.substring(0, 100)}...</p>
                <a href="post-details.html?id=${post.id}" class="read-more">Read More</a>
            </div>
        `;
        return postElement;
    }
});

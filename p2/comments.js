document.getElementById('post-comment').addEventListener('click', function() {
    let comment = document.getElementById('comment').value;
    if (comment) {
        let commentElement = document.createElement('div');
        commentElement.textContent = comment;
        document.getElementById('comment-list').appendChild(commentElement);
        document.getElementById('comment').value = '';
    }
});

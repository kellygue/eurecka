onmessage = e => {
    if(e.data === 'get') {
        fetch(`/api/getposts.php`).catch(err => {
            console.error(`Unable to get content from the server`, err)
        })
    }
}
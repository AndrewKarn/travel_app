async function postServer(data = {}, path ='/') {
    const result = await fetch(`http://localhost:8080/${path}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'location': data})
    })
    console.log(JSON.stringify({'location': data}));
    return result
}

export {postServer}
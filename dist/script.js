
async function downloadMedia(mediaId) {
    console.log(mediaId)
    const url = `/api/igdownload?mediaId=${mediaId}`
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.target = 'blank';
    document.body.appendChild(a);
    a.click();
    // alert(':D your file has downloaded!');
}
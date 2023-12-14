var cursorbackground = document.getElementById('cursorbackground');

// make cursorbackground follow mouse
document.onmousemove = event => {
    const { clientX, clientY } = event;

    cursorbackground.animate({
        left: clientX + 'px',
        top: clientY + 'px',
    }, { duration: 500, fill: 'forwards'});
    }
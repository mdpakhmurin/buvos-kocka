window.addEventListener('keydown', function( event ){
    if (event.code == 'Space')
        document.querySelector('.buvos-kocka__start-message').classList.add('buvos-kocka__start-message_hidden');
})
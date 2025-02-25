// Dashboard sidebar toggler
document.getElementById('toggleSidebar').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('mainContent').classList.toggle('expanded');
});

//account.ejs - make the profile photo as the input
document.getElementById('profilePicPreview').addEventListener('click', function () {
    document.getElementById('profilePic').click();
});

document.getElementById('profilePic').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profilePicPreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

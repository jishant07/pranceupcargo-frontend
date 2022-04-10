var dataSidebarSize = $('html').attr('data-sidebar-size');
var sidebarFullTitle = $('#sidebar-title').text();
var sidebarShortTitle = 'PC';
dataSidebarSize = 'lg';

function toggleSidebarWidth() {
    //Toggle sidebar width
    if ($('.hamburger-icon').hasClass('open')) {
        $('html').attr('data-sidebar-size', 'sm');
        $('#sidebar-title').text(sidebarShortTitle);
    } else {
        $('html').attr('data-sidebar-size', dataSidebarSize);
        $('#sidebar-title').text(sidebarFullTitle);
    }
};